import React, { useContext, useEffect } from "react";
import { StatusContext } from "../../context/status-context";

import classes from "./Message.module.scss";

const Message = () => {
	const statusContext = useContext(StatusContext);

	useEffect(() => {
		if (statusContext === null) {
			return;
		}
		const timer = setTimeout(() => {
			statusContext.setStatus(null);
		}, 5000);
		return () => clearTimeout(timer);
	}, [statusContext]);

	return (
		<div
			className={classes.MessageMain}
			onClick={() => statusContext.setStatus(null)}
		>
			<div
				className={[
					classes.MessageDiv,
					statusContext.isStatusMsg.error && classes.Error,
				].join(" ")}
			>
				<h3>{statusContext.isStatusMsg.message}</h3>
			</div>
		</div>
	);
};

export default Message;
