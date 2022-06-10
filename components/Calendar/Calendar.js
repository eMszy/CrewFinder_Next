import React, { useContext, useState } from "react";
import { StateContext } from "../../context/state-context";

import CalendarHeader from "./CalendarElements/CalendarHeader";
import Month from "./CalendarElements/Month";
import Week from "./CalendarElements/Week";
import List from "./CalendarElements/List";

import EventHandle from "../EventCreator/EventHandle";

import { getMonth, getWeek } from "../../shared/utility";

import classes from "./Calendar.module.scss";
import Backdrop from "../UI/Backdrop/Backdrop";

const Calendar = () => {
	const { showEventModal, setShowEventModal } = useContext(StateContext);

	const viewTypes = ["Havi", "Heti", "Lista"];

	const [viewMode, setViewMode] = useState(viewTypes[0]);

	const [currentWeek, setCurrentWeek] = useState(getWeek());
	const [currentMonth, setCurrentMonth] = useState(getMonth());

	return (
		<div className={classes.CalendarMain}>
			{showEventModal && (
				<>
					<Backdrop clicked={setShowEventModal} />
					<EventHandle />
				</>
			)}
			<div className={classes.CalendarMain_Header}>
				<CalendarHeader
					viewTypes={viewTypes}
					viewMode={viewMode}
					setViewMode={setViewMode}
					setCurrentWeek={setCurrentWeek}
					setCurrentMonth={setCurrentMonth}
				/>
				<div className={classes.CalendarMain_Body}>
					{viewMode === "Havi" && <Month currentMonth={currentMonth} />}
					{viewMode === "Heti" && <Week currentWeek={currentWeek} />}
					{viewMode === "Lista" && <List />}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
