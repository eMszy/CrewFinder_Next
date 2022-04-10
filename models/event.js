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
	_id: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: false,
	},
	status: {
		type: String,
		required: true,
		default: "new",
	},
	label: { type: Number, required: true },
	invitionType: Schema.Types.Mixed,
});

const eventSchema = new Schema(
	{
		baseCrew: [crewSchema],
		dates: [Schema.Types.Mixed],
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
		yourPosition: {
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
