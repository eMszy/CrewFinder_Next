import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./WeekDays.module.scss";
import { findColor } from "../../../shared/utility";

const WeekDays = ({ day, rowStyle }) => {
	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
		labels,
	} = useContext(StateContext);

	const [dayEvents, setDayEvents] = useState([]);

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

	const getBackGround = (e) => {
		return { backgroundColor: e.label.slice(0, -4).concat("90%)") };
	};

	return (
		<div className={classes.MainDayDiv} style={rowStyle()}>
			<header>
				<div>
					<p>{day.format("ddd").toUpperCase()}</p>
					<p className={getCurrentDayClass()}>{day.format("DD")}</p>
				</div>
			</header>
			{labels.map((e, id) => (
				<div key={id} style={getBackGround(e)}>
					{dayEvents.map(
						(d, idx) =>
							d.label === e.id && (
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
