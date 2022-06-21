import mongoose from "mongoose";

const Schema = mongoose.Schema;

const positionSchema = new Schema({
	eventId: {
		type: Schema.Types.ObjectId,
		ref: "event",
		required: true,
	},
	posName: {
		type: String,
		required: true,
	},
	weight: {
		type: Number,
		required: true,
	},
	invition: [
		{
			type: {
				type: String,
				required: true,
			},
			attribute: [Schema.Types.Mixed],
		},
	],
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
		},
		{ _id: false },
	],
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		{ _id: false },
	],
	status: String,
});

module.exports =
	mongoose.models.Position || mongoose.model("Position", positionSchema);
