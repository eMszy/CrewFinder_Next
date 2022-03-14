import { getToken } from "next-auth/jwt";
import Event from "../../../models/event";
import User from "../../../models/user";

const handler = async (req, res) => {
	const token = await getToken({
		req,
		secret: process.env.SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	try {
		const eventId = req.query.eventId;
		console.log("first", eventId);

		if (req.method === "GET") {
			const event = await Event.find();

			if (!event) {
				res.statusCode = 404;
				res.json({ message: `Nincs ilyen esemény.`, error: true });
				return;
			}

			res.statusCode = 200;
			res.json(event);
			return;
		}

		if (req.method === "POST") {
			const data = req.body;
			const event = new Event(data);

			const user = await User.findById(token.id);
			user.event.push(event._id);

			event.save();
			user.save();

			res.statusCode = 201;
			res.json({ message: "Sikeresen létrehoztál egy eseményt" });
			return;
		}
	} catch (err) {
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
