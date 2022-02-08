import React from "react";

import Day from "./Day";

import classes from "./Month.module.scss";

const Month = ({ currentMonth }) => (
	<div className={classes.CalendarMain_Body_Month}>
		{currentMonth.map((row, i) => (
			<React.Fragment key={i}>
				{row.map((day, idx) => (
					<Day day={day} key={idx} rowIdx={i} />
				))}
			</React.Fragment>
		))}
	</div>
);

export default Month;
