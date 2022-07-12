import Event from "../../models/event";
import Position from "../../models/position";
import User from "../../models/user";
import dbConnect from "../dbConnect";

export const deleteEvent = async (eventId, userId) => {
	dbConnect();
	const event = await Event.findById(eventId);
	if (!event) {
		throw Error("Nincs ilyen esemény");
	}
	if (event.creator.toString() !== userId) {
		throw Error("Nem általad létrehozott esemény");
	}
	await Position.deleteMany({
		_id: { $in: event.positions },
	});
	await User.updateMany(
		{
			"events.event": { $in: event._id },
		},
		{ $pull: { events: { event: event._id } } }
	);
	await event.deleteOne();
	return {
		message: "Sikeresen törölted az eseményt",
		eventId: eventId,
	};
};
