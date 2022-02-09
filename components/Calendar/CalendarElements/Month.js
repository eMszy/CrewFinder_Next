import React from "react";

import MonthDays from "./MonthDays";
import Filter from "./Filter";

import classes from "./Month.module.scss";

const Month = ({ currentMonth }) => (
	<div className={classes.CalendarMain_Body_Month}>
		<div className={classes.Title}>
			<Filter />
		</div>
		{currentMonth.map((row, i) => (
			<React.Fragment key={i}>
				{row.map((day, idx) => (
					<MonthDays day={day} key={idx} rowIdx={i} />
				))}
			</React.Fragment>
		))}
	</div>
);

export default Month;
