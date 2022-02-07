import React, { useContext } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import Button from "../../UI/Button/Button";

import classes from "./CalendarHeader.module.scss";

const CalendarHeader = ({ viewTypes, viewMode, setViewMode }) => {
	dayjs.locale("hu");

	const { monthIndex, setMonthIndex, setShowEventModal } =
		useContext(StateContext);

	const handleReset = () => {
		setMonthIndex(
			monthIndex === dayjs().month()
				? monthIndex + Math.random()
				: dayjs().month()
		);
	};

	return (
		<header className={classes.CalendarHeader}>
			<div className={classes.Flex}>
				<Button clicked={() => setShowEventModal(true)}>
					<Image src="/icons/plus.svg" alt="calendar" width={28} height={28} />
					<span>Létrehoz</span>
				</Button>
				{viewTypes.map((vT, idx) => (
					<div
						className={classes.ViewModeClass}
						key={idx}
						style={{ backgroundColor: viewMode === vT && "#afd7f8" }}
						onClick={() => setViewMode(vT)}
					>
						{vT}
					</div>
				))}
			</div>
			<div className={classes.Flex}>
				<Button clicked={() => setMonthIndex(monthIndex - 1)}>
					<IoChevronBack />
				</Button>
				<Button clicked={handleReset}>Ma</Button>
				<Button clicked={() => setMonthIndex(monthIndex + 1)}>
					<IoChevronForward />
				</Button>
			</div>
			<h2>{dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY MMMM")}</h2>
		</header>
	);
};

export default CalendarHeader;
