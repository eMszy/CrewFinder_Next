import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../context/state-context";

import classes from "./Message.module.scss";

const Message = () => {
	const { isStatusMsg } = useContext(StateContext);
	const [isAnimation, setIsAnimation] = useState(false);

	const [messages, setMessages] = useState({});

	useEffect(() => {
		if (!isStatusMsg) {
			return;
		}
		setMessages({
			msg: isStatusMsg.message,
			isError: isStatusMsg.error || null,
			isInfo: isStatusMsg.info ? true : false,
		});
		setIsAnimation(true);
		const timer = setTimeout(() => {
			setIsAnimation(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, [isStatusMsg]);

	return (
		<div
			className={[classes.MessageMain, isAnimation && classes.Visiblity].join(
				" "
			)}
		>
			<div
				onClick={() => setIsAnimation(false)}
				className={[
					classes.MessageDiv,
					isStatusMsg.error && classes.Error,
					isStatusMsg.info && classes.Info,
				].join(" ")}
			>
				<h3>{messages && messages.msg}</h3>
			</div>
		</div>
	);
};

export default Message;
