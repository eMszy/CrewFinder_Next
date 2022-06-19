import { getToken } from "next-auth/jwt";

import Event from "../../../models/event";
import User from "../../../models/user";
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

		const user = await User.findById(token.id);
		// .populate('event');
		if (!user) {
			throw Error("A felhasználói adatok betöltése sikertelen.");
		}

		const ownEvents = await Event.find({ _id: user.ownEvents });
		if (!user) {
			throw Error("A felhasználó eseményeinek betöltése sikertelen.");
		}

		ownEvents.forEach((o) => {
			if (o.department === "Privát") {
				o.label = 6;
			} else {
				o.label = 1;
			}
		});
		const allEvents = [...user.events, ...ownEvents];

		if (!allEvents) {
			res.statusCode = 404;
			res.json({ message: `Nincs ilyen esemény.`, error: true });
			return;
		}

		res.statusCode = 200;
		res.json(allEvents);
		return;
	} catch (err) {
		console.log("err", err);
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
