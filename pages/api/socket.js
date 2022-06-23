import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";
import { Server } from "socket.io";

import User from "../../models/user";

const SocketHandler = async (req, res) => {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	// const pipline = [
	// 	{
	// 		$match: {
	// 			"documentKey._id": mongoose.Types.ObjectId(token.id),
	// 		},
	// 	},
	// ];

	// const changeStream = User.watch();

	// if (res.socket.server.io) {
	// 	console.log("Socket is already running on " + token.id);
	// } else {
	// 	console.log("Socket is initializing with " + token.id);
	// 	const io = new Server(res.socket.server);
	// 	res.socket.server.io = io;

	// 	io.on("connection", (socket) => {
	// 		changeStream.on("change", (next) => {
	// 			console.log("ID: ", next.documentKey._id.toString(), token.id);

	// 			const userId = next.documentKey._id.toString();
	// 			console.log("next", next);
	// 			if (next?.updateDescription?.updatedFields) {
	// 				const updatedFields = next.updateDescription.updatedFields.events;

	// 				console.log("payload", userId, updatedFields);
	// 				socket.broadcast.emit(userId, updatedFields);
	// 			}
	// 		});
	// 	});
	// }

	res.end();
};

export default SocketHandler;
