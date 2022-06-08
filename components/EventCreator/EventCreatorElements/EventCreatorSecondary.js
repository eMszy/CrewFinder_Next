import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoCalendarOutline, IoCloseCircleOutline } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import { addPosHelper, uniqueArray } from "./utility";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import EventICreatorTeamManager from "./EventICreatorTeamManager";

const EventCreatorSecondary = ({ department, setIsCreatroPage }) => {
	const { setShowEventModal, selectedEvent, dispatchCallEvent } =
		useContext(StateContext);

	const [pickedDays, setPickedDays] = useState([]);
	const [isClicked, setIsClicked] = useState();
	const [clickedDate, setClickedDate] = useState();
	const [crewMembers, setCrewMembers] = useState([]);
	const [isTeamManagerValid, setTeamManagerValid] = useState(true);

	const submitHandle = (e) => {
		e.preventDefault();
		saveHandle();
		setShowEventModal(false);
		setIsCreatroPage(true);
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
		setClickedDate();
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
								.map((p, _idx) => (
									<div key={_idx}>
										<div className={classes.datesCrew}>
											<div className={classes.DateAndLoc}>
												<div>
													{dayjs(p.startTime).format("YYYY. MMMM. DD.")}
												</div>
												<div>{dayjs(p.startTime).format("dddd")}</div>

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
													.map((c, idx) => (
														<div key={idx} className={classes.CrewPosName}>
															<select
																name="pos"
																value={c.pos}
																onChange={(e) => {
																	//ezt majd meg kell írni
																}}
															>
																{control.departments[
																	selectedEvent.department
																] &&
																	Object.keys(
																		control.departments[
																			selectedEvent.department
																		].positions
																	).map((pos, id) => (
																		<option key={id}>{pos}</option>
																	))}
															</select>
															{c.invitionType ? (
																<select
																	name="invitionType"
																	value={c.invitionType?.name}
																	onChange={(e) => {
																		//ezt majd meg kell írni
																	}}
																>
																	{control.invitionType.map((t) => (
																		<option key={t.type} value={t.type}>
																			{t.name}
																		</option>
																	))}
																</select>
															) : (
																<div className={classes.Text400}>Saját</div>
															)}
															{c.invitionType?.name === "direct" ? (
																<input
																	type="text"
																	name="name"
																	value={c.name}
																	required
																	onChange={() => {
																		//ezt majd meg kell írni
																	}}
																/>
															) : (
																<div></div>
															)}
															<div
																className={classes.Icon}
																onClick={() => deletPosHandel(c.id, p.id)}
															>
																<IoCloseCircleOutline />
															</div>

															{c.invitionType?.name === "attribute" && (
																<div className={classes.CrewPosName_Attribute}>
																	{control.departments[
																		department
																	].attribute.map((att, id) => (
																		<div key={id}>
																			<label htmlFor={att.type}>
																				{att.name} -{" "}
																				{att.range[c.invitionType[att.type]]}
																			</label>
																		</div>
																	))}
																</div>
															)}
														</div>
													))}
											</div>
										</div>
									</div>
								))}
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
					{selectedEvent.department !== "Privát" && (
						<EventICreatorTeamManager
							crewMembers={crewMembers}
							addPosHandel={addPosHandel}
							department={department}
							changeHandle={(e) => changeHandle(e)}
							deletPosHandel={deletPosHandel}
							setValid={setTeamManagerValid}
							isValid={isTeamManagerValid}
						/>
					)}

					<div></div>
					<div className={classes.SaveBtn}>
						<Button
							type="button"
							disabled={!isTeamManagerValid}
							clicked={(e) => {
								e.preventDefault();
								saveHandle();
								resetHandle();
							}}
						>
							Változások mentése
						</Button>
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
