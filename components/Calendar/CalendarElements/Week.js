import React, { useContext } from "react";

import WeekDays from "./WeekDays";
import Filter from "./Filter";
import { StateContext } from "../../../context/state-context";

import classes from "./Week.module.scss";

export const Week = ({ currentWeek }) => {
	const { labels } = useContext(StateContext);

	const getRowStyle = () => {
		let template = ["3rem"];
		labels.forEach((l) =>
			l.checked ? template.push(" 1fr") : template.push(" 2rem")
		);
		return { gridTemplateRows: template.join("") };
	};

	return (
		<div className={classes.WeekMain}>
			<div className={classes.Title} style={getRowStyle()}>
				<Filter />
			</div>
			{currentWeek.map((day, idx) => (
				<WeekDays day={day} key={idx} rowStyle={getRowStyle} />
			))}
		</div>
	);
};
