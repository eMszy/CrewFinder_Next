import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";

import classes from "../Calendar.module.scss";

const Sidebar = () => {
	return (
		<aside className={classes.CalendarMain_Body_Sidebar}>
			<CreateEventButton />
			<SmallCalendar />
			<Labels />
		</aside>
	);
};

export default Sidebar;
