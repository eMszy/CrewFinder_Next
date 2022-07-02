import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";

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
	const [pickedPos, setPickedPos] = useState();
	const [pickedPosId, setPickedPosId] = useState();

	const [selectedEventPositions, setSelectedEventPositions] = useState([]);

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

		// dispatchCallEvent({ type: "update", payload: calendarEvent });
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

	const onChangeHandle = (value, id, name, day) => {
		const filteredDay = day.filter((elem) => elem.id !== day[id].id);
		return [...filteredDay, { ...day[id], [name]: value }];
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

	useEffect(() => {
		if (pickedPosId) {
			const thePosition = selectedEventPositions.find(
				(p) => p._id.toString() === pickedPosId.toString()
			);
			setPickedPos(thePosition);
		}
		// eslint-disable-next-line
	}, [pickedPosId]);

	useEffect(() => {
		const selectedPositions = [];
		eventPositions.forEach((pos) => {
			let label;
			const invited = [];
			const directInvited = [];
			const applied = [];
			const confirmed = [];
			const creator = [];
			const resigned = [];

			pos.users.forEach((user) => {
				switch (user.label) {
					case 6:
						resigned.push(user);
						if (!label || label > 6) label = 6;
						break;
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
				}
			});

			selectedPositions.push({
				_id: pos._id,
				dates: pos.dates,
				invition: pos.invition,
				posName: pos.posName,
				resigned,
				invited,
				directInvited,
				applied,
				confirmed,
				creator,
				label,
			});
		});
		selectedPositions
			.sort(
				(a, b) =>
					control.departments[department].positions[b.posName].weight -
					control.departments[department].positions[a.posName].weight
			)
			.sort((a, b) => a.label - b.label);
		setSelectedEventPositions(selectedPositions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventPositions]);

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
						<p>
							{selectedEvent.event.title} {" - "}{" "}
							{selectedEvent.event.shortTitle}
						</p>
						{pickedPos && (
							<div
								className={[
									classes.acceptorDates_MainDiv,
									!pickedPos && classes.Zero_Height,
								].join(" ")}
								style={{
									background: `linear-gradient(135deg, ${findColor(1)
										.slice(0, -4)
										.concat("90%)")} 35%, ${findColor(pickedPos.label)
										.slice(0, -4)
										.concat("90%)")} 50%`,
								}}
							>
								{!pickedPos && <p>Kiválasztott pozició</p>}
								<div className={classes.acceptorDates_SubDiv}>
									<div className={classes.acceptorDates}>
										<div className={classes.acceptorDates_addPos}>
											<div className={classes.acceptorDates_Pos}>
												<p>{pickedPos.posName}</p>
												<p className={classes.Text400}>Visszaigazolt: Nem</p>
												<p className={classes.Text400}>
													Jelentkeztek: {pickedPos.applied.length}
												</p>
												<p className={classes.Text400}>
													Nem jelzett: {pickedPos.invited.length}
												</p>
												<p className={classes.Text400}>
													Napok: {pickedPos.dates.length}
												</p>
												{/* {console.log("pickedPos", pickedPos)} */}
											</div>
										</div>
										<div
											className={[
												classes.Span2,
												classes.acceptorDates_Candidates,
											].join(" ")}
										>
											{pickedPos.applied.map((pos) => (
												<div
													className={classes.acceptorDates_Candidates_Grid}
													onClick={(e) => console.log("e", e.currentTarget.id)}
													key={pos._id}
													id={pos._id}
												>
													<div className={classes.acceptorDates_Candidates_Img}>
														<Image
															src={pos.image}
															width={35}
															height={35}
															alt={pos.name}
														/>
													</div>
													<div>{pos.name}</div>
													<div className={classes.Text400}>XP: X</div>
													<div className={classes.Text400}>Értékelés: X</div>
													{/* {console.log("pos", pos)} */}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}
						<div className={classes.acceptorDates_MainDiv}>
							<p>Még be nem telt poziciók</p>
							<div className={classes.acceptorDates_SubDiv}>
								<div className={classes.acceptorDates}>
									<div
										className={classes.acceptorDates_addPos}
										onClick={(e) => console.log(e)}
									>
										<Image
											src="/icons/plus.svg"
											alt="calendar"
											width={100}
											height={100}
										/>
									</div>
									{selectedEventPositions
										.filter((pos) => pos.label > 2)
										.map((pos) => {
											const style = {
												background: `linear-gradient(135deg, ${findColor(1)
													.slice(0, -4)
													.concat("90%)")} 35%, ${findColor(pos.label)
													.slice(0, -4)
													.concat("90%)")} 50%`,
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
														pickedPosId &&
															pos._id.toString() === pickedPosId.toString() &&
															classes.activePos,
													].join(" ")}
													onClick={(e) => {
														setPickedPosId(e.currentTarget.id);
													}}
												>
													<div
														style={style}
														className={classes.acceptorDates_Pos}
													>
														<p>{pos.posName}</p>

														<p className={classes.Text400}>{val.name}</p>
														{(val.type === "open" ||
															val.type === "attribute") && (
															<>
																<p className={classes.Text400}>
																	Visszaigazolt: Nem
																</p>
																<p className={classes.Text400}>
																	Jelentkeztek: {pos.applied.length}
																</p>
																<p className={classes.Text400}>
																	Nem jelzett: {pos.invited.length}
																</p>
															</>
														)}
														{val.type === "direct" &&
															pos.directInvited.length !== 0 && (
																<>
																	<p>{pos.directInvited[0].name}</p>
																	<p className={classes.Text400}>
																		Visszaigazolt: Nem
																	</p>
																</>
															)}
														{val.type === "direct" &&
															pos.resigned.length !== 0 && (
																<>
																	<p>{pos.resigned[0].name}</p>
																	<p>Lemondta</p>
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
						<div className={classes.acceptorDates_MainDiv}>
							<p>Betelt poziciók</p>
							<div className={classes.acceptorDates_SubDiv}>
								<div className={classes.acceptorDates}>
									{selectedEventPositions
										.filter((pos) => pos.label < 3)
										.map((pos) => {
											const style = {
												background: `linear-gradient(135deg, ${findColor(1)
													.slice(0, -4)
													.concat("90%)")} 35%, ${findColor(pos.label)
													.slice(0, -4)
													.concat("90%)")} 50%`,
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
														pickedPosId &&
															pos._id.toString() === pickedPosId.toString() &&
															classes.activePos,
													].join(" ")}
													onClick={(e) => {
														setPickedPosId(e.currentTarget.id);
													}}
												>
													<div
														style={style}
														className={classes.acceptorDates_Pos}
													>
														<p>{pos.posName}</p>

														<p className={classes.Text400}>{val.name}</p>
														{(val.type === "open" ||
															val.type === "attribute") && (
															<p>{pos.confirmed[0].name}</p>
														)}
														{val.type === "direct" && (
															<p>{pos.confirmed[0].name}</p>
														)}
														<p className={classes.Text400}>
															Visszaigazolt: Igen
														</p>
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
					<div className={classes.Sidebar}>
						<div className={classes.EventModal_Calendar}>
							<SmallCalendar
								filteredEvents={[
									{
										label: pickedPos ? pickedPos.label : 1,
										dates: pickedPos ? pickedPos.dates : null,
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

						{pickedPos && (
							<div className={classes.EventModal_Sidebar}>
								<div>
									<p>
										{selectedEvent.event.title} {" - "}{" "}
										{selectedEvent.event.shortTitle}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Leírás</p>
									<p className={classes.Text400}>
										{selectedEvent.event.description}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Dátumok:</p>
									{pickedPos?.dates?.map((d) => (
										<p key={d.startTime} className={classes.Text400}>
											{dayjs(d.startTime).format("YY. MMMM DD.")}
											{" - "}
											{dayjs(d.startTime).format("HH:mm")}
											{" - "}
											{dayjs(d.endTime).format("HH:mm")}
										</p>
									))}
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Teljes esemény:</p>
									<p className={classes.Text400}>
										{dayjs(pickedPos.startDate).format("YYYY. MM. DD.")}
										{" - "}
										{dayjs(pickedPos.endDate).format("MM. DD.")}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>{"Létrehozta: "}</p>
									<p className={classes.Text400}>
										{selectedEvent.event.creator}
									</p>
								</div>
							</div>
						)}
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
