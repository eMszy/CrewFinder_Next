import { getToken } from "next-auth/jwt";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const SocketHandler = async (req, res) => {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	if (res.socket.server.io) {
		console.log("Socket is already running on " + token.id);
	} else {
		console.log("Socket is initializing with " + token.id);
		const io = new Server(res.socket.server, {
			cors: {
				origin: ["https://admin.socket.io"],
				credentials: true,
			},
		});
		res.socket.server.io = io;

		instrument(io, {
			auth: false,
		});

		io.on("connection", (socket) => {
			socket.on("server-msg", (message) => {
				socket.broadcast.emit("62bc4a2e89f92b22d7bfd57a", message);
			});
		});
	}

	res.end();
};

export default SocketHandler;
