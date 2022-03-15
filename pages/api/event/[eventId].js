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

		if (req.method === "GET") {
			let event;
			if (eventId === "all") {
				event = await Event.find();
			} else {
				event = await Event.findById(eventId);
			}

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
			user.ownEvents.push(event._id);

			await event.save();
			await user.save();

			res.statusCode = 201;
			res.json({ message: "Sikeresen létrehoztál egy eseményt" });
			return;
		}

		if (req.method === "PUT") {
			const data = req.body;

			if (data.creator !== token.id) {
				throw Error("Nem általad létrehozott esemény");
			}

			await Event.findByIdAndUpdate(eventId, data);
			res.statusCode = 202;
			res.json({ message: "Sikeresen modósítottad az eseményt" });
			return;
		}

		if (req.method === "DELETE") {
			const event = await Event.findById(eventId);
			if (!event) {
				throw Error("Nincs ilyen esemény");
			}

			if (event.creator.toString() !== token.id) {
				throw Error("Nem általad létrehozott esemény");
			}
			await event.deleteOne();
			const user = await User.findById(token.id);
			user.ownEvents.pull(eventId);
			await user.save();

			res.statusCode = 202;
			res.json({ message: "Sikeresen törölted az eseményt" });
			return;
		}
	} catch (err) {
		console.log("err", err);
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
