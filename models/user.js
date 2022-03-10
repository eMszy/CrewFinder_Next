import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
			required: false,
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
			},
			isHOD: {
				type: Boolean,
				required: true,
			},
		},
		event: [
			{
				type: Schema.Types.ObjectId,
				ref: "Event",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
