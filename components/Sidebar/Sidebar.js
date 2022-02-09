import dayjs from "dayjs";
import React, { useContext } from "react";
import { StateContext } from "../../context/state-context";

import classes from "./Sidebar.module.scss";

const Sidebar = () => {
	const { filteredEvents, setSelectedEvent, setShowEventModal } =
		useContext(StateContext);

	return (
		<div className={classes.SidebarMain}>
			<div className={classes.SidebarHeader}>
				<h2>Értesítések</h2>
				{filteredEvents.length === 0 || <p>({filteredEvents.length})</p>}
			</div>
			<div className={classes.SidebarElements}>
				{filteredEvents
					.sort((a, b) => a.startDate - b.startDate)
					.map((event) => (
						<div
							key={event.id}
							onClick={() => {
								setSelectedEvent(event);
								setShowEventModal(true);
							}}
							className={classes.SidebarElement}
							style={{ backgroundColor: event.label }}
						>
							<h3>{event.shortTitle}</h3>
							<div>
								{dayjs(event.startDate).format("YYYY. MMMM. DD. HH:mm")}
							</div>
							<div>
								{dayjs(event.startDate).format("HH:mm")} -{" "}
								{dayjs(event.endDate).format("HH:mm")}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default Sidebar;
