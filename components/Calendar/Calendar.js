import React, { useContext } from "react";
import { StateContext } from "../../context/state-context";
import CalendarHeader from "./CalendarElements/CalendarHeader";
import Sidebar from "./CalendarElements/Sidebar";
import Month from "./CalendarElements/Month";
import EventModal from "./CalendarElements/EventModal";

import classes from "./Calendar.module.scss";

export const Calendar = () => {
	const { showEventModal } = useContext(StateContext);

	return (
		<div className={classes.CalendarMain}>
			{showEventModal && <EventModal />}
			<div className={classes.CalendarMain_Header}>
				<CalendarHeader />
				<div className={classes.CalendarMain_Body}>
					<Sidebar />
					<Month />
				</div>
			</div>
		</div>
	);
};
