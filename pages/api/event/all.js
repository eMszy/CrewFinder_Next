import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
import Position from "../../../models/position";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		if (req.method !== "GET") {
			throw new Error();
		}

		const user = await User.findById(token.id)
			.populate("events.event")
			.populate("events.positions.position");

		if (!user) {
			throw Error("A felhasználói adatok betöltése sikertelen.");
		}
		res.statusCode = 200;
		res.json(user.events);
		return;
	} catch (err) {
		console.log("err", err);
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
