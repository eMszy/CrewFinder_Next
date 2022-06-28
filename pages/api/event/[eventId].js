import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import Position from "../../../models/position";

import dbConnect from "../../../shared/dbConnect";
import mongoose from "mongoose";

const EventInfoTreeHandler = (data, pos, label, evtId) => {
	return {
		_id: evtId,
		statDate: data.startDate,
		endDate: data.endDate,
		id: data.id,
		department: data.department,
		title: data.title,
		shortTitle: data.shortTitle,
		description: data.description,
		creator: data.creator,
		creatorName: data.creatorName,
		positions: pos,
		label: label,
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

		const invitionHandler = async (data, evtId) => {
			let positionsIds = [];
			let positionsArray = [];

			data.dates.forEach((date) => {
				date.crew.forEach((c) => {
					if (!positionsIds.includes(c.id) && c.id > 0) {
						positionsIds.push(c.id);
						positionsArray.push({
							id: c.id,
							yourPosition: c.pos,
							invitionType: c.invitionType,
							label: c.label,
							userId: c._id,
							date: [
								{
									id: date.id,
									startTime: date.startTime,
									endTime: date.endTime,
								},
							],
							status: "new",
						});
					} else if (c.id > 0) {
						positionsArray.forEach((pos) => {
							if (pos.id === c.id) {
								pos.date.push({
									id: date.id,
									startTime: date.startTime,
									endTime: date.endTime,
								});
							}
						});
					}
				});
			});

			let usersIdArray = [];
			let usersPosArray = [];

			positionsArray.forEach((pos) => {
				if (pos.invitionType.name === "direct") {
					if (!usersIdArray.includes(pos.userId)) {
						usersIdArray.push(pos.userId);
						usersPosArray.push({ userId: pos.userId, pos: [pos] });
					} else {
						usersPosArray.forEach((userPos) => {
							if (userPos.userId === pos.userId) {
								userPos.pos.push(pos);
							}
						});
					}
				} else {
					pos.invitionType.result.forEach((user) => {
						if (!usersIdArray.includes(user._id)) {
							usersIdArray.push(user._id);
							usersPosArray.push({ userId: user._id, pos: [pos] });
						} else {
							usersPosArray.forEach((userPos) => {
								if (userPos.userId === user._id) {
									userPos.pos.push(pos);
								}
							});
						}
					});
				}
			});

			usersPosArray.forEach(async (userPosArray) => {
				let label;
				userPosArray.pos.forEach((p) => {
					if (!label || p.label < label) {
						label = p.label;
					}
				});

				const newEvent = EventInfoTreeHandler(
					data,
					userPosArray.pos,
					label,
					evtId
				);
				const user = await User.findById(userPosArray.userId);
				if (!user) {
					throw Error("Nincs meg a felhasználó, [eventId]:107");
				}
				let updatedEvents = user.events.filter(
					(event) => event._id.toString() !== evtId
				);
				if (!updatedEvents) {
					updatedEvents = [];
				}
				updatedEvents.push(newEvent);
				user.events = updatedEvents;
				await user.save();
			});
		};

		switch (req.method) {
			case "GET": {
				const agg = [
					{
						$match: {
							eventId: mongoose.Types.ObjectId(eventId),
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "users",
							foreignField: "_id",
							as: "user",
						},
					},
					{
						$unwind: {
							path: "$user",
						},
					},
					{
						$unwind: {
							path: "$user.events",
						},
					},
					{
						$match: {
							"user.events.event": mongoose.Types.ObjectId(eventId),
						},
					},
					{
						$unwind: {
							path: "$user.events.positions",
						},
					},
					{
						$match: {
							$expr: {
								$eq: ["$_id", "$user.events.positions.position"],
							},
						},
					},
					{
						$group: {
							_id: "$_id",
							posName: {
								$first: "$posName",
							},
							// weight: {
							// 	$first: "$weight",
							// },
							invition: {
								$first: "$invition",
							},
							dates: {
								$first: "$dates",
							},
							users: {
								$push: {
									name: "$user.name",
									image: "$user.image",
									_id: "$user._id",
									label: "$user.events.positions.label",
									status: "$user.events.positions.status",
									messages: "$user.events.positions.messages",
								},
							},
						},
					},
				];

				let positions;
				if (eventId.length === 24 && !isNaN(Number("0x" + eventId))) {
					positions = await Position.aggregate(agg);
				}

				if (!positions) {
					res.statusCode = 404;
					res.json({ message: `Nincs ilyen esemény.`, error: true });
					return;
				}

				res.statusCode = 200;
				res.json(positions);
				return;
			}

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

				res.statusCode = 201;
				res.json({
					message: "Sikeresen létrehoztál egy eseményt",
					event: user.events,
					eventId: eventModel._id,
				});
				return;
			}

			case "PUT": {
				const { event, positions, creatorId } = req.body;
				let newPosIds = [];
				let positionModel;

				// console.log("event", event);

				if (creatorId !== token.id) {
					throw Error("Nem általad létrehozott esemény");
				}

				if (positions && positions.length) {
					positions.forEach(async (pos) => {
						positionModel = await Position.findByIdAndUpdate(pos._id, pos, {
							new: true,
						});
						if (pos.invition.type !== "creator") {
							if (positionModel) {
								//Ki kell e értesíteni a pozicióra jelentkezett user-eket?
							} else {
								positionModel = await new Position(pos);
								newPosIds.push(positionModel._id); //!Miért nem megy be az Array-ba?

								const userUpdateObjct = {
									event: pos.eventId,
									positions: [
										{
											position: positionModel,
											label: pos.invition.type === "direct" ? 4 : 5,
											status: "new",
											messages: [],
										},
									],
								};

								const candidateUsers = await User.updateMany(
									{
										// const candidateUsers = await User.find({
										$and: [
											{ _id: { $nin: [creatorId] } },
											{ "metaData.positions": { $in: [pos.posName] } },
										],
									},
									{ userUpdateObjct }
								);
								console.log("candidateUsers", candidateUsers);

								//  candidateUsers._id to array & pos.users.push(newUsersArray)
							}
							// await positionModel.save();
						}

						await positionModel.save();
						// console.log("positionModel", positionModel.toObject());
						console.log("newPosIds", newPosIds);
					});
				}

				if (event) {
					const eventModel = await Event.findByIdAndUpdate(event._id, event, {
						new: true,
					});

					if (!eventModel) {
						throw Error("Nem található az esemény. [eventId]:266");
					}

					if (newPosIds.length) {
						eventModel.positions.push(newPosIds);
					}
					await eventModel.save();
				}

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
