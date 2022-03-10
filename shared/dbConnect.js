import mongoose from "mongoose";

const connection = {};

const dbConnect = async () => {
	if (connection.isConected) {
		console.log(`MongoDB: Already connected`);
		return;
	}

	const db = await mongoose.connect(process.env.MONGODB_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});

	connection.isConected = db.connections[0].readyState;
	console.log(
		`MongoDB: `,
		connection.isConected === 1 ? "MongoDB conected!" : "Fail to connect!"
	);
};

export default dbConnect;
