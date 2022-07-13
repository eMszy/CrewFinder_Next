import Event from "../../models/event";
import Position from "../../models/position";
import User from "../../models/user";
import dbConnect from "../dbConnect";

export const createEvent = async (event, positions) => {
	let userIds = [];
	let usersDataArray = [];

	dbConnect();

	try {
		const eventModel = await new Event(event);

		await positions.forEach(async (pos) => {
			delete pos._id;
			delete pos.name;
			pos.eventId = eventModel._id;
			const positionModel = await new Position(pos);
			eventModel.positions.push(positionModel._id);

			pos.users.forEach((user) => {
				if (!userIds.includes(user)) {
					userIds.push(user);
					usersDataArray.push({
						userId: user,
						data: {
							event: eventModel._id,
							positions: [
								{
									position: positionModel._id,
									label: pos.label,
									status: "new",
								},
							],
						},
					});
				} else {
					usersDataArray.map((userData) =>
						userData.userId === user
							? userData.data.positions.push({
									position: positionModel._id,
									label: pos.label,
									status: "new",
							  })
							: userData
					);
				}
			});
			await positionModel.save();
		});
		await eventModel.save();

		const creatorData = usersDataArray.find(
			(data) => data.userId === event.creator
		);

		const theCreator = await User.findByIdAndUpdate(
			creatorData.userId,
			{
				$push: { events: creatorData.data },
			},
			{
				new: true,
			}
		)
			.populate("events.event")
			.populate("events.positions.position");

		// if (!theCreator) {
		// 	throw Error("Mi a fasz van?");
		// }

		// console.log("creatorData", creatorData);
		// console.log("test", theCreator);

		usersDataArray.forEach(async (data) => {
			if (data.userId !== event.creator) {
				await User.findByIdAndUpdate(data.userId, {
					$push: { events: data.data },
				});
			}
		});

		return {
			message: "Sikeresen létrehoztál egy eseményt",
			events: theCreator.events,
			eventId: eventModel._id.toString(),
		};
	} catch (err) {
		console.log("err", err);
		return { message: err.message, error: true };
	}
};
