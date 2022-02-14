import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
	IoAmericanFootballOutline,
	IoCalendarOutline,
	IoCloseCircleOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import { uniqueArray } from "./utility";

import control from "../../../control.json";

import classes from "./../EventModal.module.scss";

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

	const saveHandle = () => {
		const calendarEvent = {
			...selectedEvent,
			dates: [...selectedEvent.dates, ...pickedDays],
		};

		dispatchCallEvent({ type: "update", payload: calendarEvent });
	};

	const resetHandle = () => {
		setPickedDays([]);
		setClickedDate();
		setCrewMembers([]);
	};

	const onChangeHandle = (e, pos, id) => {
		const inputedMember = { id, pos, name: e.target.value };
		let updatedCrew = crewMembers.filter((crewMember) => crewMember.id !== id);
		updatedCrew.push(inputedMember);
		setCrewMembers(updatedCrew);
	};

	useEffect(() => {
		let updatedPickedDates = [...pickedDays];
		updatedPickedDates.forEach((pday) => {
			pday?.crew = uniqueArray(pday?.crew, crewMembers);
		});
		setPickedDays(updatedPickedDates);
	}, [isClicked, crewMembers]);

	const addPosHandel = (pos, id, name = "") => {
		if (pos && pos !== "") {
			const updatedPos = [
				...crewMembers,
				{ id: id + Math.random(), pos, name },
			];
			setCrewMembers(updatedPos);
		}
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
											{dayjs(p?.startTime).format("YYYY. MMMM. DD.")}
											<div>
												{p?.crew
													.sort((a, b) => a.id - b.id)
													.map(({ id, name, pos }, idx) => (
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
					</div>

					<div className={classes.EventModal_Input2}>
						<div className={classes.Icon}>
							<IoAmericanFootballOutline />
						</div>
						<div>
							<div>
								<p>Az csapatod:</p>
							</div>
							<div className={classes.BaseTeam}>
								<div className={classes.BaseTeam_PosDiv}>
									<div>
										<p>Poziciók</p>
									</div>
									{crewMembers
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
														onChange={(e) => onChangeHandle(e, pos, id)}
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
							<div className={classes.SaveBtn}>
								<Button
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
