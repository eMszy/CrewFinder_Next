import React, { useContext, useEffect, useState } from "react";

import { StateContext } from "../../../context/state-context";
import { getMonth } from "../../../shared/utility";

import Day from "./Day";

import classes from "./Month.module.scss";

const Month = () => {
	const [currenMonth, setCurrentMonth] = useState(getMonth());
	const { monthIndex } = useContext(StateContext);

	useEffect(() => {
		setCurrentMonth(getMonth(monthIndex));
	}, [monthIndex]);

	return (
		<div className={classes.CalendarMain_Body_Month}>
			{currenMonth.map((row, i) => (
				<React.Fragment key={i}>
					{row.map((day, idx) => (
						<Day day={day} key={idx} column={idx} rowIdx={i} />
					))}
				</React.Fragment>
			))}
		</div>
	);
};

export default Month;
