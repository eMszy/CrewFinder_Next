import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";

import { StateContext } from "../../../context/state-context";
import NewPosPanel from "./EventCreatorComponents/NewPosPanel";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import EventICreatorTeamManager from "./EventICreatorTeamManager";
import { fetchNumberofUsers, getBackgorund } from "./utility";

const EventCreatorSecondary = ({
	department,
	setEventCreatroPage,
	isEventCreatorMain,
	eventPositions,
}) => {
	const {
		setShowEventModal,
		selectedEvent,
		dispatchCallEvent,
		acceptCandidate,
		setStatus,
	} = useContext(StateContext);

	const [isTeamManagerValid, setTeamManagerValid] = useState(true);

	const [clickedDate, setClickedDate] = useState(undefined);
	const [isClicked, setIsClicked] = useState(false);
	const [pickedPos, setPickedPos] = useState();
	const [pickedPosId, setPickedPosId] = useState();
	const [selectedEventPositions, setSelectedEventPositions] = useState([]);
	const [theUpdatedPos, setUpdatedPos] = useState([]);
	const [isNewPos, setIsNewPos] = useState(false);
	const [datesHelper, setDatesHelper] = useState([]);
	const [labelHandel, setLabelHandel] = useState(1);

	const submitHandle = (e) => {
		e.preventDefault();
		acceptCandidate(theUpdatedPos, selectedEvent.event._id);
		setShowEventModal(false);
	};

	const changeHandle = (userId = undefined, newDates) => {
		if (pickedPos.label === 1) {
			return;
		}

		const filteredOnes = theUpdatedPos.filter(
			(one) => one.posId !== pickedPos._id
		);

		if (userId) {
			setUpdatedPos([
				...filteredOnes,
				{ userId: userId, posId: pickedPos._id },
			]);
		} else {
			setUpdatedPos([
				...filteredOnes,
				{ posId: pickedPos._id, dates: newDates, userId: undefined },
			]);
		}

		let newLabel = 5;
		if (userId) {
			newLabel = 2;
		}
		setPickedPos((currentData) => {
			return { ...currentData, label: newLabel, dates: newDates };
		});
	};

	useEffect(() => {
		if (clickedDate) {
			let updatedPosDays = datesHelper;

			const isEventIncludes = selectedEvent.event.dates.find(
				(d) => d.id === +dayjs(clickedDate).format("YYYYMMDD")
			);

			if (isEventIncludes) {
				const isPosIncludes = datesHelper.find(
					(d) => d.id === isEventIncludes.id
				);

				if (isPosIncludes) {
					updatedPosDays = datesHelper.filter(
						(d) => d.id !== isEventIncludes.id
					);
				} else {
					updatedPosDays.push(isEventIncludes);
				}

				if (pickedPos) {
					changeHandle(undefined, updatedPosDays);
				}
				setDatesHelper(updatedPosDays);
			} else {
				setStatus({ message: "Nem az esemény napja", info: true });
			}
			setClickedDate(undefined);
		}
		// eslint-disable-next-line
	}, [isClicked, clickedDate]);

	useEffect(() => {
		if (pickedPosId) {
			const thePosition = selectedEventPositions.find(
				(p) => p.id.toString() === pickedPosId.toString()
			);
			setPickedPos(thePosition);
			setDatesHelper(thePosition.dates);
			setLabelHandel(thePosition?.label);
			setIsNewPos(false);
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
				id: pos.posName + Math.floor(Math.random() * (9999 - 1000) + 1),
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
									// pickedPos && classes.Zero_Height,
								].join(" ")}
								style={getBackgorund(pickedPos.label)}
							>
								<div className={classes.acceptorDates_SubDiv}>
									<div className={classes.acceptorDates}>
										<div className={classes.acceptorDates_addPos}>
											<div className={classes.acceptorDates_Pos}>
												<>
													<p>{pickedPos.posName}</p>

													<p className={classes.Text400}>
														Visszaigazolt: {labelHandel < 3 ? "Igen" : "Nem"}
													</p>
													{labelHandel > 2 && (
														<>
															<p className={classes.Text400}>
																Jelentkeztek: {pickedPos.applied.length}
															</p>
															<p className={classes.Text400}>
																Nem jelzett: {pickedPos.invited.length}
															</p>
														</>
													)}
													<p className={classes.Text400}>
														Napok: {datesHelper.length}
													</p>
												</>
											</div>
										</div>
										<div
											className={[
												classes.Span2,
												classes.acceptorDates_Candidates,
											].join(" ")}
										>
											{console.log("pickedPos", pickedPos.applied)}
											{labelHandel === 3
												? pickedPos.applied.map((pos) => (
														<div
															key={pos.id}
															className={[
																classes.acceptorDates_Candidates_Grid,
																// theChosenOnes.posId === pickedPos._id &&
																// 	theChosenOnes.userId === pos._id &&
																// 	classes.acceptorDates_Candidates_Chosen,
															].join(" ")}
															onClick={() => changeHandle(pos._id)}
														>
															<div
																className={classes.acceptorDates_Candidates_Img}
															>
																<Image
																	src={pos.image}
																	width={35}
																	height={35}
																	alt={pos.name}
																/>
															</div>
															<p>{pos.name}</p>
															<p className={classes.Text400}>XP: X</p>
															<p className={classes.Text400}>Értékelés: X</p>
														</div>
												  ))
												: pickedPos.confirmed.map((pos) => (
														<div
															key={pos.id}
															className={[
																classes.acceptorDates_Candidates_Grid,
																// theChosenOnes.posId === pickedPos._id &&
																// 	theChosenOnes.userId === pos._id &&
																// 	classes.acceptorDates_Candidates_Chosen,
															].join(" ")}
															// onClick={() => changeHandle(pos._id)}
														>
															<div
																className={classes.acceptorDates_Candidates_Img}
															>
																<Image
																	src={pos.image}
																	width={35}
																	height={35}
																	alt={pos.name}
																/>
															</div>
															<p>{pos.name}</p>
															<p className={classes.Text400}>XP: X</p>
															<p className={classes.Text400}>Értékelés: X</p>
														</div>
												  ))}
										</div>
									</div>
								</div>
							</div>
						)}
						{isNewPos && (
							<NewPosPanel
								setIsNewPos={setIsNewPos}
								setSelectedEventPositions={setSelectedEventPositions}
								datesHelper={datesHelper}
								setLabelHandel={setLabelHandel}
								labelHandel={labelHandel}
								department={department}
								setUpdatedPos={setUpdatedPos}
							/>
						)}
						<div className={classes.acceptorDates_MainDiv}>
							<p>Még be nem telt poziciók</p>
							<div className={classes.acceptorDates_SubDiv}>
								<div className={classes.acceptorDates}>
									<div
										className={classes.acceptorDates_addPos}
										onClick={() => {
											setIsNewPos(true);
											setPickedPos();
											setPickedPosId();
											setDatesHelper([]);
										}}
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
											const style = getBackgorund(pos.label);
											const val = control.invitionType.find(
												(v) => v.type === pos.invition.type
											);

											return (
												<div
													key={pos.id}
													id={pos.id}
													className={[
														classes.acceptorDates_div,
														pickedPosId &&
															pos.id.toString() === pickedPosId.toString() &&
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
										.filter((pos) => pos.label === 2)
										.map((pos) => {
											const style = getBackgorund(pos.label);
											const val = control.invitionType.find(
												(v) => v.type === pos.invition.type
											);

											return (
												<div
													key={pos.id}
													id={pos.id}
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
														{pos.label !== 1 && (
															<p className={classes.Text400}>
																Visszaigazolt: Igen
															</p>
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
					<div className={classes.Sidebar}>
						<div className={classes.EventModal_Calendar}>
							<SmallCalendar
								filteredEvents={[
									{
										label: pickedPos ? pickedPos.label : labelHandel,
										dates: datesHelper,
										selectedEventDates: selectedEvent.event.dates,
									},
								]}
								setClickedDate={setClickedDate}
								setIsClicked={setIsClicked}
							/>
							{/* <div className={classes.EventModal_Calendar__ControlBtns}>
								<Button
									type="button"
									clicked={() => setPickedDays(selectedEvent.dates)}
								>
									Mind
								</Button>
								<Button type="button" clicked={() => setPickedDays([])}>
									Töröl
								</Button>
							</div> */}
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
