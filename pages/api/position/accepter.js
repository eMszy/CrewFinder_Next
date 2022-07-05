import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import Position from "../../../models/position";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const theChosenOnes = req.body;

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		theChosenOnes.forEach(async (one) => {
			const position = await Position.findById(one.posId).populate("eventId");

			if (position.eventId.creator.toString() !== token.id) {
				throw Error("nem általad létrhozott esemény");
			}
			position.chosenOne = one.userId;

			const theUser = await User.findById(one.userId);

			const thePos = theUser.events
				.find(
					(event) => event.event.toString() === position.eventId._id.toString()
				)
				.positions.find((pos) => pos.position.toString() === one.posId);
			thePos.label = 2;
			thePos.status = "accepted";

			const nonChosens = position.users.filter(
				(user) => user.toString() !== one.userId
			);

			const nonChosenUsers = await User.find({ _id: { $in: nonChosens } });

			nonChosenUsers.forEach(async (user) => {
				const thePos = user.events
					.find(
						(event) =>
							event.event.toString() === position.eventId._id.toString()
					)
					.positions.find((pos) => pos.position.toString() === one.posId);

				thePos.label = 6;
				thePos.status = "resigned";

				await user.save();
			});
			await theUser.save();
			await position.save();
		});
		res.statusCode = 200;
		res.json({ message: "A változások sikeresen mentve" });
		return;
	} catch (err) {
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
