import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema(
	{
		title: {
			type: String,
			required: false,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		shortName: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		eventType: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
