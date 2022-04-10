import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		dbConnect();
		const token = await getToken({
			req,
			secret: process.env.SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		if (!token) {
			res.statusCode = 404;
			res.json({ message: `Nincs hozzáférésed`, error: true });
			return;
		}
		const eventId = req.query.eventId;

		const updateAllNewUser = async (id, label) => {
			const user = await User.findById(id);
			if (!user.events.includes(eventId)) {
				user.events.push({ _id: eventId, label: label });
				await user.save();
			}
		};

		switch (req.method) {
			case "GET": {
				let allEvents = [];
				const user = await User.findById(token.id);
				if (eventId === "all") {
					const events = await Event.find({ _id: user.events });
					events.forEach((e) => {
						user.events.forEach((u) => {
							if (e._id.toString() === u._id.toString()) {
								e.label = u.label;
							}
						});
					});

					const ownEvents = await Event.find({ _id: user.ownEvents });
					ownEvents.forEach((o) => {
						if (o.department === "Privát") {
							o.label = 6;
						} else {
							o.label = 1;
						}
					});

					allEvents = [...events, ...ownEvents];
				} else {
					console.log("user", user);
					//hozzá kell adni az label-t!
					allEvents = await Event.findById(eventId);
				}

				if (!allEvents) {
					res.statusCode = 404;
					res.json({ message: `Nincs ilyen esemény.`, error: true });
					return;
				}

				res.statusCode = 200;
				res.json(allEvents);
				return;
			}

			case "POST": {
				const data = req.body;
				const event = new Event(data);
				const user = await User.findById(token.id);
				user.ownEvents.push({ _id: event._id, label: data.label });

				//nem csak a baseCrewnal kell
				data.baseCrew.forEach((user) => {
					console.log("user", user);
					if (user.status === "new") {
						user.status = "invited";
						//invition majd ide kell
						updateAllNewUser(user._id, user.label);
					}
				});

				await user.save();
				await event.save();

				res.statusCode = 201;
				res.json({ message: "Sikeresen létrehoztál egy eseményt", event });
				return;
			}

			case "PUT": {
				const data = req.body;
				if (data.creator !== token.id) {
					throw Error("Nem általad létrehozott esemény");
				}
				console.log("data", data);

				//nem csak a baseCrewnal kell
				data.baseCrew.forEach((user) => {
					console.log("user", user);
					if (user.status === "new") {
						user.status = "invited";
						//invition majd ide kell
						updateAllNewUser(user._id, user.label);
					}
				});

				await Event.findByIdAndUpdate(eventId, data);
				res.statusCode = 202;
				res.json({ message: "Sikeresen modósítottad az eseményt" });
				return;
			}

			case "DELETE": {
				const event = await Event.findById(eventId);
				if (!event) {
					throw Error("Nincs ilyen esemény");
				}

				if (event.creator.toString() !== token.id) {
					throw Error("Nem általad létrehozott esemény");
				}

				const user = await User.findById(token.id);
				user.ownEvents.pull(eventId);

				//Esetleg hogy az eseményből vegye ki a userId-kat, lehet úgy gyorsabb lenne

				const users = await User.find({ "events._id": eventId });
				users.forEach(async (u) => {
					u.events.pull(eventId);
					await u.save();
				});

				await user.save();
				await event.deleteOne();

				res.statusCode = 202;
				res.json({ message: "Sikeresen törölted az eseményt" });
				return;
			}
		}
	} catch (err) {
		console.log("err", err);
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
