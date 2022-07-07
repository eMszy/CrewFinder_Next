import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		const { input, pos } = req.query;
		dbConnect();
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		const result = await User.aggregate([
			{
				$match: {
					$and: [
						{ _id: { $nin: [token.id] } },
						{ name: { $regex: input, $options: "i" } },
						{
							"metaData.positions": { $in: [pos] },
						},
					],
				},
			},
			{ $limit: 10 },
			{ $project: { name: 1, image: 1 } },
		]);
		console.log("Direct result: ", result.length);
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
