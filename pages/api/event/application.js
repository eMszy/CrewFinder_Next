import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const {
		theUserEvents,
		theEvent,
		positionId,
		userSession,
		answer,
		getLabel: theLabel,
	} = req.body;

	try {
		let event = await Event.findById(theEvent._id);
		if (!event) {
			throw Error("Felhasználó nem található");
		}

		let updatedEventDates = event.dates.toObject();

		updatedEventDates.forEach((d) => {
			d.crew.forEach((crew) => {
				if (crew.id.toString() === positionId) {
					crew.label = theLabel;
					if (answer) {
						if (!crew.candidates) {
							crew.candidates = [];
						}
						crew.candidates.push({
							_id: userSession.id,
							name: userSession.user.name,
							image: userSession.user.image,
						});
					} else if (crew.candidates) {
						crew.candidates = crew.candidates.filter(
							(c) => c._id.toString() !== userSession.id
						);
					}
				}
			});
		});

		event.dates = updatedEventDates;
		await User.findByIdAndUpdate(userSession.id, {
			events: theUserEvents,
		});

		await event.save();

		const message = answer
			? { message: "Sikeresen jelentkeztél" }
			: { message: "Sikeresen lemondtad", info: !answer };
		res.statusCode = 200;
		res.json(message);
		return;
	} catch (err) {
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
