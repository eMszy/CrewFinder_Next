import mongoose from "mongoose";

import Position from "../../models/position";
import dbConnect from "../dbConnect";

export const getEvent = async (eventId) => {
	dbConnect();
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
		return { message: `Nincs ilyen esemény.`, error: true };
	}

	return positions;
};
