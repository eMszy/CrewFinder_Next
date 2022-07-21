import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		shortTitle: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: false,
		},
		startDate: {
			type: Number,
			required: true,
		},
		endDate: {
			type: Number,
			required: true,
		},
		department: {
			type: String,
			required: false,
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
				_id: false,
			},
		],
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		positions: [
			{
				type: Schema.Types.ObjectId,
				ref: "Position",
				required: true,
			},
			{ _id: false },
		],
	},
	{ timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
