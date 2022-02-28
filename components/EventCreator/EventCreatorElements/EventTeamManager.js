import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
	// IoAmericanFootballOutline,
	IoCalendarOutline,
	IoCloseCircleOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import { onChangeHandle, uniqueArray } from "./utility";

// import control from "../../../control2.json";

import classes from "./../EventModal.module.scss";
import EventInvition from "./EventInvition";

const EventTeamManager = ({ department, setIsCreatroPage }) => {
	const { setShowEventModal, selectedEvent, dispatchCallEvent } =
		useContext(StateContext);

	const [pickedDays, setPickedDays] = useState([]);
	const [isClicked, setIsClicked] = useState();
	const [clickedDate, setClickedDate] = useState();
	const [crewMembers, setCrewMembers] = useState([]);

	const submitHandle = (e) => {
		e.preventDefault();
		saveHandle();
		setShowEventModal(false);
		setIsCreatroPage(true);
	};

	// console.log("crewMembers", crewMembers);

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
		setClickedDate();
		setCrewMembers([]);
	};

	const addPosHandel = (
		pos,
		id,
		name = "",
		invitionType = { name: "open" }
	) => {
		if (pos && pos !== "") {
			const updatedPos = [
				...crewMembers,
				{ id: id + Math.random(), pos, name, invitionType },
			];
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
			const filteredCrew = day.crew.filter((crew) => crew.id !== id);
			day.crew = filteredCrew;
		});
		setPickedDays(updatedPickedDays);
	};

	useEffect(() => {
		let updatedPickedDates = [...pickedDays];
		updatedPickedDates.forEach((pday) => {
			pday.crew = uniqueArray(pday?.crew, crewMembers);
		});
		setPickedDays(updatedPickedDates);
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
	}, [isClicked]);

	// console.log("pickedDay", pickedDays);

	return (
		<div>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.datesCrew_div}>
							{pickedDays
								.sort((a, b) => a.id - b.id)
								.map((p, _idx) => {
									console.log(
										"Start:",
										dayjs(p.startTime).format("MM. DD. HH:mm"),
										" - End:",
										dayjs(p.endTime).format("MM. DD. HH:mm")
									);
									return (
										<div key={_idx}>
											<div className={classes.datesCrew}>
												<div className={classes.DateAndLoc}>
													<div>
														{dayjs(p.startTime).format("YYYY. MMMM. DD.")}
													</div>
													<input
														type="time"
														name="startTime"
														value={dayjs(p.startTime).format("HH:mm")}
														required
														onChange={(e) => {
															const dateAndTime = dayjs(p.startTime).format(
																`YYYY-MM-DDT${e.target.value}`
															);
															setPickedDays(
																onChangeHandle(
																	+dayjs(dateAndTime),
																	_idx,
																	e.target.name,
																	pickedDays
																)
															);
														}}
													/>
													<input
														type="time"
														name="endTime"
														value={dayjs(p.endTime).format("HH:mm")}
														min={p.startDate}
														required
														onChange={(e) => {
															const dateAndTime = dayjs(p.startTime).format(
																`YYYY-MM-DDT${e.target.value}`
															);
															setPickedDays(
																onChangeHandle(
																	+dayjs(dateAndTime),
																	_idx,
																	e.target.name,
																	pickedDays
																)
															);
														}}
													/>
													<input
														type="text"
														name="location"
														placeholder="Helyszín"
														value={p.location}
														required
														onChange={(e) => {
															setPickedDays(
																onChangeHandle(
																	e.target.value,
																	_idx,
																	e.target.name,
																	pickedDays
																)
															);
														}}
													/>
												</div>
												<div>
													{p?.crew
														.sort((a, b) => a.id - b.id)
														.map(({ id, name, pos, invitionType }, idx) => (
															<div key={idx} className={classes.CrewPosName}>
																<div>{pos}</div>
																<div>{name}</div>
																<div
																	className={classes.Icon}
																	onClick={() => {
																		deletPosHandel(id, p.id);
																	}}
																>
																	<IoCloseCircleOutline />
																</div>
																{invitionType?.name && (
																	<div
																		className={classes.CrewPosName_Attribute}
																	>
																		<div className={classes.CrewPosName_Text}>
																			{invitionType.name}
																		</div>
																		{invitionType.language && (
																			<div className={classes.CrewPosName_Text}>
																				language: {invitionType.language}
																			</div>
																		)}
																		{invitionType.aptitude && (
																			<div className={classes.CrewPosName_Text}>
																				aptitude: {invitionType.aptitude}
																			</div>
																		)}
																	</div>
																)}
															</div>
														))}
												</div>
											</div>
										</div>
									);
								})}
						</div>
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
					</div>
					<EventInvition
						crewMembers={crewMembers}
						addPosHandel={addPosHandel}
						department={department}
						changeHandle={(e) => changeHandle(e)}
						deletPosHandel={deletPosHandel}
					/>

					<div></div>
					<div className={classes.SaveBtn}>
						<Button
							type="submit"
							clicked={() => {
								saveHandle();
								resetHandle();
							}}
							type="button"
						>
							Változások mentése
						</Button>
					</div>
				</div>

				<footer className={classes.EventModal_Footer}>
					<Button type="submit" clicked={submitHandle}>
						Mentés
					</Button>
				</footer>
			</form>
		</div>
	);
};

export default EventTeamManager;
