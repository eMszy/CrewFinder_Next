import React from "react";
import Day from "./Day";

import { getWeek } from "../../../shared/utility";

import classes from "./Week.module.scss";

export const Week = () => {
	let row = getWeek();

	return (
		<div className={classes.WeekMain}>
			{row.map((day, idx) => (
				<Day day={day} key={idx} rowIdx={0} />
			))}
		</div>
	);
};
