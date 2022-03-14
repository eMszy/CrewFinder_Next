import Event from "../../../models/event";

const handler = async (req, res) => {
	try {
		const eventId = req.query.eventId;

		if (req.method === "GET") {
			const event = await Event.findOne({ id: eventId });

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
			console.log("event", event);
			event.save();

			res.statusCode = 201;
			res.json({ message: "Sikeresen frissítve" });
			return true;
		}
	} catch (err) {
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
