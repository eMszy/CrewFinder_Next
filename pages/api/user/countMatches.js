import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		const { pos, attribute } = req.query;
		dbConnect();
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const result = await User.aggregate([
			{
				$match: {
					_id: {
						$not: {
							$in: [mongoose.Types.ObjectId(token.id)],
						},
					},
				},
			},
			{
				$match: {
					"metaData.positions": {
						$in: [pos],
					},
				},
			},
			{ $project: { name: 1, image: 1 } },
		]);
		console.log("result", result);
		res.statusCode = 200;
		res.json(result);
		return;
	} catch (err) {
		console.log("err", err);
		res.statusCode = 500;
		res.json(err);
		return;
	}
};
export default handler;
