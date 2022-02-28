import bcrypt from "bcryptjs/dist/bcrypt";
import jwt from "jsonwebtoken";

import dbConnect from "../../shared/dbConnect";
import User from "../../models/user";

const handler = async (req, res) => {
	if (req.method !== "POST") return;

	res.setHeader("Content-Type", "application/json");

	const { email, password } = req.body;
	dbConnect();

	const user = await User.findOne({ email: email });
	if (!user) {
		res.statusCode = 401;
		res.json({ message: "Ezzel az email címmel még nem regisztráltak" });
		return;
	}

	const isEqual = await bcrypt.compare(password, user.password);
	if (!isEqual) {
		res.statusCode = 401;
		res.json({ message: "Helytelen jelszó" });
		return;
	}

	const token = jwt.sign(
		{
			userId: user._id.toString(),
			email: user.email,
		},
		process.env.SECRET_WORD,
		{ expiresIn: "1h" }
	);

	const respons = {
		token: token,
		userId: user._id.toString(),
		name: user.name,
		nickName: user.userData.connectInfo.nickName,
		metaData: user.metaData,
	};

	res.statusCode = 200;
	res.json(respons);
	return;
};

export default handler;
