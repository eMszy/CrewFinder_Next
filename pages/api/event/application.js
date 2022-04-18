import Event from "../../../models/event";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const { eventId, userId, answer } = req.body;
	const answerNum = answer ? 2 : 7;
	try {
		const user = await User.findById(userId);
		user.events.forEach((u) => {
			if (u.id === eventId) {
				u.label = answerNum;
			}
		});

		const event = await Event.findById(eventId);
		const findedBaseMember = event.baseCrew.find(
			(b) => b._id.toString() === userId
		);
		findedBaseMember.label = answerNum;

		event.dates.forEach((d) => {
			d.crew.find((b) => {
				if (b._id && b._id === userId) {
					b.label = answerNum;
				}
			});
		});

		await Event.findByIdAndUpdate(eventId, event);
		await user.save();

		const message = answer
			? { message: "Sikeresen jelentkeztél" }
			: { message: "Sikeresen lemondtad" };
		res.statusCode = 200;
		res.json(message);
		return;
	} catch (err) {
		console.log("err", err);
		res.statusCode = 404;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
