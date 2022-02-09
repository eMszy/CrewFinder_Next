import React, { useContext } from "react";
import WeekDays from "./WeekDays";

import classes from "./Week.module.scss";
import { StateContext } from "../../../context/state-context";

export const Week = ({ currentWeek }) => {
	const { labels, updateLabel } = useContext(StateContext);
	return (
		<div className={classes.WeekMain}>
			<div className={classes.Title}>
				<div>
					<h3>Szürők</h3>
				</div>
				{labels.map(({ label: lbl, checked, title }, idx) => (
					<div
						className={classes.Filters}
						key={idx}
						onClick={() =>
							updateLabel({ label: lbl, checked: !checked, title })
						}
						style={{ backgroundColor: checked && lbl }}
					>
						<p>{title}</p>
					</div>
				))}
			</div>
			{currentWeek.map((day, idx) => (
				<WeekDays day={day} key={idx} />
			))}
		</div>
	);
};
