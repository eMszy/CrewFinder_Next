import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./WeekDays.module.scss";

const WeekDays = ({ day }) => {
	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
		labels,
	} = useContext(StateContext);

	const [dayEvents, setDayEvents] = useState([]);

	useEffect(() => {
		const events = filteredEvents.filter(
			(evt) =>
				evt.weekDays.includes(+day.format("d")) &&
				day.format("YY-MM-DD") >= dayjs(evt.startDate).format("YY-MM-DD") &&
				day.format("YY-MM-DD") <= dayjs(evt.endDate).format("YY-MM-DD")
		);

		setDayEvents(events);
	}, [filteredEvents, day]);

	const getCurrentDayClass = () => {
		return day.format("YY-MM-DD") === dayjs().format("YY-MM-DD")
			? classes.ThisDay
			: null;
	};

	const getStyle = (evt) => {
		let style = { background: evt.label };

		if (dayjs(evt.startDate).format("YY-MM-DD") === day.format("YY-MM-DD")) {
			style = {
				...style,
				borderRadius: "999px 0 0 999px",
				marginLeft: "0.5rem",
			};
		}

		if (dayjs(evt.endDate).format("YY-MM-DD") === day.format("YY-MM-DD")) {
			style = {
				...style,
				borderRadius: style.borderRadius ? "999px" : "0 999px 999px 0",
				marginRight: "0.5rem",
			};
		}
		return style;
	};

	return (
		<div className={classes.MainDayDiv}>
			<header>
				<div>
					<p>{day.format("ddd").toUpperCase()}</p>
					<p className={getCurrentDayClass()}>{day.format("DD")}</p>
				</div>
			</header>
			{labels.map((e) => (
				<div>
					{dayEvents.map(
						(d, idx) =>
							d.label === e.label && (
								<div
									key={idx}
									className={classes.EventDiv}
									onClick={() => {
										setDaySelected(day);
										setShowEventModal(true);
									}}
								>
									<div
										onClick={() => setSelectedEvent(d)}
										style={getStyle(d)}
										className={classes.Event}
									>
										{(dayjs(day).day() === 1 ||
											dayjs(d.startDate).format("YY-MM-DD") ===
												day.format("YY-MM-DD")) &&
											d.title}
									</div>
								</div>
							)
					)}
				</div>
			))}
		</div>
	);
};

export default WeekDays;
