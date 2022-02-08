import React from "react";
import Day from "./Day";

import classes from "./Week.module.scss";

export const Week = ({ currentWeek }) => (
	<div className={classes.WeekMain}>
		{currentWeek.map((day, idx) => (
			<Day day={day} key={idx} rowIdx={0} />
		))}
	</div>
);
