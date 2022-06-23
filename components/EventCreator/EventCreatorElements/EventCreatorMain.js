import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdOutlineDescription } from "react-icons/md";
import { IoBookmarkOutline, IoCalendarOutline } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";

import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import {
	addPosHelper,
	dayFormating,
	eventOtherTemplate,
	eventTypeTemplate,
	uniqueArray,
	weekdaysSet,
} from "./utility";
import EventICreatorTeamManager from "./EventICreatorTeamManager";

import { useSession } from "next-auth/react";
import InputElement from "../../UI/Input/InputElement";
import { inputChangedHandler, isAllInputVaild } from "../../../shared/utility";
import { createPostfix } from "typescript";

//Egyenlőre mindenki csak egy DEPT BaseCrew-t tud kezelni

const EventCreatorMain = ({
	setIsCreatroPage,
	department,
	setDepartment,
	isEventCreatorMain,
}) => {
	const {
		daySelected,
		dispatchCallEvent,
		selectedEvent,
		setSelectedEvent,
		createEvent,
		updateEvent,
		userId,
	} = useContext(StateContext);

	const { data: session, status } = useSession();

	const [weekdays, setWeekdays] = useState(weekdaysSet);
	const [clickedDate, setClickedDate] = useState();
	const [isClicked, setIsClicked] = useState();
	const [isTeamManagerValid, setTeamManagerValid] = useState(true);

	const [isDateTuched, setDateTuched] = useState(false);

	const [eventTypedData, setEventTypedData] = useState(
		eventTypeTemplate(selectedEvent)
	);

	const [eventInputData, setEventInputData] = useState(
		eventOtherTemplate(selectedEvent, daySelected, department)
	);

	const inputChanged = (event) => {
		setEventTypedData(inputChangedHandler(event, eventTypedData));
	};

	const addDatesWithTimes = (startDate, endDate, weekdays = undefined) => {
		let updatedDates = [];

		const daysBetween = dayjs(endDate).diff(dayjs(startDate), "d");
		const sTime = dayjs(eventInputData.startDate).format("THHmm");
		const eTime = dayjs(eventInputData.endDate).format("THHmm");

		for (let i = 0; i <= daysBetween; i++) {
			let isExist = false;

			eventInputData.dates.forEach((date) => {
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
			eventInputData.startDate,
			eventInputData.endDate
		);
		setWeekdays(weekdaysSet);
		setClickedDate();
		setEventInputData({
			...eventInputData,
			dates: [...eventInputData.dates, ...updatedDates],
		});
	};

	const setWeekdaysHandel = (dayNum) => {
		let updatedDaySelection = [...weekdays];

		if (weekdays.includes(dayNum)) {
			updatedDaySelection = weekdays.filter((d) => dayNum !== d);
			const updatedDates = eventInputData.dates.filter(
				(dt) => dayjs(dt.startTime).day() !== dayNum
			);
			setEventInputData({ ...eventInputData, dates: updatedDates });
		} else {
			updatedDaySelection.push(dayNum);
			const updatedDates = addDatesWithTimes(
				dayFormating(eventInputData.startDate),
				dayFormating(eventInputData.endDate),
				dayNum
			);
			setEventInputData({
				...eventInputData,
				dates: [...eventInputData.dates, ...updatedDates],
			});
		}
		setWeekdays(updatedDaySelection);
	};

	const submitHandel = async (e) => {
		e.preventDefault();

		const event = {};
		const creatorPosition = {};

		const theCreatorPos = selectedEvent?.positions.find(
			(pos) => pos.position.invition.type === "creator"
		);

		if (!selectedEvent || isDateTuched || isClicked) {
			Object.assign(event, {
				startDate: +dayjs(eventInputData.startDate),
				endDate: +dayjs(eventInputData.endDate),
				dates: eventInputData.dates,
			});
			Object.assign(creatorPosition, {
				startDate: +dayjs(eventInputData.startDate),
				endDate: +dayjs(eventInputData.endDate),
				dates: eventInputData.dates,
			});
		}
		if (!selectedEvent) {
			Object.assign(event, {
				weight: eventInputData.weight,
				department: eventInputData.department,
				positions: eventInputData.positions,
				creator: session.id,
				creatorPosition: eventInputData.creatorPosition,
			});
			Object.assign(creatorPosition, {
				invition: { type: "creator" },
				weight:
					control.departments[eventInputData.department].positions[
						eventInputData.creatorPosition
					]?.weight || 0,
			});
		}
		for (const [key, value] of Object.entries(eventTypedData)) {
			if (value.touched) {
				Object.assign(event, { [key]: value.value });
			}
		}

		if (theCreatorPos?.position.posName !== eventInputData.creatorPosition) {
			Object.assign(creatorPosition, {
				posName: eventInputData.creatorPosition,
			});
		}

		const baseTeamPositions = [];
		const positions = [];
		const label = department === "Privát" ? 0 : 1;

		if (Object.keys(creatorPosition).length !== 0) {
			positions.push({
				...creatorPosition,
				_id: theCreatorPos?.position._id,
				invition: { type: "creator" },
				label,
			});
		}

		if (baseTeamPositions.length) {
			positions.push(baseTeamPositions);
		}

		let updateData = {};

		if (!selectedEvent) {
			createEvent({
				event,
				positions,
			});
		} else {
			if (Object.keys(event).length !== 0) {
				Object.assign(updateData, {
					event: {
						...event,
						// creatorId: userId,
						_id: selectedEvent.event._id,
					},
				});
			}
			if (positions.length) {
				Object.assign(updateData, { positions });
			}
			if (Object.keys(updateData).length !== 0) {
				updateEvent({ ...updateData, creatorId: userId });
			}
		}
	};

	const addPosHandel = (pos, id) => {
		// const updatedPos = addPosHelper(pos, id, baseCrew, { name: "direct" });
		// if (updatedPos) {
		// 	setBaseCrew(updatedPos);
		// }
	};

	// console.log("selectedEvent", selectedEvent._id);

	// const changeHandle = (updatedCrewMember) => {
	// 	const updatedBaseCrew = baseCrew.filter(
	// 		(b) => b.id !== updatedCrewMember.id
	// 	);
	// 	setBaseCrew([...updatedBaseCrew, updatedCrewMember]);
	// };

	const deletPosHandel = (id) => {
		setBaseCrew((currentBaseCrew) =>
			currentBaseCrew.filter((p) => p.id !== id)
		);

		// const updatedBasePos = eventInputData.baseCrew.filter((p) => p.id !== id);
		const updatedPickedDays = [...eventInputData.dates];
		updatedPickedDays.forEach((day) => {
			const filteredCrew = day.crew?.filter((c) => c.id !== id);
			day.crew = filteredCrew;
		});

		setEventInputData({
			...eventInputData,
			dates: updatedPickedDays,
		});
	};

	useEffect(() => {
		setEventInputData((currentData) => {
			return {
				...currentData,
				department,
				creatorPosition: Object.values(
					control.departments[department].positions
				)[0].name,
			};
		});
	}, [department]);

	// useEffect(() => {
	// 	let updateData = {
	// 		...eventInputData,
	// 		yourPosition: Object.keys(control.departments[department])[0],
	// 	};

	// 	department === "Privát"
	// 		? (updateData = { ...updateData, label: 0 })
	// 		: (updateData = { ...updateData, label: 1 });

	// 	setEventInputData(updateData);
	// 	// eslint-disable-next-line
	// }, [department]);

	useEffect(() => {
		let pickedDate = eventInputData.dates.find(
			(date) =>
				dayjs(date.startTime).format("YYMMDD") ===
				dayjs(clickedDate).format("YYMMDD")
		);

		if (pickedDate) {
			const updatedDates = eventInputData.dates.filter(
				(dt) => dt.id !== pickedDate.id
			);
			setEventInputData({ ...eventInputData, dates: updatedDates });
		} else {
			const updatedDates = addDatesWithTimes(
				dayFormating(clickedDate),
				dayFormating(clickedDate)
			);
			setEventInputData({
				...eventInputData,
				dates: [...eventInputData.dates, ...updatedDates],
			});
		}
		setClickedDate();
		// eslint-disable-next-line
	}, [isClicked]);

	useEffect(() => {
		// Mi a sDate és az eDate?
		let sDate;
		let eDate;
		const sTime = dayjs(eventInputData.startDate).format("THH:mm");
		const eTime = dayjs(eventInputData.endDate).format("THH:mm");

		eventInputData.dates.forEach((date) => {
			date.startTime < sDate || !sDate ? (sDate = date.startTime) : null;
			date.startTime > eDate || !eDate ? (eDate = date.startTime) : null;
		});

		const startDay = dayjs(sDate).format(`YYYY-MM-DD${sTime}`);
		const endDay = dayjs(eDate).format(`YYYY-MM-DD${eTime}`);

		setEventInputData({
			...eventInputData,
			startDate: startDay,
			endDate: endDay,
		});
		// eslint-disable-next-line
	}, [eventInputData.dates]);

	// useEffect(() => {
	// 	let updatedCrew = uniqueArray(eventInputData.baseCrew, baseCrew);
	// 	setEventInputData((currentEventInputData) => {
	// 		return { ...currentEventInputData, baseCrew: updatedCrew };
	// 	});
	// 	// eslint-disable-next-line
	// }, [baseCrew]);

	return (
		<form>
			<div className={classes.EventModal_MainBody}>
				<div className={classes.EventModal_Input}>
					<div className={classes.Icon}>
						<IoBookmarkOutline />
					</div>
					<div className={classes.YourPosition}>
						<p>Esemény:</p>
						{selectedEvent ? (
							<p>{selectedEvent.event.department}</p>
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
					<InputElement Form={eventTypedData} changed={inputChanged} />
					<div className={classes.Icon}>
						<IoCalendarOutline />
					</div>
					<div className={classes.EventModal_TwoInputs}>
						<input
							type="datetime-local"
							name="startDate"
							value={eventInputData.startDate}
							min={dayFormating(dayjs())}
							required
							onChange={(e) => {
								setDateTuched(true);
								setEventInputData({
									...eventInputData,
									startDate: e.target.value,
								});
							}}
						/>
						<input
							type="datetime-local"
							name="endDate"
							value={eventInputData.endDate}
							min={eventInputData.startDate}
							required
							onChange={(e) => {
								setDateTuched(true);
								setEventInputData({
									...eventInputData,
									endDate: e.target.value,
								});
							}}
						/>
					</div>
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
									onClick={() => {
										setDateTuched(true);
										setWeekdaysHandel(dayNum);
									}}
									style={style}
								>
									{day}
								</span>
							);
						})}
						<div
							onClick={() => {
								allDayCheck();
								setDateTuched(true);
							}}
							className={classes.weekDayClass}
						>
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
									value={eventInputData.creatorPosition}
									onChange={(e) =>
										setEventInputData({
											...eventInputData,
											creatorPosition: e.target.value,
										})
									}
								>
									{control.departments[department] &&
										Object.keys(
											control.departments[eventInputData.department].positions
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
									label: eventInputData.department === "Privát" ? 0 : 1,
									startDate: +dayjs(eventInputData.startDate),
									endDate: +dayjs(eventInputData.endDate),
									dates: eventInputData.dates,
									selectedEventDates: [],
								},
							]}
							setClickedDate={setClickedDate}
							setIsClicked={setIsClicked}
						/>
					</div>
					{/* {console.log(selectedEvent.event)} */}
					{selectedEvent &&
						(selectedEvent.event.creator === userId ? (
							<div>
								<p> Saját esemény </p>
							</div>
						) : (
							<div>
								<p className={classes.CreatorName}>Létrehozta:</p>
								<p> IDE KELL A NÉV</p>
							</div>
						))}
				</div>
				{/* {department !== "Privát" && selectedEvent?.department !== "Privát" && (
					<EventICreatorTeamManager
						crewMembers={eventInputData.baseCrew}
						addPosHandel={addPosHandel}
						department={department}
						changeHandle={changeHandle}
						deletPosHandel={deletPosHandel}
						setValid={setTeamManagerValid}
						isValid={isTeamManagerValid}
						isEventCreatorMain={isEventCreatorMain}
					/>
				)} */}
			</div>
			<footer className={classes.EventModal_Footer}>
				<Button
					type="submit"
					clicked={submitHandel}
					disabled={!isAllInputVaild(eventTypedData) || !isTeamManagerValid}
				>
					Tovább
				</Button>
			</footer>
		</form>
	);
};

export default EventCreatorMain;
