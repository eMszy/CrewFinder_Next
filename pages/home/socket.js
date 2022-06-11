import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const Socket = () => {
	Socket.title = "CrewFinder - Socket.IO";
	const [input, setInput] = useState("");
	useEffect(() => {
		socketInitializer();
	}, []);
	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();
		socket.on("connect", () => {
			console.log("connected");
		});
		socket.on("update-input", (msg) => {
			setInput(msg);
		});
	};
	const onChangeHandler = (e) => {
		setInput(e.target.value);
		socket.emit("input-change", e.target.value);
	};
	return (
		<div>
			<input
				placeholder="Type something"
				value={input}
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default Socket;