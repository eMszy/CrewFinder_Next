import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./MonthDays.module.scss";
import { findColor } from "../../../shared/utility";

const MonthDays = ({ day, rowIdx }) => {
	const [dayEvents, setDayEvents] = useState([]);

	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
	} = useContext(StateContext);

	// console.log("filteredEvents", filteredEvents);

	useEffect(() => {
		let events = [];
		filteredEvents.forEach((event) => {
			let isExist = event.dates.find(
				(d) =>
					dayjs(d.startTime).format("YYMMDD") === dayjs(day).format("YYMMDD")
			);
			if (isExist) {
				events.push(event);
			}
			setDayEvents(events);
		});
	}, [filteredEvents, day]);

	const getCurrentDayClass = () => {
		return day.format("YY-MM-DD") === dayjs().format("YY-MM-DD")
			? classes.ThisDay
			: null;
	};

	const getStyle = (evt) => {
		let style = { background: findColor(evt.label) };
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
				{rowIdx === 0 && <p>{day.format("ddd").toUpperCase()}</p>}
				<p className={getCurrentDayClass()}>{day.format("DD")}</p>
			</header>
			<div
				className={classes.EventDiv}
				onClick={() => {
					setDaySelected(day);
					setShowEventModal(true);
				}}
			>
				{dayEvents
					.sort((a, b) => a.startDate - b.startDate)
					.map((evt, idx) => (
						<React.Fragment key={idx}>
							{idx <= 4 &&
								(dayEvents.length > 5 && idx === 4 ? (
									<div className={classes.MoreEvent}>
										<p>További események</p>
									</div>
								) : (
									<div
										onClick={() => {
											setSelectedEvent(evt);
											//Ez a referencia
											console.log("evt", evt);
										}}
										style={getStyle(evt)}
										className={classes.Event}
									>
										{dayjs(evt.startDate).format("YY-MM-DD") ===
											day.format("YY-MM-DD") && <p>{evt.title}</p>}
									</div>
								))}
						</React.Fragment>
					))}
			</div>
		</div>
	);
};

export default MonthDays;
