import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import User from "../../../models/user";
import Event from "../../../models/event";
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
