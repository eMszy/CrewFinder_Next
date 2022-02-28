import bcrypt from "bcryptjs/dist/bcrypt";
import validator from "validator";

import dbConnect from "../../shared/dbConnect";
import User from "../../models/user";

const handler = async (req, res) => {
	if (req.method !== "POST") return;

	res.setHeader("Content-Type", "application/json");

	const { email, password, name, imageUrl } = req.body;
	dbConnect();

	const errors = [];

	if (!validator.isEmail(email)) {
		errors.push({ message: "Érvénytelen e-mail" });
	}

	if (
		validator.isEmpty(password) ||
		!validator.isLength(password, { min: 8 })
	) {
		errors.push({ message: "A jelszó túl rövid" });
	}

	if (errors.length > 0) {
		const error = new Error("Érvénytelen bevitel");
		error.data = errors;
		error.code = 422;
		throw error;
	}

	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		const error = new Error("Ezzel az email címmel már regisztráltak");
		throw error;
	}

	const hashedPw = await bcrypt.hash(password, 12);
	const user = new User({
		email: email,
		password: hashedPw,
		name: name,
		imageUrl: imageUrl || "",
		metaData: {
			isAdmin: false,
			isHOD: false,
		},
	});
	const createdUser = await user.save();

	res.statusCode = 200;
	res.json(createdUser);
	return;
};

export default handler;
