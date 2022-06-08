import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	const updateAllNewUser = async (id, label) => {
		const user = await User.findById(id);
		if (!user.events.includes(eventId)) {
			user.events.push({ _id: eventId, label: label });
			await user.save();
		}
	};

	const invition = (user) => {
		if (user.status === "new") {
			user.status = "invited";
			//invition majd ide kell
			if (user.label === 4) {
				updateAllNewUser(user._id, user.label);
			} else if (user.label === 5) {
				user.invitionType.result.forEach((u) => {
					updateAllNewUser(u._id, user.label);
				});
			}
		}
	};

	try {
		dbConnect();
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});
		const eventId = req.query.eventId;

		switch (req.method) {
			case "GET": {
				let allEvents = [];
				if (eventId.length === 24 && !isNaN(Number("0x" + eventId))) {
					// console.log("user", user);
					allEvents = await Event.findById(eventId);
				} else {
					allEvents = null;
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
					invition(user);
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

				//nem csak a baseCrewnal kell
				data.baseCrew.forEach((user) => {
					invition(user);
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
