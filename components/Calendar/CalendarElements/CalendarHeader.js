import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/hu";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import Button from "../../UI/Button/Button";

import classes from "./CalendarHeader.module.scss";
import { getMonth, getWeek } from "../../../shared/utility";

dayjs.locale("hu");
dayjs.extend(weekOfYear);

const CalendarHeader = ({
	viewTypes,
	viewMode,
	setViewMode,
	setCurrentWeek,
	setCurrentMonth,
}) => {
	const [monthIndex, setMonthIndex] = useState(dayjs().month());
	const [weekIndex, setWeekIndex] = useState();

	useEffect(() => {
		switch (viewMode) {
			case "Havi":
				setCurrentMonth(getMonth(monthIndex));
				break;
			case "Heti":
				setCurrentWeek(getWeek(weekIndex));
				break;
			default:
				break;
		}
		// eslint-disable-next-line
	}, [monthIndex, viewMode]);

	const { setShowEventModal } = useContext(StateContext);

	console.log("viewMode", classes.ViewModeActive);

	return (
		<header className={classes.CalendarHeader}>
			<div className={classes.Control}>
				<Button clicked={() => setShowEventModal(true)}>
					<Image src="/icons/plus.svg" alt="calendar" width={28} height={28} />
					<span>Létrehoz</span>
				</Button>
				{viewTypes.map((vT, idx) => (
					<div
						className={[
							classes.ViewModeClass,
							viewMode === vT && classes.ViewModeActive,
						].join(" ")}
						key={idx}
						// viewMode === vT && (style={ { backgroundColor: "#afd7f8" }})
						onClick={() => {
							setViewMode(vT);
							setMonthIndex(dayjs().month());
							setWeekIndex(dayjs().date() - dayjs().day() + 1);
						}}
					>
						{vT}
					</div>
				))}
			</div>
			{viewMode === "Lista" || (
				<div className={classes.Flex}>
					<Button
						clicked={() => {
							setMonthIndex(monthIndex - 1);
							setWeekIndex(weekIndex - 7);
						}}
					>
						<IoChevronBack />
					</Button>
					<Button
						clicked={() => {
							setMonthIndex(dayjs().month());
							setWeekIndex(dayjs().date() - dayjs().day() + 1);
						}}
					>
						Ma
					</Button>
					<Button
						clicked={() => {
							setMonthIndex(monthIndex + 1);
							setWeekIndex(weekIndex + 7);
						}}
					>
						<IoChevronForward />
					</Button>
				</div>
			)}
			<div className={classes.Date}>
				{viewMode === "Havi" && (
					<h2>
						{dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY MMMM")}
					</h2>
				)}
				{viewMode === "Heti" && (
					<h2>
						{dayjs(new Date(dayjs())).format("YYYY. MMMM")} -{" "}
						{dayjs(new Date(dayjs().year(), dayjs().month(), weekIndex)).week()}
						. hét
					</h2>
				)}
				{viewMode === "Lista" && <h2> {dayjs().format("YYYY. MMMM DD.")}</h2>}
			</div>
		</header>
	);
};

export default CalendarHeader;
