import React, { useState } from "react";

export const StatusContext = React.createContext({
	isLoading: false,
	letLodingStatusFalse: () => {},
	letLodingStatusTrue: () => {},
	changedLodingStatus: () => {},
});

const StatusContextProvider = (props) => {
	const [Loading, setLoading] = useState(false);

	const letLodingStatusFalse = () => {
		setLoading(false);
	};

	const letLodingStatusTrue = () => {
		setLoading(true);
	};

	const changedLodingStatus = () => {
		setLoading(!Loading);
	};

	return (
		<StatusContext.Provider
			value={{
				isLoading: Loading,
				letLodingStatusFalse: letLodingStatusFalse,
				letLodingStatusTrue: letLodingStatusTrue,
				changedLodingStatus: changedLodingStatus,
			}}
		>
			{props.children}
		</StatusContext.Provider>
	);
};

export default StatusContextProvider;
