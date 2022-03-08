import { getSession } from "next-auth/react";
import User from "../../models/user";
import { IsExist, returnObject } from "../../shared/utility";

const handler = async (req, res) => {
	const session = await getSession({ req });
	console.log("first", session);

	const userId = req.body.userId;
	// res.send(JSON.stringify(session, null, 2));

	try {
		const user = await User.findById(userId);

		if (!user) {
			res.statusCode = 404;
			res.json(`Nincs ilyen felhasználó.`);
			return;
		}

		if (req.method === "GET") {
			let returnObj = returnObject(user);

			res.statusCode = 200;
			res.json(returnObj);
			return;
		}

		if (req.method === "POST") {
			const Data = req.body.Data;

			const updateAnObjectHandler = (updateData) => {
				for (const [key] of Object.entries(updateData)) {
					user.userData[key] = { ...user.userData[key], ...Data[key] };
				}
			};

			updateAnObjectHandler(Data);

			const updatedUser = await user.save();
			console.log("updatedUser", updatedUser);

			res.statusCode = 202;
			res.json("Felhasználó frissítve");
			return;
		}

		if (req.method === "DELETE") {
			// if (("user._id", user._id.toString() !== userId.toString())) {
			// 	res.statusCode = 403;
			// 	res.json("Nem engedélyezett művelet!");
			// 	return;
			// }
			await User.findByIdAndRemove(userId);
			res.statusCode = 202;
			res.json("Felhasználó törölve");
			return;
		}
	} catch (err) {
		res.statusCode = 400;
		res.json(err.message);
		return;
	}
};

export default handler;
