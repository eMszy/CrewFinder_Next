import mongoose from "mongoose";

const Schema = mongoose.Schema;

const positionSchema = new Schema({
	eventId: {
		type: Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	posName: {
		type: String,
		required: true,
	},
	invition: {
		type: {
			type: String,
			required: true,
		},
		attribute: [Schema.Types.Mixed],
		_id: false,
	},

	dates: [
		{
			id: {
				type: Number,
				required: true,
			},
			startTime: {
				type: Number,
				required: true,
			},
			endTime: {
				type: Number,
				required: true,
			},
			location: String,
			_id: false,
		},
	],
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
			_id: false,
		},
	],
	status: String,
	chosenOne: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

export default mongoose.models.Position ||
	mongoose.model("Position", positionSchema);
