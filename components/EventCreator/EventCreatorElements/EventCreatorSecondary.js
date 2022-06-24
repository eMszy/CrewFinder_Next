import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { IoCalendarOutline, IoCloseCircleOutline } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import { addPosHelper, uniqueArray } from "./utility";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import EventICreatorTeamManager from "./EventICreatorTeamManager";

const EventCreatorSecondary = ({
	department,
	setEventCreatroPage,
	isEventCreatorMain,
}) => {
	const { setShowEventModal, selectedEvent, dispatchCallEvent } =
		useContext(StateContext);

	const [pickedDays, setPickedDays] = useState([]);
	const [isClicked, setIsClicked] = useState(false);
	const [clickedDate, setClickedDate] = useState(undefined);
	const [crewMembers, setCrewMembers] = useState([]);
	const [isTeamManagerValid, setTeamManagerValid] = useState(true);

	const submitHandle = (e) => {
		e.preventDefault();
		saveHandle();
		setShowEventModal(false);
		setEventCreatroPage(true);
	};

	const saveHandle = () => {
		const datesArray = uniqueArray(selectedEvent.dates, pickedDays);
		const calendarEvent = {
			...selectedEvent,
			dates: datesArray,
		};

		dispatchCallEvent({ type: "update", payload: calendarEvent });
	};

	const resetHandle = () => {
		setPickedDays([]);
		setClickedDate(false);
		setCrewMembers([]);
	};

	const addPosHandel = (pos, id) => {
		const updatedPos = addPosHelper(pos, id, crewMembers);
		if (updatedPos) {
			setCrewMembers(updatedPos);
		}
	};

	const changeHandle = (updatedCrewMember) => {
		const updatedBaseCrew = crewMembers.filter(
			(b) => b.id !== updatedCrewMember.id
		);
		setCrewMembers([...updatedBaseCrew, updatedCrewMember]);
	};

	const deletPosHandel = (id, days = undefined) => {
		const updatedPos = crewMembers.filter((p) => p.id !== id);
		setCrewMembers(updatedPos);

		const updatedPickedDays = [...pickedDays];
		updatedPickedDays.forEach((day) => {
			if ((days && day.id === days) || !days) {
				const filteredCrew = day.crew.filter((crew) => crew.id !== id);
				day.crew = filteredCrew;
			}
		});
		setPickedDays(updatedPickedDays);
	};

	useEffect(() => {
		let updatedPickedDates = [...pickedDays];
		updatedPickedDates.forEach((pday) => {
			pday.crew = uniqueArray(pday?.crew, crewMembers);
		});
		setPickedDays(updatedPickedDates);
		// eslint-disable-next-line
	}, [isClicked, crewMembers]);

	useEffect(() => {
		if (clickedDate) {
			let updatedpickedDays = pickedDays;

			const pickedDay = selectedEvent.dates.find(
				(d) => d.id === +dayjs(clickedDate).format("YYYYMMDD")
			);

			if (pickedDay) {
				let isExist = updatedpickedDays.find((d) => d.id === pickedDay.id);

				if (!isExist) {
					updatedpickedDays.push(pickedDay);
				} else {
					updatedpickedDays = pickedDays.filter((d) => d.id !== pickedDay.id);
				}

				setClickedDate();
				setPickedDays(updatedpickedDays);
			}
		}
		// eslint-disable-next-line
	}, [isClicked]);

	const onChangeHandle = (value, id, name, day) => {
		const filteredDay = day.filter((elem) => elem.id !== day[id].id);
		return [...filteredDay, { ...day[id], [name]: value }];
	};

	// console.log("pickedDays", pickedDays);
	console.log("selectedEvent", selectedEvent);

	return (
		<div>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						{/* ide jönnek a pozik */}
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							filteredEvents={[
								{
									label: selectedEvent.label,
									startDate: +dayjs(selectedEvent.startDate),
									endDate: +dayjs(selectedEvent.endDate),
									dates: pickedDays,
									selectedEventDates: selectedEvent.dates,
								},
							]}
							setClickedDate={setClickedDate}
							setIsClicked={setIsClicked}
						/>
						<div className={classes.EventModal_Calendar__ControlBtns}>
							<Button
								type="button"
								clicked={() => setPickedDays(selectedEvent.dates)}
							>
								Mind
							</Button>
							<Button type="button" clicked={() => setPickedDays([])}>
								Töröl
							</Button>
						</div>
					</div>
				</div>

				<footer className={classes.EventModal_Footer}>
					<Button
						type="submit"
						clicked={submitHandle}
						disabled={!isTeamManagerValid}
					>
						Mentés
					</Button>
				</footer>
			</form>
		</div>
	);
};

export default EventCreatorSecondary;
