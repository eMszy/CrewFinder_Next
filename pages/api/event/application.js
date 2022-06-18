import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const { eventId, positionId, userId, answer } = req.body;

	const getLabel = (type) => {
		if (answer) {
			if (type === "open") {
				return 3;
			}
			if (type === "direct") {
				return 2;
			}
		} else {
			return 7;
		}
	};

	try {
		let user = await User.findById(userId);
		if (!user) {
			throw Error("Felhasználó nem található");
		}

		let event = await Event.findById(eventId);
		if (!event) {
			throw Error("Felhasználó nem található");
		}

		let updatedEventDates = event.dates.toObject();

		updatedEventDates.forEach((d) => {
			d.crew.forEach((crew) => {
				if (crew.id.toString() === positionId) {
					crew.label = getLabel(crew.invitionType.name);
					if (answer) {
						if (!crew.candidates) {
							crew.candidates = [];
						}
						crew.candidates.push({
							_id: user._id,
							name: user.name,
							image: user.image,
						});
					} else if (crew.candidates) {
						crew.candidates = crew.candidates.filter(
							(c) => c._id.toString() !== userId
						);
					}
				}
			});
		});

		let updatedUserEvents = user.events.toObject();
		let otherUsers = [];

		updatedUserEvents.forEach((e) => {
			if (e._id.toString() === eventId) {
				let newEventLabel;
				e.positions.forEach((pos) => {
					if (pos.id.toString() === positionId) {
						pos.label = getLabel(pos.invitionType[0].name);
						pos.status = answer ? "applied" : "resigned";
						if (!newEventLabel || pos.label < newEventLabel) {
							newEventLabel = pos.label;
						}
						if (pos.invitionType[0].result) {
							otherUsers = pos.invitionType[0].result.filter(
								(u) => u._id.toString() !== userId
							);
						}
					} else if (!newEventLabel || pos.label < newEventLabel) {
						newEventLabel = pos.label;
					}
				});
				e.label = newEventLabel;
			}
		});

		console.log("otherUsers", otherUsers);

		event.dates = updatedEventDates;
		user.events = updatedUserEvents;

		await event.save();
		await user.save();

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
