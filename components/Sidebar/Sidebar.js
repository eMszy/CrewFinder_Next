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
				{filteredEvents.map((event) => (
					<div
						key={event.id}
						onClick={() => {
							setSelectedEvent(event);
							setShowEventModal(true);
						}}
						className={classes.SidebarElement}
						style={{ backgroundColor: event.label }}
					>
						{event.title}
					</div>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
