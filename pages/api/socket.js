import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { getAllEvents } from "../../shared/SocketFunctions/getAllEvents";
import { getEvent } from "../../shared/SocketFunctions/getEvent";
import { deleteEvent } from "../../shared/SocketFunctions/deleteEvent";
import { createEvent } from "../../shared/SocketFunctions/createEvent";

const SocketHandler = async (req, res) => {
	console.log("res.socket.server", res.socket.server);
	if (res.socket.server.io) {
		console.log("Socket is already running.");
	} else {
		console.log("Socket is initializing...");
		const io = new Server(res.socket.server, {
			cors: {
				origin: [
					"https://admin.socket.io",
					"https://crewfindernext.herokuapp.com",
				],
				credentials: true,
			},
		});

		res.socket.server.io = io;

		instrument(io, {
			auth: false,
		});

		const socketIo = res.socket.server.io;

		socketIo.on("connection", (socket) => {
			socket.on("to-server", (message, room) => {
				if (room === "") {
					socket.broadcast.emit("to-client", message);
				} else {
					socket.to(room).emit("to-client", message);
				}
			});

			socket.on("client-join-room", (room) => {
				socket.join(room);
			});

			socket.on("get-all-events", async (userId, cb) => {
				let SocketRooms = [];
				const res = await getAllEvents(userId);
				if (!res.error) {
					res.forEach((e) => {
						SocketRooms.push(`Event_${e.event._id}`);
						e.positions.forEach((pos) =>
							SocketRooms.push(`Position_${pos.position._id}`)
						);
					});
					SocketRooms.push(`Client_${userId}`);
					socket.join(SocketRooms);
				}
				cb(res);
			});

			socket.on("create-event", async (event, positions, cb) => {
				const res = await createEvent(event, positions);
				const allUserIds = [];
				positions.forEach((pos) => {
					pos.users.forEach((user) => {
						if (!allUserIds.includes(user)) {
							allUserIds.push(user);
						}
					});
				});
				allUserIds.forEach((user) => {
					socket.to(`Client_${user}`).emit("to-client-reload");
				});
				cb(res);
			});

			socket.on("get-event", async (eventId, cb) => {
				const res = await getEvent(eventId);
				cb(res);
			});

			socket.on("delete-event", async (eventId, posIds, userId, cb) => {
				const res = await deleteEvent(eventId, userId);
				socket.to(`Event_${eventId}`).emit("to-client-delete-event", eventId);
				posIds.forEach((posId) => {
					io.socketsLeave(`Position_${posId}`);
				});
				io.socketsLeave(`Event_${eventId}`);
				cb(res);
			});
		});
	}
	res.end();
};

export default SocketHandler;
