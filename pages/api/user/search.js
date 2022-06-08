import User from "../../../models/user";
import dbConnect from "../../../shared/dbConnect";

const handler = async (req, res) => {
	try {
		const { input, pos } = req.query;
		dbConnect();

		const result = await User.aggregate([
			{
				$search: {
					autocomplete: {
						path: "name",
						query: input,
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
