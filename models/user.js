import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userEventSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			ref: "event",
			required: true,
		},
		startDate: Number,
		endDate: Number,
		id: Number,
		department: String,
		title: {
			type: String,
			required: false,
		},
		shortTitle: {
			type: String,
			required: false,
		},
		description: String,
		// location: String,
		creator: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		creatorName: String,
		positions: [
			{
				id: Number,
				yourPosition: String,
				invitionType: [Schema.Types.Mixed],
				label: {
					type: Number,
					required: true,
				},
				date: [
					{
						id: Number,
						startTime: Number,
						endTime: Number,
					},
				],
				status: String,
			},
		],
	},
	{ _id: false }
);

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
			default: "/icons/user.png",
		},
		userData: {
			connectInfo: {
				nickName: {
					type: String,
					required: false,
				},
				dob: {
					type: Date,
					required: false,
				},
				tel: {
					type: String,
					required: false,
				},
				gender: {
					type: String,
					required: false,
				},
				imdb: {
					type: String,
					required: false,
				},
				facebook: {
					type: String,
					required: false,
				},
			},
			address: {
				postCode: {
					type: String,
					required: false,
				},
				city: {
					type: String,
					required: false,
				},
				street: {
					type: String,
					required: false,
				},
			},
		},
		metaData: {
			isAdmin: {
				type: Boolean,
				required: true,
				default: false,
			},
			isHOD: {
				type: Array,
				required: true,
				default: [],
			},
			positions: {
				type: Array,
				required: true,
				default: [],
			},
		},
		ownEvents: [Schema.Types.Mixed],
		events: [userEventSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
