import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete, MdOutlineDescription, MdTitle } from "react-icons/md";
import {
	IoClose,
	IoBookmarkOutline,
	IoCheckmark,
	IoCalendarOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "./SmallCalendar";
import { findColor } from "../../../shared/utility";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./EventModal.module.scss";

const weekdaysSet = [1, 2, 3, 4, 5, 6, 0];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

const EventModal = () => {
	const {
		setShowEventModal,
		daySelected,
		dispatchCalEvent,
		selectedEvent,
		labels,
	} = useContext(StateContext);

	const [inputData, setInputData] = useState({
		title: selectedEvent ? selectedEvent.title : "",
		shortTitle: selectedEvent ? selectedEvent.shortTitle : "",
		description: selectedEvent ? selectedEvent.description : "",
		label: selectedEvent ? selectedEvent.label : labels[0].id,
		dates: selectedEvent ? selectedEvent.dates : [],
		yourPosition: selectedEvent ? selectedEvent.yourPosition : "",
		baseCrew: selectedEvent ? selectedEvent.baseCrew : {},
		// ha nincs egy nap se kijelölve akkor vissza ugrik az aktuális napra
		startDate: selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.hour(6)),
		endDate: selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.hour(18)),
		id: selectedEvent ? selectedEvent.id : Math.random(),
	});

	const [weekdays, setWeekdays] = useState(weekdaysSet);
	const [clickedDate, setClickedDate] = useState();
	const [isClicked, setIsClicked] = useState();

	const [department, setDepartment] = useState(
		Object.keys(control.departments)[0]
	);

	useEffect(() => {
		setInputData({
			...inputData,
			yourPosition: Object.keys(control.departments[department])[0],
		});
	}, [department]);

	const addDatesWithTimes = (startDate, endDate, weekdays = undefined) => {
		let updatedDates = [];

		const daysBetween = dayjs(endDate).diff(dayjs(startDate), "d");
		const sTime = dayjs(startDate).format("THHmm");
		const eTime = dayjs(endDate).format("THHmm");
		for (let i = 0; i <= daysBetween; i++) {
			let isExist = false;

			inputData.dates.forEach((date) => {
				if (date.id === +dayjs(startDate).add(i, "d").format(`YYYYMMDD`)) {
					isExist = true;
				}
			});

			// vasárnap visszajelölésénél van valami para

			if (
				!isExist &&
				(!weekdays || dayjs(startDate).add(i, "d").day() === weekdays)
			) {
				const startTime = dayjs(startDate)
					.add(i, "d")
					.format(`YYYYMMDD${sTime}`);

				let j = i;
				if (sTime > eTime) {
					j++;
				}

				const endTime = dayjs(startDate).add(j, "d").format(`YYYYMMDD${eTime}`);

				updatedDates.push({
					id: +dayjs(startDate).add(i, "d").format(`YYYYMMDD`),
					startTime: +dayjs(startTime),
					endTime: +dayjs(endTime),
					crew: {},
				});
			}
		}
		return updatedDates;
	};

	const allDayCheck = () => {
		const updatedDates = addDatesWithTimes(
			inputData.startDate,
			inputData.endDate
		);
		setWeekdays(weekdaysSet);
		setClickedDate();
		setInputData({
			...inputData,
			dates: [...inputData.dates, ...updatedDates],
		});
	};

	const setWeekdaysHandel = (dayNum) => {
		let updatedDaySelection = [...weekdays];

		if (weekdays.includes(dayNum)) {
			updatedDaySelection = weekdays.filter((d) => dayNum !== d);
			const updatedDates = inputData.dates.filter(
				(dt) => dayjs(dt.startTime).day() !== dayNum
			);
			setInputData({ ...inputData, dates: updatedDates });
		} else {
			updatedDaySelection.push(dayNum);
			const updatedDates = addDatesWithTimes(
				dayFormating(inputData.startDate),
				dayFormating(inputData.endDate),
				dayNum
			);
			setInputData({
				...inputData,
				dates: [...inputData.dates, ...updatedDates],
			});
		}
		setWeekdays(updatedDaySelection);
	};

	useEffect(() => {
		const updatedDates = addDatesWithTimes(
			inputData.startDate,
			inputData.startDate
		);
		setInputData({
			...inputData,
			dates: [...inputData.dates, ...updatedDates],
		});
	}, [inputData.startDate]);

	useEffect(() => {
		const updatedDates = addDatesWithTimes(
			inputData.endDate,
			inputData.endDate
		);
		setInputData({
			...inputData,
			dates: [...inputData.dates, ...updatedDates],
		});
	}, [inputData.endDate]);

	useEffect(() => {
		let pickedDate = inputData.dates.find(
			(date) =>
				dayjs(date.startTime).format("YYMMDD") ===
				dayjs(clickedDate).format("YYMMDD")
		);

		if (pickedDate) {
			const updatedDates = inputData.dates.filter(
				(dt) => dt.id !== pickedDate.id
			);
			setInputData({ ...inputData, dates: updatedDates });
		} else {
			const updatedDates = addDatesWithTimes(
				dayFormating(clickedDate),
				dayFormating(clickedDate)
			);
			setInputData({
				...inputData,
				dates: [...inputData.dates, ...updatedDates],
			});
		}
		setClickedDate();
	}, [isClicked]);

	useEffect(() => {
		let sDate;
		let eDate;
		inputData.dates.forEach((date) => {
			date.startTime < sDate || !sDate ? (sDate = date.startTime) : null;
			date.startTime > eDate || !eDate ? (eDate = date.startTime) : null;
		});
		const sTime = dayjs(inputData.startDate).format("THH:mm");
		const eTime = dayjs(inputData.endDate).format("THH:mm");

		const startDay = dayjs(sDate).format(`YYYY-MM-DD${sTime}`);
		const endDay = dayjs(eDate).format(`YYYY-MM-DD${eTime}`);

		setInputData({ ...inputData, startDate: startDay, endDate: endDay });
	}, [inputData.dates]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const calendarEvent = {
			...inputData,
			startDate: +dayjs(inputData.startDate),
			endDate: +dayjs(inputData.endDate),
		};

		if (selectedEvent) {
			dispatchCalEvent({ type: "update", payload: calendarEvent });
		} else {
			dispatchCalEvent({ type: "push", payload: calendarEvent });
		}

		setShowEventModal(false);
	};

	const deletHandel = (e) => {
		e.preventDefault();
		dispatchCalEvent({
			type: "delete",
			payload: selectedEvent,
		});
		setShowEventModal(false);
	};

	return (
		<div className={classes.EventModal_Main}>
			<form>
				<header className={classes.EventModal_Main_Header}>
					<div className={classes.Icon}>
						<GiHamburgerMenu />
					</div>
					<div className={classes.ButtomDiv}>
						{selectedEvent && (
							<div type="button" className={classes.Icon} onClick={deletHandel}>
								<MdDelete />
							</div>
						)}
						<div
							type="button"
							className={classes.Icon}
							onClick={() => setShowEventModal(false)}
						>
							<IoClose />
						</div>
					</div>
				</header>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						<div className={classes.Icon}>
							<MdTitle />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<input
								type="text"
								name="title"
								placeholder="Projek neve"
								value={inputData.title}
								required
								onChange={(e) =>
									setInputData({ ...inputData, title: e.target.value })
								}
							/>
							<input
								type="text"
								name="shortTitle"
								placeholder="Rövidítés"
								value={inputData.shortTitle}
								required
								onChange={(e) =>
									setInputData({ ...inputData, shortTitle: e.target.value })
								}
							/>
						</div>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<input
								type="datetime-local"
								name="startDate"
								value={inputData.startDate}
								required
								onChange={(e) =>
									setInputData({
										...inputData,
										startDate: e.target.value,
									})
								}
							/>
							<input
								type="datetime-local"
								name="endDate"
								value={inputData.endDate}
								min={inputData.startDate}
								required
								onChange={(e) =>
									setInputData({
										...inputData,
										endDate: e.target.value,
									})
								}
							/>
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<input
							type="text"
							name="Leírás"
							placeholder="Leírás"
							value={inputData.description}
							required
							onChange={(e) =>
								setInputData({ ...inputData, description: e.target.value })
							}
						/>
						<div></div>
						<div className={classes.weekDayClass}>
							{weekdaysSet.map((dayNum, i) => {
								const day = dayjs().day(dayNum).format("dd");
								let style = {};
								weekdays.includes(dayNum) ||
									(style = { backgroundColor: "#ff000080" });
								return (
									<span
										key={i}
										onClick={() => setWeekdaysHandel(dayNum)}
										style={style}
									>
										{day}
									</span>
								);
							})}
							<div onClick={allDayCheck}>
								<p>Minden nap kijelöl</p>
							</div>
						</div>
						<div className={classes.Icon}>
							<IoBookmarkOutline />
						</div>
						<div className={classes.labelsClass}>
							{labels.map((lblClass, i) => (
								<span
									key={i}
									onClick={() =>
										setInputData({ ...inputData, label: lblClass.id })
									}
									style={{ backgroundColor: findColor(lblClass.id) }}
								>
									{inputData.label === lblClass.id && <IoCheckmark />}
								</span>
							))}
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<div className={classes.YourPosition}>
							<p>Saját pozicíód: </p>
							<select
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
							>
								{Object.keys(control.departments).map((dep, id) => (
									<option key={id} value={dep}>
										{dep}
									</option>
								))}
							</select>
							<select
								value={inputData.yourPosition}
								onChange={(e) =>
									setInputData({ ...inputData, yourPosition: e.target.value })
								}
							>
								{control.departments[department] &&
									Object.keys(control.departments[department]).map(
										(pos, id) => (
											<option key={id} value={pos}>
												{pos}
											</option>
										)
									)}
							</select>
						</div>
						<div></div>
						<div>Alapcsapat</div>
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							filteredEvents={[
								{
									label: inputData.label,
									startDate: +dayjs(inputData.startDate),
									endDate: +dayjs(inputData.endDate),
									dates: inputData.dates,
								},
							]}
							setClickedDate={setClickedDate}
							setIsClicked={setIsClicked}
						/>
					</div>
				</div>
				<footer className={classes.EventModal_Footer}>
					<Button type="submit" clicked={handleSubmit}>
						Mentés
					</Button>
				</footer>
			</form>
		</div>
	);
};

export default EventModal;
