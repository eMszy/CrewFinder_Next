import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const { eventId, positionId, answer, newLabel } = req.body;

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const user = await User.findById(token.id)
			.populate("events.event")
			.populate("events.positions.position");

		const event = user.events.find(
			(eve) => eve.event._id.toString() === eventId
		);
		const position = event.positions.find(
			(pos) => pos.position._id.toString() === positionId
		);
		position.label = newLabel;

		const updatedUser = await user.save();

		const message = answer
			? { message: "Sikeresen jelentkeztél" }
			: { message: "Sikeresen lemondtad", info: !answer };
		res.statusCode = 200;
		res.json({ message, events: updatedUser.events });
		return;
	} catch (err) {
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
