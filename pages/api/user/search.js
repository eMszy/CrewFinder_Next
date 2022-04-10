// import { getToken } from "next-auth/jwt";
import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		dbConnect();
		// const token = await getToken({
		// 	req,
		// 	secret: process.env.SECRET,
		// 	secureCookie: process.env.NODE_ENV === "production",
		// });

		// console.log("token", token);

		const result = await User.aggregate([
			{
				$search: {
					autocomplete: {
						query: `${req.query.input}`,
						path: "name",
						fuzzy: {
							maxEdits: 1,
						},
					},
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
