import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../../context/status-context";

import classes from "./Message.module.scss";

const Message = () => {
	const statusContext = useContext(StatusContext);

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (statusContext === null) {
			return;
		}
		setMessages([
			// ...messages,
			{
				msg: statusContext.isStatusMsg.message,
				isError: statusContext.isStatusMsg.error || null,
			},
		]);
		const timer = setTimeout(() => {
			statusContext.setStatus(null);
		}, 5000);
		return () => clearTimeout(timer);
	}, [statusContext]);

	// console.log(`statusContext`, statusContext);

	const items = (
		<h3>
			{messages.map((m) => (
				<p key={m.msg + Math.random()}>{m.msg}</p>
			))}
		</h3>
	);

	return (
		<div
			className={classes.MessageMain}
			onClick={() => statusContext.setStatus(null)}
		>
			{messages !== [] && (
				<div
					className={[
						classes.MessageDiv,
						statusContext.isStatusMsg.error && classes.Error,
					].join(" ")}
				>
					{items}
				</div>
			)}
		</div>
	);
};

export default Message;
