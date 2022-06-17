import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { findColor, getMonth } from "../../../shared/utility";

import classes from "./SmallCalendar.module.scss";

const SmallCalendar = ({ filteredEvents, setClickedDate, setIsClicked }) => {
	const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
	const [currentMonth, setCurrentMonth] = useState(getMonth());

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIdx));
	}, [currentMonthIdx]);

	const getDayClass = (day) => {
		const format = "YY-MM-DD";
		const nowDay = dayjs().format(format);
		const currDay = day.format(format);

		let fEventByDay;
		if (filteredEvents[0].dates) {
			fEventByDay = filteredEvents[0].dates.find(
				(date) => dayjs(date?.startTime).format(format) === currDay
			);
		}

		let fEventAllDay;
		if (filteredEvents[0].selectedEventDates) {
			fEventAllDay = filteredEvents[0].selectedEventDates.find(
				(date) => dayjs(date.startTime).format(format) === currDay
			);
		}

		let style = { borderRadius: "999px" };

		if (nowDay === currDay) {
			style = { ...style, borderColor: "#afd7f8" };
		}

		if (fEventAllDay) {
			style = {
				...style,
				backgroundColor: findColor(filteredEvents[0].label)
					.slice(0, -4)
					.concat("90%)"),
			};
		}

		if (fEventByDay) {
			style = {
				...style,
				backgroundColor: findColor(filteredEvents[0].label),
			};
		}
		return style;
	};

	return (
		<div className={classes.SmallCal}>
			<header className={classes.SmallCal_header}>
				<p>
					{dayjs(new Date(dayjs().year(), currentMonthIdx)).format("YYYY MMMM")}
				</p>
				<div className={classes.MonthControlDiv}>
					<div onClick={() => setCurrentMonthIdx(currentMonthIdx - 1)}>
						<IoChevronBack />
					</div>
					<div onClick={() => setCurrentMonthIdx(currentMonthIdx + 1)}>
						<IoChevronForward />
					</div>
				</div>
			</header>
			<div className={classes.SmallCal_calendar}>
				{currentMonth[0].map((day, i) => (
					<div key={i} className={classes.SmallDates}>
						<span>{day.format("dd").charAt(0)}</span>
					</div>
				))}
				{currentMonth.map((row, i) => (
					<React.Fragment key={i}>
						{row.map((day, idx) => {
							return (
								<div
									key={idx}
									className={classes.SmallDates}
									style={getDayClass(day)}
									onClick={
										setClickedDate && setIsClicked
											? () => {
													setClickedDate(day), setIsClicked(Math.random());
											  }
											: () => {}
									}
								>
									<span>{day.format("D")}</span>
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
