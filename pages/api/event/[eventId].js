import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import Position from "../../../models/position";

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

		switch (req.method) {
			case "POST": {
				const { event, positions } = req.body;

				let userIds = [];
				let usersDataArray = [];

				const eventModel = await new Event(event);

				positions.forEach(async (pos) => {
					delete pos._id;
					delete pos.name;
					pos.eventId = eventModel._id;
					const positionModel = await new Position(pos);
					eventModel.positions.push(positionModel._id);

					pos.users.forEach((user) => {
						if (!userIds.includes(user)) {
							userIds.push(user);
							usersDataArray.push({
								userId: user,
								data: {
									event: eventModel._id,
									positions: [
										{
											position: positionModel._id,
											label: pos.label,
											status: "new",
										},
									],
								},
							});
						} else {
							usersDataArray.map((userData) =>
								userData.userId === user
									? userData.data.positions.push({
											position: positionModel._id,
											label: pos.label,
											status: "new",
									  })
									: userData
							);
						}
					});
					await positionModel.save();
				});
				await eventModel.save();

				// data.userId === token.id az a kéne vissza adni és akkor nem kell plusz egy lekérdezés, de az async miatt nem ment.
				usersDataArray.forEach(async (data) => {
					await User.findByIdAndUpdate(data.userId, {
						$push: { events: data.data },
					});
				});

				const user = await User.findById(token.id)
					.populate("events.event")
					.populate("events.positions.position");

				if (!user) {
					throw Error("A felhasználói adatok betöltése sikertelen.");
				}

				console.log("user.events", user.events.toObject());

				res.statusCode = 201;
				res.json({
					message: "Sikeresen létrehoztál egy eseményt",
					events: user.events,
					eventId: eventModel._id,
				});
				return;
			}

			case "PUT": {
				const { event, positions, creatorId } = req.body;
				let newPosIds = [];

				if (creatorId !== token.id) {
					throw Error("Nem általad létrehozott esemény");
				}

				if (positions && positions.length) {
					positions.forEach(async (pos) => {
						let positionModel;

						if (!pos._id) {
							delete pos._id;
							delete pos.name;
						} else {
							positionModel = await Position.findByIdAndUpdate(pos._id, pos, {
								new: true,
							});
						}

						if (pos.invition.type !== "creator") {
							if (positionModel) {
								//Ki kell e értesíteni a pozicióra jelentkezett user-eket?
							} else {
								positionModel = await new Position(pos);
								newPosIds.push(positionModel._id);

								const userUpdateObjct = {
									event: eventId,
									positions: [
										{
											position: positionModel,
											label: pos.invition.type === "direct" ? 4 : 5,
											status: "new",
											messages: [],
										},
									],
								};
								const test = await User.updateMany(
									{
										$and: [
											{ _id: { $nin: [token.id] } },
											{ "metaData.positions": { $in: [pos.posName] } },
										],
									},
									{
										$push: {
											events: userUpdateObjct,
										},
									}
								);

								const test2 = await positionModel.save();

								console.log("test", test);
								console.log("test2", test2);
							}
						}
					});
				}

				const eventModel = await Event.findByIdAndUpdate(eventId, event, {
					new: true,
				});
				if (!eventModel) {
					throw Error("Nem található az esemény. [eventId]:266");
				}
				if (newPosIds) {
					eventModel.positions.push(newPosIds);
				}
				await eventModel.save();

				const user = await User.findById(token.id)
					.populate("events.event")
					.populate("events.positions.position");

				if (!user) {
					throw Error("A felhasználói adatok betöltése sikertelen.");
				}

				res.statusCode = 202;
				res.json({
					message: "Sikeresen modósítottad az eseményt",
					events: user.events,
				});
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

				await Position.deleteMany({
					_id: { $in: event.positions },
				});

				await User.updateMany(
					{
						"events.event": { $in: event._id },
					},
					{ $pull: { events: { event: event._id } } }
				);

				await event.deleteOne();
				res.statusCode = 202;
				res.json({
					message: "Sikeresen törölted az eseményt",
					eventId: eventId,
				});
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
