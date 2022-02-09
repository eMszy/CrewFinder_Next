import React, { useContext } from "react";
import WeekDays from "./WeekDays";

import classes from "./Week.module.scss";
import { StateContext } from "../../../context/state-context";
import Filter from "./Filter";

export const Week = ({ currentWeek }) => {
	const { labels, updateLabel } = useContext(StateContext);
	return (
		<div className={classes.WeekMain}>
			<div className={classes.Title}>
				<Filter />
			</div>
			{currentWeek.map((day, idx) => (
				<WeekDays day={day} key={idx} />
			))}
		</div>
	);
};
