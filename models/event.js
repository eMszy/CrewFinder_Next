import mongoose from "mongoose";

const Schema = mongoose.Schema;

const crewSchema = new Schema({
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	pos: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: "new",
	},
	image: String,
	label: { type: Number, required: true },
	invitionType: Schema.Types.Mixed,
});

const eventSchema = new Schema(
	{
		baseCrew: [crewSchema],
		dates: [
			{
				startTime: Number,
				endTime: Number,
				id: Number,
				location: { type: String, required: false },
				crew: [crewSchema],
			},
		],
		description: {
			type: String,
			required: true,
		},
		endDate: {
			type: Number,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		label: {
			type: Number,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		shortTitle: {
			type: String,
			required: true,
		},
		startDate: {
			type: Number,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		creatorPosition: {
			type: String,
			required: true,
		},
		creatorName: {
			type: String,
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		department: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
	{ autoIndex: false }
);

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
