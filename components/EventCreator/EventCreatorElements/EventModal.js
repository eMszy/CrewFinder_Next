import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdOutlineDescription, MdTitle } from "react-icons/md";
import {
	IoBookmarkOutline,
	IoCheckmark,
	IoCalendarOutline,
	IoCloseCircleOutline,
	IoAmericanFootballOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";

import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import { findColor } from "../../../shared/utility";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./../EventModal.module.scss";

const weekdaysSet = [1, 2, 3, 4, 5, 6, 0];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

//Egyenlőre mindenki csak egy DEPT BaseCrew-t tud kezelni

const EventModal = ({ setIsCreatroPage, department, setDepartment }) => {
	const {
		daySelected,
		dispatchCalEvent,
		selectedEvent,
		setSelectedEvent,
		labels,
	} = useContext(StateContext);

	const [inputData, setInputData] = useState({
		title: selectedEvent ? selectedEvent.title : "",
		shortTitle: selectedEvent ? selectedEvent.shortTitle : "",
		description: selectedEvent ? selectedEvent.description : "",
		label: selectedEvent ? selectedEvent.label : labels[0].id,
		dates: selectedEvent ? selectedEvent.dates : [],
		yourPosition: selectedEvent ? selectedEvent.yourPosition : "",
		baseCrew: selectedEvent ? selectedEvent.baseCrew : [],
		// ha nincs egy nap se kijelölve akkor vissza ugrik az aktuális napra
		startDate: selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.hour(6)),
		endDate: selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.hour(18)),
		id: selectedEvent ? selectedEvent.id : Math.random(),
	});

	const [baseCrew, setBaseCrew] = useState(
		selectedEvent ? selectedEvent.baseCrew : []
	);

	const [weekdays, setWeekdays] = useState(weekdaysSet);
	const [clickedDate, setClickedDate] = useState();
	const [isClicked, setIsClicked] = useState();

	const addPosHandel = (pos, id) => {
		if (pos && pos !== "") {
			const updatedPos = [
				...baseCrew,
				{ id: id + Math.random(), pos: pos, name: "" },
			];
			setBaseCrew(updatedPos);
		}
	};

	const deletPosHandel = (id) => {
		const updatedPos = baseCrew.filter((p) => p.id !== id);
		setBaseCrew(updatedPos);
	};

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

	const submitHandel = (e) => {
		e.preventDefault();

		let updatedDates = [];

		const id = Math.random();
		inputData.dates.forEach((d) =>
			updatedDates.push({
				...d,
				crew: [
					...baseCrew,
					{
						id: id,
						pos: inputData.yourPosition,
						name: "A te poziciód",
					},
				],
			})
		);

		console.log(
			"ezt kell kijavítani, hogy ne írjon mindent stábtagot felül",
			updatedDates
		);

		const calendarEvent = {
			...inputData,
			startDate: +dayjs(inputData.startDate),
			endDate: +dayjs(inputData.endDate),
			baseCrew: baseCrew,
			dates: updatedDates,
		};

		setSelectedEvent(calendarEvent);

		if (selectedEvent) {
			dispatchCalEvent({ type: "update", payload: calendarEvent });
		} else {
			dispatchCalEvent({ type: "push", payload: calendarEvent });
		}

		setIsCreatroPage(false);
	};

	useEffect(() => {
		setInputData({
			...inputData,
			yourPosition: Object.keys(control.departments[department])[0],
		});
		setBaseCrew(selectedEvent ? selectedEvent.baseCrew : []);
	}, [department]);

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

	return (
		<form>
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
						<div onClick={allDayCheck} className={classes.weekDayClass}>
							Összes nap
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
				</div>

				<div className={classes.EventModal_Calendar}>
					<SmallCalendar
						filteredEvents={[
							{
								label: inputData.label,
								startDate: +dayjs(inputData.startDate),
								endDate: +dayjs(inputData.endDate),
								dates: inputData.dates,
								selectedEventDates: [],
							},
						]}
						setClickedDate={setClickedDate}
						setIsClicked={setIsClicked}
					/>
				</div>

				<div className={classes.EventModal_Input2}>
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
								Object.keys(control.departments[department]).map((pos, id) => (
									<option key={id} value={pos}>
										{pos}
									</option>
								))}
						</select>
					</div>
					<div className={classes.Icon}>
						<IoAmericanFootballOutline />
					</div>
					<div>
						<div>
							<p>Az alap csapatod:</p>
						</div>
						<div className={classes.BaseTeam}>
							<div className={classes.BaseTeam_PosDiv}>
								<div>
									<p>Poziciók</p>
								</div>
								{baseCrew
									.sort((a, b) => a.id - b.id)
									.map(({ pos, name, id }, idx) => {
										return (
											<div key={idx} className={classes.BaseTeam_Pos}>
												<div className={classes.BaseTeam_PosTitle}>{pos}</div>
												<input
													type="text"
													name="name"
													placeholder="Név"
													value={name}
													required
													onChange={(e) => {
														let updatedPos = [...baseCrew];
														updatedPos.forEach((p) =>
															p.id === id ? (p.name = e.target.value) : null
														);
														setBaseCrew(updatedPos);
													}}
												/>
												<div
													className={classes.Icon}
													onClick={() => deletPosHandel(id)}
												>
													<IoCloseCircleOutline />
												</div>
											</div>
										);
									})}
							</div>
							<div className={classes.BaseTeam_Choice}>
								<p>Hozzáadása</p>
								{control.departments[department] &&
									Object.keys(control.departments[department]).map(
										(pos, id) => (
											<Button
												clicked={() => addPosHandel(pos, id)}
												type="button"
												key={id}
											>
												{pos}
											</Button>
										)
									)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className={classes.EventModal_Footer}>
				<Button type="submit" clicked={submitHandel}>
					Tovább
				</Button>
			</footer>
		</form>
	);
};

export default EventModal;
