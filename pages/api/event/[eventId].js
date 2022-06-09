import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	const eventId = req.query.eventId;
	dbConnect();

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const updateAllNewUser = async (userId, userDates) => {
			const user = await User.findById(userId);
			const theEvent = await user.events.find(
				(usrEvt) => eventId === usrEvt?._id.toString()
			);

			if (!userDates) {
				console.log("nincs userDates", user.name);
				return;
			}

			if (theEvent) {
				await user.events.pull(theEvent);
			}
			await user.events.push({ _id: eventId, ...userDates });
			await user.save();
		};

		switch (req.method) {
			case "GET": {
				let theEvent = [];
				if (eventId.length === 24 && !isNaN(Number("0x" + eventId))) {
					theEvent = await Event.findById(eventId);
				} else {
					theEvent = null;
				}

				if (!theEvent) {
					res.statusCode = 404;
					res.json({ message: `Nincs ilyen esemény.`, error: true });
					return;
				}

				res.statusCode = 200;
				res.json(theEvent);
				return;
			}

			case "POST": {
				const data = req.body;
				const event = new Event(data);
				const user = await User.findById(token.id);
				user.ownEvents.push({ _id: event._id, label: data.label });

				// console.log("data", data.dates);
				// nem csak a baseCrewnal kell
				// data.baseCrew.forEach((user) => {
				// 	invition(user);
				// });

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

				let crewDates = [];
				let crewIds = [];

				data.dates.forEach((date) => {
					date.crew.forEach((c) => {
						if (c._id) {
							if (c.status === "new") {
								c.status = "invited";
							}
							if (!crewIds.includes(c._id)) {
								crewIds.push(c._id);
								crewDates.push({
									...data,
									label: c.label,
									userId: c._id,
									dates: [
										{
											yourPosition: c.pos,
											id: date.id,
											startTime: date.startTime,
											endTime: date.endTime,
										},
									],
								});
							} else {
								crewDates.forEach((crewDate) => {
									if (crewDate.userId === c._id) {
										crewDate.dates.push({
											yourPosition: c.pos,
											id: date.id,
											startTime: date.startTime,
											endTime: date.endTime,
										});
									}
								});
							}
						} else if (c.invitionType) {
							c.invitionType.result.forEach((reslt) =>
								console.log("c", reslt._id)
							);
							// console.log("crewId", crewIds);
							// console.log("crewDates", crewDates);
							// console.log("user.invitionType.result", user.invitionType.result);
							//? nem direkt meghívás ITT TARTOK
						}
					});
				});

				// const invition = (user) => {
				// 	if (user.status === "new") {
				// 		user.status = "invited";
				// 		//invition majd ide kell
				// 		if (user.label === 4) {
				// 			updateAllNewUser(user._id, user.label);
				// 		} else if (user.label === 5) {
				// 			user.invitionType.result.forEach((u) => {
				// 				updateAllNewUser(u._id, user.label);
				// 			});
				// 		}
				// 	}
				// };

				const UsersArray = await User.find({ _id: { $in: crewIds } });

				UsersArray.forEach((user) => {
					const theUser = crewDates.find(
						(crewDate) => crewDate.userId === user._id.toString()
					);

					if (theUser) {
						updateAllNewUser(user._id, theUser);
					} else {
						//ide jön a nem direkt meghívás?
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
