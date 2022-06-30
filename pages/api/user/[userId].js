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

		console.log("userId", userId);

		const user = await User.findById(userId)
			.populate("events.event")
			.populate("events.positions.position");

		if (!user) {
			res.statusCode = 404;
			res.json({ message: `Nincs ilyen felhasználó.`, error: true });
			return;
		}

		if (req.method === "GET") {
			const returnObj = returnObject(user);
			res.statusCode = 200;
			res.json(returnObj);
			return;
		}

		if (req.method === "PUT") {
			const { subPlusData, type, positions } = req.body;

			if (type === "userData") {
				const updateAnObjectHandler = (updateData) => {
					for (const [key] of Object.entries(updateData)) {
						user.userData[key] = { ...user.userData[key], ...subPlusData[key] };
					}
				};

				updateAnObjectHandler(subPlusData);
			} else {
				user.metaData.positions = positions;
			}

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
								"pos.posName": "Cast PA",
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
			const posIds = [];
			const events = await Event.aggregate(agg);
			// console.log("Before: user.events", user.events.toObject());
			events.forEach((event) => {
				const theEvent = user.events.find(
					(ue) => ue.event._id.toString() === event.event.toString()
				);
				if (!theEvent) {
					user.events.push(event);
					console.log(
						"event",
						event.positions.forEach((pos) => posIds.push(pos.position))
					);
				} else {
					theEvent.positions.forEach((pos) => {
						user.events.forEach((userEve) => {
							const thePos = userEve.positions.find(
								(userPos) =>
									userPos.position._id.toString() ===
									pos.position._id.toString()
							);
							console.log("thePos.toObject()", thePos?.toObject());
							if (!thePos) {
								userEve.positions.push(thePos);
								posIds.push(userPos.position._id);
							}
						});
					});
				}
			});
			// console.log("After: user.events", user.events.toObject());

			//!Positions-okba be kell tenni a usert, vagy kivenni

			console.log("posIds", posIds);
			if (posIds.length > 0) {
				// const test = Position.find({ _id: { $in: [posIds] } });
				// console.log("test", test);
			}

			// Position.updateMany({ _id: { $in: [posIds] } }, {});
			// '_id': { $in: [

			//!Kell egy dispact, hogy a változások megjelenjenek

			await user.save();
			res.statusCode = 202;
			res.json({ message: "Sikeresen frissítve" });
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
		res.json({ mesage: err.message });
		return;
	}
};

export default handler;
