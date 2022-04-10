import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdOutlineDescription, MdTitle } from "react-icons/md";
import {
	IoBookmarkOutline,
	IoCalendarOutline,
	IoLocationOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";

import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./../EventModal.module.scss";
import { uniqueArray } from "./utility";
import EventInvition from "./EventInvition";

import { useSession } from "next-auth/react";

const weekdaysSet = [1, 2, 3, 4, 5, 6, 0];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

//Egyenlőre mindenki csak egy DEPT BaseCrew-t tud kezelni

const EventModal = ({ setIsCreatroPage, department, setDepartment }) => {
	const { daySelected, dispatchCallEvent, selectedEvent, setSelectedEvent } =
		useContext(StateContext);

	const { data: session } = useSession();

	const [inputData, setInputData] = useState({
		title: selectedEvent ? selectedEvent.title : "",
		shortTitle: selectedEvent ? selectedEvent.shortTitle : "",
		description: selectedEvent ? selectedEvent.description : "",
		location: selectedEvent ? selectedEvent.location : "",
		dates: selectedEvent ? selectedEvent.dates : [],
		yourPosition: selectedEvent
			? selectedEvent.yourPosition
			: Object.values(control.departments[department].positions)[0].name,
		baseCrew: selectedEvent ? selectedEvent.baseCrew : [],
		// ha nincs egy nap se kijelölve akkor vissza ugrik az aktuális napra
		// Valami nem jó a napok óra-perc beállításán
		startDate: selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.hour(6)),
		endDate: selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.hour(18)),
		id: selectedEvent ? selectedEvent.id : Math.random(),
		department: selectedEvent ? selectedEvent.department : department,
		label: selectedEvent
			? selectedEvent.label
			: department === "Privát"
			? 6
			: 1,
	});

	const [baseCrew, setBaseCrew] = useState([]);
	const [weekdays, setWeekdays] = useState(weekdaysSet);
	const [clickedDate, setClickedDate] = useState();
	const [isClicked, setIsClicked] = useState();

	const addDatesWithTimes = (startDate, endDate, weekdays = undefined) => {
		let updatedDates = [];

		const daysBetween = dayjs(endDate).diff(dayjs(startDate), "d");
		const sTime = dayjs(inputData.startDate).format("THHmm");
		const eTime = dayjs(inputData.endDate).format("THHmm");

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

				// console.log("first", dayFormating(startTime), dayFormating(endTime));

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

	const submitHandel = async (e) => {
		e.preventDefault();
		let updatedDates = [];
		inputData.dates.forEach((d) => {
			console.log("d", dayjs(d.startTime).format("MM. DD. HH:mm"));

			const crew = uniqueArray(d.crew, [
				...baseCrew,
				{ id: -1, name: "Saját pozicíó", pos: inputData.yourPosition },
			]);
			const loc = d.location ? d.location : inputData.location;
			updatedDates.push({ ...d, crew, location: loc });
		});

		const calendarEvent = {
			...inputData,
			startDate: +dayjs(inputData.startDate),
			endDate: +dayjs(inputData.endDate),
			baseCrew: inputData.baseCrew,
			dates: updatedDates,
			id: selectedEvent ? selectedEvent.id : inputData.label + Math.random(),
			creator: session.id,
			creatorName: selectedEvent
				? selectedEvent.creatorName
				: session.user.name,
			department: department,
		};

		if (selectedEvent) {
			calendarEvent._id = selectedEvent._id;
			calendarEvent.creator = selectedEvent.creator;
			calendarEvent.department = selectedEvent.department;
		}

		setSelectedEvent(calendarEvent);

		if (selectedEvent) {
			dispatchCallEvent({ type: "update", payload: calendarEvent });
		} else {
			dispatchCallEvent({ type: "push", payload: calendarEvent });
		}
		setIsCreatroPage(false);
	};

	const addPosHandel = (
		pos,
		id,
		name = "",
		invitionType = { name: "direct" }
	) => {
		if (pos && pos !== "") {
			const updatedPos = [
				...baseCrew,
				{ id: id + Math.random(), pos, name, invitionType },
			];
			setBaseCrew(updatedPos);
		}
	};

	// console.log("selectedEvent", selectedEvent._id);

	const changeHandle = (updatedCrewMember) => {
		const updatedBaseCrew = baseCrew.filter(
			(b) => b.id !== updatedCrewMember.id
		);
		setBaseCrew([...updatedBaseCrew, updatedCrewMember]);
	};

	const deletPosHandel = (id) => {
		const updatedPos = baseCrew.filter((p) => p.id !== id);
		setBaseCrew(updatedPos);

		const updatedBasePos = inputData.baseCrew.filter((p) => p.id !== id);
		const updatedPickedDays = [...inputData.dates];
		updatedPickedDays.forEach((day) => {
			const filteredCrew = day.crew.filter((crew) => crew.id !== id);
			day.crew = filteredCrew;
		});

		setInputData({
			...inputData,
			baseCrew: updatedBasePos,
			dates: updatedPickedDays,
		});
	};

	useEffect(() => {
		let updateData = {
			...inputData,
			yourPosition: Object.keys(control.departments[department])[0],
		};

		department === "Privát"
			? (updateData = { ...updateData, label: 6 })
			: (updateData = { ...updateData, label: 1 });

		setInputData(updateData);
		// eslint-disable-next-line
	}, [department]);

	// useEffect(() => {
	// 	const updatedDates = addDatesWithTimes(
	// 		inputData.startDate,
	// 		inputData.endDate
	// 	);
	// 	console.log("first", updatedDates);
	// 	setInputData({
	// 		...inputData,
	// 		dates: [...inputData.dates, ...updatedDates],
	// 	});
	// }, [inputData.startDate, inputData.endDate]);

	// useEffect(() => {
	// 	const updatedDates = addDatesWithTimes(
	// 		inputData.endDate,
	// 		inputData.endDate
	// 	);
	// 	setInputData({
	// 		...inputData,
	// 		dates: [...inputData.dates, ...updatedDates],
	// 	});
	// }, [inputData.endDate]);

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
		// eslint-disable-next-line
	}, [isClicked]);

	useEffect(() => {
		// Mi a sDate és az eDate?
		let sDate;
		let eDate;
		const sTime = dayjs(inputData.startDate).format("THH:mm");
		const eTime = dayjs(inputData.endDate).format("THH:mm");

		inputData.dates.forEach((date) => {
			date.startTime < sDate || !sDate ? (sDate = date.startTime) : null;
			date.startTime > eDate || !eDate ? (eDate = date.startTime) : null;
		});

		const startDay = dayjs(sDate).format(`YYYY-MM-DD${sTime}`);
		const endDay = dayjs(eDate).format(`YYYY-MM-DD${eTime}`);

		setInputData({ ...inputData, startDate: startDay, endDate: endDay });
		// eslint-disable-next-line
	}, [inputData.dates]);

	useEffect(() => {
		let updatedCrew = uniqueArray(inputData.baseCrew, baseCrew);
		setInputData({ ...inputData, baseCrew: updatedCrew });
		// eslint-disable-next-line
	}, [baseCrew]);

	return (
		<form>
			<div className={classes.EventModal_MainBody}>
				<div className={classes.EventModal_Input}>
					<div className={classes.Icon}>
						<IoBookmarkOutline />
					</div>
					<div className={classes.YourPosition}>
						<p>Esemény:</p>
						{selectedEvent?.department ? (
							<p>{selectedEvent.department}</p>
						) : (
							<select
								value={department.positions}
								onChange={(e) => setDepartment(e.target.value)}
							>
								{[...session.metaData.isHOD, "Privát"].map((dep, id) => (
									<option key={id} value={dep}>
										{dep}
									</option>
								))}
							</select>
						)}
					</div>
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
						name="description"
						placeholder="Leírás"
						value={inputData.description}
						required
						onChange={(e) =>
							setInputData({ ...inputData, description: e.target.value })
						}
					/>
					<div className={classes.Icon}>
						<IoLocationOutline />
					</div>
					<input
						type="text"
						name="location"
						placeholder="Helyszín"
						value={inputData.location}
						required
						onChange={(e) =>
							setInputData({ ...inputData, location: e.target.value })
						}
					/>
					<div className={classes.Icon}>
						<IoBookmarkOutline />
					</div>
					<div className={classes.weekDayClass}>
						{weekdaysSet.map((dayNum, i) => {
							const day = dayjs().day(dayNum).format("dd");
							let style = {};
							weekdays.includes(dayNum) || (style = { backgroundColor: "red" });
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
					{department !== "Privát" && (
						<>
							<div className={classes.Icon}>
								<MdOutlineDescription />
							</div>
							<div className={classes.YourPosition}>
								<p>Saját pozicíód: </p>
								<select
									value={inputData.yourPosition}
									onChange={(e) =>
										setInputData({ ...inputData, yourPosition: e.target.value })
									}
								>
									{control.departments[department] &&
										Object.keys(
											control.departments[inputData.department].positions
										).map((pos, id) => (
											<option key={id} value={pos}>
												{pos}
											</option>
										))}
								</select>
							</div>
						</>
					)}
				</div>

				<div className={classes.EventModal_CalendarDiv}>
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
					{selectedEvent && (
						<div>
							<p className={classes.CreatorName}>Létrehozta:</p>
							<p>{selectedEvent.creatorName}</p>
						</div>
					)}
				</div>

				{department !== "Privát" && selectedEvent?.department !== "Privát" && (
					<EventInvition
						crewMembers={inputData.baseCrew}
						addPosHandel={addPosHandel}
						department={department}
						changeHandle={changeHandle}
						deletPosHandel={deletPosHandel}
					/>
				)}
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
