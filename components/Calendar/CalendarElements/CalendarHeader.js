import React, { useContext } from "react";

import dayjs from "dayjs";
import "dayjs/locale/hu";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";

import classes from "./CalendarHeader.module.scss";
import Button from "../../UI/Button/Button";

const CalendarHeader = () => {
	dayjs.locale("hu");

	const { monthIndex, setMonthIndex } = useContext(StateContext);

	const handleReset = () => {
		setMonthIndex(
			monthIndex === dayjs().month()
				? monthIndex + Math.random()
				: dayjs().month()
		);
	};
	return (
		<header className={classes.CalendarHeader}>
			<h1>Calendar</h1>
			<Button clicked={handleReset}>Today</Button>
			<Button clicked={() => setMonthIndex(monthIndex - 1)}>
				<IoChevronBack />
			</Button>
			<Button clicked={() => setMonthIndex(monthIndex + 1)}>
				<IoChevronForward />
			</Button>
			<h2>{dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY MMMM")}</h2>
		</header>
	);
};

export default CalendarHeader;
