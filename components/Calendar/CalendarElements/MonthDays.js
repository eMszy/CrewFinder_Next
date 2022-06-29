import React, { useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";

import classes from "./MonthDays.module.scss";
import { eventLoaderHandler, getStyle } from "../../../shared/utility";

const MonthDays = ({ day, rowIdx }) => {
	const { data: session, status } = useSession();

	const [dayEvents, setDayEvents] = useState([]);

	const {
		setDaySelected,
		setShowEventModal,
		filteredEvents,
		setSelectedEvent,
	} = useContext(StateContext);

	useSession;

	useEffect(() => {
		if (status === "authenticated") {
			const events = eventLoaderHandler(filteredEvents, day, session.id);
			setDayEvents(events);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredEvents, day, status]);

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
											style={getStyle(evt, day, session.id)}
											className={classes.Event}
										>
											{evt.positions && evt.positions.length > 0 && (
												<p>
													{evt.shortTitle} - Poziciók: {evt.posCounter}
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
