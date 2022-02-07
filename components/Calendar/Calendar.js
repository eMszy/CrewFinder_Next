import React, { useContext, useState } from "react";
import { StateContext } from "../../context/state-context";
import CalendarHeader from "./CalendarElements/CalendarHeader";
import Month from "./CalendarElements/Month";
import { Week } from "./CalendarElements/Week";
import EventModal from "./CalendarElements/EventModal";

import classes from "./Calendar.module.scss";
import { List } from "./CalendarElements/List";

export const Calendar = () => {
	const { showEventModal } = useContext(StateContext);
	const viewTypes = ["Havi", "Heti", "Lista"];
	const [viewMode, setViewMode] = useState(viewTypes[0]);

	return (
		<div className={classes.CalendarMain}>
			{showEventModal && <EventModal />}
			<div className={classes.CalendarMain_Header}>
				<CalendarHeader
					viewTypes={viewTypes}
					viewMode={viewMode}
					setViewMode={setViewMode}
				/>
				<div className={classes.CalendarMain_Body}>
					{viewMode === "Havi" && <Month />}
					{viewMode === "Heti" && <Week />}
					{viewMode === "Lista" && <List />}
				</div>
			</div>
		</div>
	);
};
