import React, { useContext } from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

import classes from "../Calendar.module.scss";
import { StateContext } from "../../../context/state-context";

const Sidebar = () => {
	const { daySelected, filteredEvents } = useContext(StateContext);

	return (
		<aside className={classes.CalendarMain_Body_Sidebar}>
			<CreateEventButton />
			<SmallCalendar
				daySelected={daySelected}
				filteredEvents={filteredEvents}
			/>
			<Labels />
		</aside>
	);
};

export default Sidebar;
