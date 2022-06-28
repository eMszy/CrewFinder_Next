import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { IoCalendarOutline, IoCloseCircleOutline } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";
import { addPosHelper, uniqueArray } from "./utility";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import EventICreatorTeamManager from "./EventICreatorTeamManager";
import { findColor } from "../../../shared/utility";

const EventCreatorSecondary = ({
	department,
	setEventCreatroPage,
	isEventCreatorMain,
	eventPositions,
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

	if (!eventPositions || eventPositions.length < 1)
		return (
			<div className={classes.Loding_Spinner}>
				<Spinner />;
			</div>
		);

	return (
		<div>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.acceptorDates_MainLayout}>
						<div className={classes.acceptorDates_MainDiv}>
							<p>
								{selectedEvent.event.title} {" - "}{" "}
								{selectedEvent.event.shortTitle}
							</p>
							<div className={classes.acceptorDates_SubDiv}>
								<div className={classes.acceptorDates}>
									{eventPositions.map((pos) => {
										// console.log("selectedEvent", selectedEvent);
										console.log("pos", pos);

										let label = 6;
										let invited = [];
										const directInvited = [];
										const applied = [];
										const confirmed = [];
										const creator = [];
										pos.users.forEach((user) => {
											switch (user.label) {
												case 5:
													invited.push(user);
													if (!label || label > 5) label = 5;
													break;
												case 4:
													directInvited.push(user);
													if (!label || label > 4) label = 4;
													break;
												case 3:
													applied.push(user);
													if (!label || label > 3) label = 3;
													break;
												case 2:
													confirmed.push(user);
													if (!label || label > 2) label = 2;
													break;
												case 1:
													creator.push(user);
													if (!label || label > 1) label = 1;
													break;
												default:
													label = 6;
											}
										});

										// console.log("label", label);

										const style = {
											background: `linear-gradient(135deg, ${findColor(1)
												.slice(0, -4)
												.concat("90%)")} 45%, ${findColor(label)
												.slice(0, -4)
												.concat("90%)")} 65%`,
										};
										const val = control.invitionType.find(
											(v) => v.type === pos.invition.type
										);
										return (
											<div
												key={pos._id}
												id={pos._id}
												className={[
													classes.acceptorDates_div,
													// pickedPosId &&
													// 	pos.position._id.toString() ===
													// 		pickedPosId.toString() &&
													// 	classes.activePos,
												].join(" ")}
												onClick={(e) => {
													setPickedPosId(e.currentTarget.id);
													setTheEvent(pos);
												}}
											>
												<div
													style={style}
													className={classes.acceptorDates_Pos}
												>
													<p>{pos.posName}</p>

													<p className={classes.Text400}>{val.name}</p>
													{console.log("val.name", val.name)}
													{(val.type === "open" ||
														val.type === "attribute") && (
														<>
															<p className={classes.Text400}>
																Visszaigazolt: {confirmed.length}
															</p>
															<p className={classes.Text400}>
																Jelentkeztek: {applied.length}
															</p>
															<p className={classes.Text400}>
																Nem jelzett: {invited.length}
															</p>
														</>
													)}
													{val.type === "direct" && (
														<>
															<p className={classes.Text400}>
																Visszaigazolt: {confirmed.length}
															</p>
															<p className={classes.Text400}>
																Nem jelzett: {directInvited.length}
															</p>
														</>
													)}
													<p className={classes.Text400}>
														Napok: {pos.dates.length}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							filteredEvents={[
								{
									label: 1,
									dates: pickedDays,
									selectedEventDates: eventPositions[0].dates,
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
