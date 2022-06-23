import React, { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./MonthDays.module.scss";
import {
	eventLoaderHandler,
	getStyle,
	posCounterPerDay,
} from "../../../shared/utility";

const MonthDays = ({ day, rowIdx }) => {
	const [dayEvents, setDayEvents] = useState([]);

	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
		userId,
	} = useContext(StateContext);

	useEffect(() => {
		const events = eventLoaderHandler(filteredEvents, day, userId);
		setDayEvents(events);
	}, [filteredEvents, day, userId]);

	const getCurrentDayClass = () => {
		return day.format("YY-MM-DD") === dayjs().format("YY-MM-DD")
			? classes.ThisDay
			: null;
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
					.sort((a, b) => a.label - b.label)
					.map((evt, idx) => {
						return (
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
											}}
											style={getStyle(evt, day, userId)}
											className={classes.Event}
										>
											{evt.positions && evt.positions.length > 0 && (
												<p>
													{evt.event.shortTitle} - Poziciók: {evt.posCounter}
												</p>
											)}
										</div>
									))}
							</React.Fragment>
						);
					})}
			</div>
		</div>
	);
};

export default MonthDays;
