import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import User from "../../../models/user";
import Event from "../../../models/event";
import Position from "../../../models/position";
import control from "../../../control.json";
import { returnObject } from "../../../shared/utility";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		dbConnect();
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const userId = req.query.userId;
		let user;

		if (req.method === "GET") {
			user = await User.findById(userId)
				.populate({
					path: "events.event",
					populate: { path: "creator", select: "name" },
				})
				.populate("events.positions.position");

			if (!user) {
				res.statusCode = 404;
				res.json({ message: `Nincs ilyen felhasználó.`, error: true });
				return;
			}

			const returnObj = returnObject(user);
			res.statusCode = 200;
			res.json(returnObj);
			return;
		}

		if (req.method === "PUT") {
			const { subPlusData, positions } = req.body;
			const posIds = [];

			if (subPlusData) {
				user = await User.findById(userId)
					.populate("events.event")
					.populate("events.positions.position");

				if (!user) {
					res.statusCode = 404;
					res.json({ message: `Nincs ilyen felhasználó.`, error: true });
					return;
				}

				const updateAnObjectHandler = (updateData) => {
					for (const [key] of Object.entries(updateData)) {
						user.userData[key] = { ...user.userData[key], ...subPlusData[key] };
					}
				};
				updateAnObjectHandler(subPlusData);
			}

			if (positions) {
				user = await User.findById(userId);

				if (!user) {
					res.statusCode = 404;
					res.json({ message: `Nincs ilyen felhasználó.`, error: true });
					return;
				}
				user.metaData.positions = positions;
				const depts = [];

				for (const [key, value] of Object.entries(control.departments)) {
					positions.forEach((pos) => {
						if (Object.keys(value.positions).includes(pos)) {
							if (!depts.includes(key)) {
								depts.push(key);
							}
						}
					});
				}

				const agg = [
					{
						$match: {
							department: { $in: depts },
						},
					},
					{
						$lookup: {
							from: "positions",
							localField: "Positions",
							foreignField: "positions",
							as: "pos",
						},
					},
					{
						$unwind: {
							path: "$pos",
						},
					},
					{
						$match: {
							$and: [
								{
									$expr: {
										$eq: ["$_id", "$pos.eventId"],
									},
								},
								{
									$or: [
										{
											"pos.invition.type": "open",
										},
										{
											"pos.invition.type": "attribute",
										},
									],
								},
								{
									"pos.posName": { $in: positions },
								},
							],
						},
					},
					{
						$group: {
							_id: "$_id",
							event: { $first: "$_id" },
							positions: {
								$push: {
									position: "$pos._id",
									label: 5,
									status: "new",
									messages: [],
								},
							},
						},
					},
				];

				//?User events-t most felül írja, pedig csak a nem létező pozik kellenek pluszba hozzá adni

				const events = await Event.aggregate(agg);
				events.forEach((event) => {
					const theEvent = user.events.find(
						(ue) => ue.event.toString() === event.event.toString()
					);
					if (!theEvent) {
						user.events.push(event);
						event.positions.forEach((pos) => posIds.push(pos.position));
					} else {
						theEvent.positions.forEach((pos) => {
							user.events.forEach((userEve) => {
								if (userEve.event.toString() === theEvent.event.toString()) {
									let isExist = false;
									userEve.positions.forEach((userPos) => {
										if (
											userPos.position.toString() === pos.position.toString()
										) {
											isExist = true;
										}
									});
									if (!isExist) {
										theEvent.positions.push(pos);
										posIds.push(pos.position);
									}
								}
							});
						});
					}
				});

				//?Positions-okba be kell tenni a usert, vagy kivenni

				if (posIds.length) {
					await Position.updateMany(
						{ _id: { $in: posIds } },
						{ $push: { users: userId } }
					);
				}
			}
			await user.save();

			//?Kell egy dispact, hogy a változások megjelenjenek
			const updatedUser = await User.findById(userId)
				.populate("events.event")
				.populate("events.positions.position");

			res.statusCode = 202;
			res.json({ message: "Sikeresen frissítve", events: updatedUser.events });
			return;
		}

		if (req.method === "DELETE") {
			const eventId = mongoose.Types.ObjectId(token.id);
			await Event.deleteMany({
				creator: eventId,
			});

			await User.findByIdAndRemove(userId);
			res.statusCode = 202;
			res.json({
				message: "Sikeresen törölted a regisztrációdat",
				error: true,
			});

			return true;
		}
	} catch (err) {
		console.log("err", err);
		res.statusCode = 400;
		res.json({ message: err.message });
		return;
	}
};

export default handler;
