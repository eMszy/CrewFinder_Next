import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../context/state-context";

import classes from "./Message.module.scss";

const Message = () => {
	const stateContext = useContext(StateContext);

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (stateContext === null) {
			return;
		}
		setMessages([
			{
				msg: stateContext.isStatusMsg.message,
				isError: stateContext.isStatusMsg.error || null,
			},
		]);
		const timer = setTimeout(() => {
			stateContext.setStatus(null);
		}, 5000);
		return () => clearTimeout(timer);
	}, [stateContext]);

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
			onClick={() => stateContext.setStatus(null)}
		>
			{messages !== [] && (
				<div
					className={[
						classes.MessageDiv,
						stateContext.isStatusMsg.error && classes.Error,
					].join(" ")}
				>
					{items}
				</div>
			)}
		</div>
	);
};

export default Message;
