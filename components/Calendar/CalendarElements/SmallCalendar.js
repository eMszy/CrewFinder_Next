import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { getMonth } from "../../../shared/utility";

import classes from "./SmallCalendar.module.scss";

const SmallCalendar = ({ filteredEvents, clickedDate, setClickedDate }) => {
	const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
	const [currentMonth, setCurrentMonth] = useState(getMonth());

	useEffect(() => {
		setCurrentMonth(getMonth(currentMonthIdx));
	}, [currentMonthIdx]);

	const getDayClass = (day) => {
		const format = "YY-MM-DD";
		const nowDay = dayjs().format(format);
		const currDay = day.format(format);

		const fEventByDay = filteredEvents.find(
			(f) =>
				f.weekDays.includes(+day.format("d")) &&
				+day.add(1, "day").subtract(1, "minute") >= f.startDate &&
				+day <= f.endDate
		);

		let style = { borderRadius: "999px" };

		if (nowDay === currDay) {
			style = { ...style, borderColor: "#afd7f8" };
		}
		if (fEventByDay) {
			style = { ...style, backgroundColor: fEventByDay.label, color: "white" };
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
					<span key={i}>{day.format("dd").charAt(0)}</span>
				))}
				{currentMonth.map((row, i) => (
					<React.Fragment key={i}>
						{row.map((day, idx) => {
							return (
								<div
									key={idx}
									className={classes.SmallDates}
									style={getDayClass(day)}
								>
									<div
										onClick={() => {
											if (clickedDate.includes(day)) {
												const filtedCDate = clickedDate.filter(
													(e) => +dayjs(e) !== +dayjs(day)
												);
												setClickedDate(filtedCDate);
											} else {
												setClickedDate([...clickedDate, day]);
											}
										}}
									>
										<span>{day.format("D")}</span>
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
