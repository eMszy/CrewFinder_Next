import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import { getMonth } from "../../../shared/utility";

import Button from "../../UI/Button/Button";

import classes from "./SmallCalendar.module.scss";

const SmallCalendar = () => {
	const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
	const [currentMonth, setCurrentMonth] = useState(getMonth());

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIdx));
	}, [currentMonthIdx]);

	const {
		monthIndex,
		setSmallCalendarMonth,
		setDaySelected,
		daySelected,
		filteredEvents,
	} = useContext(StateContext);

	useEffect(() => {
		setCurrentMonthIdx(monthIndex);
	}, [monthIndex]);

	const getDayClass = (day) => {
		const format = "YY-MM-DD";
		const nowDay = dayjs().format(format);
		const currDay = day.format(format);
		const slcDay = daySelected && daySelected.format(format);

		const fEventByDay = filteredEvents.find(
			(f) => day.valueOf() >= f.startDate && day.valueOf() <= f.endDate
		);

		let style = { borderRadius: "999px" };

		if (currDay === slcDay) {
			return { ...style, borderColor: "#afd7f8" };
		} else if (nowDay === currDay) {
			return { ...style, backgroundColor: "#afd7f8" };
		} else if (fEventByDay) {
			return { backgroundColor: fEventByDay.label, color: "white" };
		} else {
			return "";
		}
	};

	return (
		<div className={classes.SmallCal}>
			<header className={classes.SmallCal_header}>
				<p className="text-gray-500 font-bold">
					{dayjs(new Date(dayjs().year(), currentMonthIdx)).format("YYYY MMMM")}
				</p>
				<div>
					<Button clicked={() => setCurrentMonthIdx(currentMonthIdx - 1)}>
						<IoChevronBack />
					</Button>
					<Button clicked={() => setCurrentMonthIdx(currentMonthIdx + 1)}>
						<IoChevronForward />
					</Button>
				</div>
			</header>
			<div className={classes.SmallCal_calendar}>
				{currentMonth[0].map((day, i) => (
					<span key={i} className="text-sm py-1 text-center">
						{day.format("dd").charAt(0)}
					</span>
				))}
				{currentMonth.map((row, i) => (
					<React.Fragment key={i}>
						{row.map((day, idx) => {
							return (
								<div
									key={idx}
									className={classes.SmallDates}
									style={getDayClass(day) || null}
								>
									<div
										onClick={() => {
											setSmallCalendarMonth(currentMonthIdx);
											setDaySelected(day);
										}}
									>
										<span className="text-sm">{day.format("D")}</span>
									</div>
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default SmallCalendar;
