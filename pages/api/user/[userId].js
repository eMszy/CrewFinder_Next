import User from "../../../models/user";
import { returnObject } from "../../../shared/utility";

const handler = async (req, res) => {
	const userId = req.query.userId;

	try {
		const user = await User.findById(userId);

		if (!user) {
			res.statusCode = 404;
			res.json({ message: `Nincs ilyen felhasználó.`, error: true });
			return;
		}

		if (req.method === "GET") {
			let returnObj = returnObject(user);

			res.statusCode = 200;
			res.json(returnObj);
			return;
		}

		if (req.method === "PUT") {
			const data = req.body;

			const updateAnObjectHandler = (updateData) => {
				for (const [key] of Object.entries(updateData)) {
					user.userData[key] = { ...user.userData[key], ...data[key] };
				}
			};

			updateAnObjectHandler(data);
			await user.save();
			res.statusCode = 202;
			res.json({ message: "Sikeresen frissítve" });
			return;
		}

		if (req.method === "DELETE") {
			// if (("user._id", user._id.toString() !== userId.toString())) {
			// 	res.statusCode = 403;
			// 	res.json("Nem engedélyezett művelet!");
			// 	return;
			// }

			// const event = await.findById(eventId);
			// event.user.pull(id);
			// await event.save();

			await User.findByIdAndRemove(userId);
			res.statusCode = 202;
			res.json({
				message: "Sikeresen törölted a regisztrációdat",
				error: true,
			});

			return true;
		}
	} catch (err) {
		res.statusCode = 400;
		res.json({ message: err.message, error: true });
		return;
	}
};

export default handler;
