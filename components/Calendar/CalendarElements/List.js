import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../context/state-context";
import { findColor } from "../../../shared/utility";
import Filter from "./Filter";

import classes from "./List.module.scss";

const List = () => {
	const { filteredEvents, setSelectedEvent, setShowEventModal } =
		useContext(StateContext);

	return (
		<div className={classes.ListMain}>
			<div className={classes.Filter}>
				<Filter />
			</div>
			<div className={classes.ListEvents}>
				<h3>Eseményeid</h3>
				{filteredEvents
					.sort((a, b) => +dayjs(a.startDate) - +dayjs(b.startDate))
					.map((e) => (
						<div
							className={classes.ListElement}
							style={{ backgroundColor: findColor(e.label) }}
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
								{e.positions.map((p) =>
									p.date.map((d) => (
										<div key={d.id}>
											{dayjs(d.startTime).format("MM. DD. - HH:mm")} -{" "}
											{dayjs(d.endTime).format("HH:mm")}
										</div>
									))
								)}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default List;
