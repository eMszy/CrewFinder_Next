// import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		const { input, pos } = req.query;
		dbConnect();
		// const token = await getToken({
		// 	req,
		// 	secret: process.env.NEXTAUTH_SECRET,
		// 	secureCookie: process.env.NODE_ENV === "production",
		// });

		// console.log("token", token);

		console.log("first", input, pos);

		const result = await User.aggregate([
			{
				$search: {
					autocomplete: {
						query: input,
						path: "name",
						fuzzy: {
							maxEdits: 1,
						},
					},
				},
			},
			{
				$match: {
					"metaData.positions": { $in: [pos] },
				},
			},
			{ $project: { name: 1, image: 1 } },
		]);
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
