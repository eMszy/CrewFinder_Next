import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./WeekDays.module.scss";
import { findColor } from "../../../shared/utility";
import { eventLoaderHandler, posCounterPerDay } from "./utility";

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
		const events = eventLoaderHandler(filteredEvents, day);
		setDayEvents(events);
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
					{dayEvents.map((evt, idx) => {
						return (
							evt.label === e.id && (
								<div
									key={idx}
									className={classes.EventDiv}
									onClick={() => {
										setDaySelected(day);
										setShowEventModal(true);
									}}
								>
									<div
										onClick={() => setSelectedEvent(evt)}
										style={getStyle(evt)}
										className={classes.Event}
									>
										<div>
											{(dayjs(day).day() === 1 ||
												dayjs(evt.startDate).format("YY-MM-DD") ===
													day.format("YY-MM-DD")) &&
												evt.title}
										</div>
										<div>
											{evt.shortTitle} - Poziciók: {posCounterPerDay(evt, day)}
										</div>
									</div>
								</div>
							)
						);
					})}
				</div>
			))}
		</div>
	);
};

export default WeekDays;
