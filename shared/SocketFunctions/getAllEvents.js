import User from "../../models/user";
import Event from "../../models/event";
import Position from "../../models/position";
import dbConnect from "../dbConnect";

export const getAllEvents = async (userId) => {
	dbConnect();
	try {
		const user = await User.findById(userId)
			.populate("events.event")
			.populate("events.positions.position");

		if (!user) {
			throw Error("A felhasználói adatok betöltése sikertelen.");
		}
		return user.events;
	} catch (err) {
		console.log("err", err);
		return { message: err.message, error: true };
	}
};
