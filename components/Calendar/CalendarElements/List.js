import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../context/state-context";

import classes from "./List.module.scss";

export const List = () => {
	const { filteredEvents, setSelectedEvent, setShowEventModal } =
		useContext(StateContext);

	return (
		<div>
			<div className={classes.ListMain}>Eseményeid</div>
			{filteredEvents
				.sort((a, b) => +dayjs(a.startDate) - +dayjs(b.startDate))
				.map((e) => (
					<div
						className={classes.ListElement}
						style={{ backgroundColor: e.label }}
						key={e.id}
						onClick={() => {
							setSelectedEvent(e);
							setShowEventModal(true);
						}}
					>
						<div className={classes.ListTitle}>
							<div>
								<h2>{e.title}</h2>
							</div>
							<div>{e.shortTitle}</div>
							<div>Leírás: {e.description}</div>
						</div>
						<div>
							<div>
								Kezdés: {dayjs(e.startDate).format("YYYY. MMMM DD. - HH:mm")}
							</div>
							<div>
								Végzés: {dayjs(e.endDate).format("YYYY. MMMM DD. - HH:mm")}
							</div>
						</div>

						<div className={classes.ListDates}>
							Dátumok:{" "}
							{e.dates.map((d) => (
								<div key={d.id}>
									{dayjs(d.startTime).format("MM. DD. - HH:mm")} -{" "}
									{dayjs(d.endTime).format("HH:mm")}
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
};
