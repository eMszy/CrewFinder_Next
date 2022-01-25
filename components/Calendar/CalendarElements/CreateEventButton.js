import React, { useContext } from "react";
import { StateContext } from "../../../context/state-context";

import Image from "next/image";

import classes from "./CreateEventButton.module.scss";

const CreateEventButton = () => {
	const { setShowEventModal } = useContext(StateContext);
	return (
		<button
			onClick={() => setShowEventModal(true)}
			className={classes.CreateEventButton}
		>
			<Image src="/icons/plus.svg" alt="calendar" width={28} height={28} />
			<span>Létrehoz</span>
		</button>
	);
};

export default CreateEventButton;
