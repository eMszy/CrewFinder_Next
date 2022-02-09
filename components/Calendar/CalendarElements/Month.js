import React, { useContext } from "react";

import MonthDays from "./MonthDays";

import classes from "./Month.module.scss";
import { StateContext } from "../../../context/state-context";

const Month = ({ currentMonth }) => {
	const { labels, updateLabel } = useContext(StateContext);
	return (
		<div className={classes.CalendarMain_Body_Month}>
			<div className={classes.Title}>
				<h3>Szürők</h3>
				<div className={classes.Filters}>
					{labels.map(({ label: lbl, checked, title }, idx) => (
						<div
							key={idx}
							onClick={() =>
								updateLabel({ label: lbl, checked: !checked, title })
							}
							style={{ backgroundColor: checked && lbl }}
						>
							{title}
						</div>
					))}
				</div>
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
};

export default Month;
