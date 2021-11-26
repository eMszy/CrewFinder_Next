import React, { useState } from "react";

export const StatusContext = React.createContext({
	isStatusMsg: null,
	setStatus: () => {},
});

const StatusContextProvider = (props) => {
	const [isStatusMsg, setIsStatusMsg] = useState(null);

	const setStatus = (message) => {
		if (message != null) {
			if (message.error) {
				console.error("Error:", message);
			} else {
				console.log("Status:", message);
			}
		}
		setIsStatusMsg(message);
	};

	return (
		<StatusContext.Provider
			value={{
				isStatusMsg: isStatusMsg,
				setStatus: setStatus,
			}}
		>
			{props.children}
		</StatusContext.Provider>
	);
};

export default StatusContextProvider;
