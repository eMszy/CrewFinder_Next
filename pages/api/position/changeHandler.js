import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import Position from "../../../models/position";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	dbConnect();
	const theUpdatedPos = req.body;

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		theUpdatedPos.forEach(async (pos) => {
			console.log("pos", pos);
			let position;
			//!új pozició léterhozása
			// if (pos._id) {
			position = await Position.findById(pos.posId).populate("eventId");

			if (!position) {
				throw Error("A pozició nem található");
			}

			if (position.eventId.creator.toString() !== token.id) {
				throw Error("Nem általad létrhozott esemény");
			}
			// } else {
			// 	position = await new Position(pos);
			// 	console.log("position", position);
			// }

			if (pos.userId) {
				position.chosenOne = pos.userId;
			} else {
				position.chosenOne = undefined;
			}

			if (pos.dates) {
				position.dates = pos.dates;
			}

			const users = await User.find({ _id: { $in: position.users } });

			users.forEach(async (user) => {
				const theEvent = user.events.find(
					(event) => event.event.toString() === position.eventId._id.toString()
				);

				const thePos = theEvent.positions.find(
					(position) => position.position.toString() === pos.posId
				);

				if (pos.dates) {
					let newLabel = 5;
					if (thePos.label === 2 || thePos.label === 4) {
						newLabel = 4;
					}
					thePos.label = newLabel;
					thePos.status = "date change"; //? itt he nem csak az eddigieket szeretnénk meghívni hanem újakat is akkor pos törlés és új létrehozás?
				} else {
					if (user._id.toString() === pos.userId) {
						thePos.label = 2;
						thePos.status = "accepted";
					} else {
						thePos.label = 6;
						thePos.status = "resigned";
					}
				}
				// await user.save();
			});

			// await position.save();
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
