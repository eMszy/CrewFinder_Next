import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./Day.module.scss";

const Day = ({ day, rowIdx }) => {
	const [dayEvents, setDayEvents] = useState([]);

	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
	} = useContext(StateContext);

	console.log("filteredEvents", filteredEvents);

	useEffect(() => {
		const events = filteredEvents.filter(
			(evt) =>
				evt.weekDays.includes(day.format("dd")) &&
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

	return (
		<div className={classes.MinaDayDiv}>
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
					.map((evt, idx) => {
						let style = { background: evt.label };

						if (
							dayjs(evt.startDate).format("YY-MM-DD") === day.format("YY-MM-DD")
						) {
							style = {
								...style,
								borderRadius: "999px 0 0 999px",
								marginLeft: "0.5rem",
							};
						}

						if (
							dayjs(evt.endDate).format("YY-MM-DD") === day.format("YY-MM-DD")
						) {
							style = {
								...style,
								borderRadius: style.borderRadius ? "999px" : "0 999px 999px 0",
								marginRight: "0.5rem",
							};
						}

						return (
							<React.Fragment key={idx}>
								{idx <= 3 &&
									(dayEvents.length > 4 && idx === 3 ? (
										<div className={classes.MoreEvent}>
											<p>További események</p>
										</div>
									) : (
										<div
											onClick={() => setSelectedEvent(evt)}
											style={style}
											className={classes.Event}
										>
											{dayjs(evt.startDate).format("YY-MM-DD") ===
												day.format("YY-MM-DD") && evt.title}
										</div>
									))}
							</React.Fragment>
						);
					})}
			</div>
		</div>
	);
};

export default Day;
