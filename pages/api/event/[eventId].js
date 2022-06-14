import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const dataInfos = (data) => {
	return {
		startDate: data.startDate,
		endDate: data.endDate,
		id: data.id,
		department: data.department,
		label: data.label,
		title: data.title,
		shortTitle: data.shortTitle,
		description: data.description,
		location: data.location,
		creatorId: data.creator,
		creatorName: data.creatorName,
	};
};

const dateInfos = (c, date) => {
	return {
		yourPosition: c.pos,
		id: date.id,
		startTime: date.startTime,
		endTime: date.endTime,
		invitionType: c.invitionType.name,
	};
};

const handler = async (req, res) => {
	const eventId = req.query.eventId;
	dbConnect();

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const updateAllNewUser = async (userId, userDates, evtId) => {
			const user = await User.findById(userId);
			const theEvent = await user.events.find(
				(usrEvt) => eventId === usrEvt?._id.toString()
			);
			if (theEvent) {
				//valszeg ez nem jó mert így lenulláza a dolgot
				await user.events.pull(theEvent);
			}
			await user.events.push({ _id: evtId, ...userDates });
			await user.save();
		};

		const UsersInvite = async (crewIds, crewDates, evtId) => {
			const UsersArray = await User.find({
				_id: { $in: crewIds },
			});

			UsersArray.forEach(async (user) => {
				const theUser = await crewDates.find(
					(crewDate) => crewDate.userId.toString() === user._id.toString()
				);
				if (theUser) {
					await updateAllNewUser(user._id, theUser, evtId);
				}
			});
		};

		const invition = async (data, evtId) => {
			let crewDates = [];
			let directInvitCrewIds = [];
			let openInvitCrewIds = [];

			data.dates.forEach((date) => {
				date.crew.forEach((c) => {
					if (c.invitionType?.name === "direct") {
						if (!directInvitCrewIds.includes(c._id)) {
							directInvitCrewIds.push(c._id);
							crewDates.push({
								_id: eventId,
								...dataInfos(data),
								userId: c._id,
								label: c.label,
								dates: [dateInfos(c, date)],
							});
						} else {
							crewDates.forEach((crewDate) => {
								if (crewDate.userId === c._id) {
									crewDate.dates.push(dateInfos(c, date));
								}
							});
						}
					} else if (c.invitionType && c.invitionType.result) {
						c.invitionType.result.forEach((reslt) => {
							if (!openInvitCrewIds.includes(reslt._id)) {
								openInvitCrewIds.push(reslt._id);
								crewDates.push({
									...dataInfos(data),
									userId: reslt._id,
									label: c.label,
									dates: [dateInfos(c, date)],
								});
							} else {
								crewDates.forEach((crewDate) => {
									if (crewDate.userId === reslt._id) {
										crewDate.dates.push(dateInfos(c, date));
									}
								});
							}
						});
					}
					if (c.status === "new") {
						c.status = "invited";
					}
				});
			});

			let crewIds = [...directInvitCrewIds];
			openInvitCrewIds.forEach((OIds) => {
				if (!crewIds.includes(OIds)) {
					crewIds.push(OIds);
				}
			});
			await UsersInvite(crewIds, crewDates, evtId);
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
				if (!user) {
					throw Error("A felhasználói adatok betöltése sikertelen.");
				}
				user.ownEvents.push({ _id: event._id, label: data.label });
				await invition(data, event._id);
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
				const event = await Event.findByIdAndUpdate(eventId, data);

				await invition(data, eventId);

				res.statusCode = 202;
				res.json({ message: "Sikeresen modósítottad az eseményt", event });
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
