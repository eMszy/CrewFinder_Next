import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import Position from "../../../models/position";
import Event from "../../../models/event";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	const eventId = req.query.eventId;
	dbConnect();
	const theUpdatedPos = req.body;

	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		theUpdatedPos.forEach(async (pos) => {
			let position;

			if (pos.posId) {
				position = await Position.findById(pos.posId).populate("eventId");
				console.log("find");
				if (!position) {
					throw Error("A pozició nem található");
				}

				if (position.eventId.creator.toString() !== token.id) {
					throw Error("Nem általad létrhozott esemény");
				}
			} else {
				position = await new Position({ ...pos, eventId });
				await Event.findByIdAndUpdate(eventId, {
					$push: {
						positions: position._id,
					},
				});
				console.log("create");
			}
			// console.log("position", position.toObject());

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
					(event) => event.event.toString() === eventId.toString()
				);

				if (theEvent) {
					const thePos = theEvent.positions.find(
						(position) => position.position.toString() === pos.posId
					);
					if (thePos) {
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
					} else {
						const theUserEvent = user.events.find(
							(eve) => eve.event.toString() === eventId
						);
						theUserEvent.positions.push({
							label: pos.label,
							message: [],
							position: position._id,
							status: "new",
						});
					}
				} else {
					user.events.push({
						event: eventId,
						positions: [
							{
								label: pos.label,
								message: [],
								position: position._id,
								status: "new",
							},
						],
					});
				}

				await user.save();
			});

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
