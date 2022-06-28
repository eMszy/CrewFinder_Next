import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import { findColor } from "../../../shared/utility";

const EventAccepter = () => {
	const {
		setStatus,
		daySelected,
		setDaySelected,
		setShowEventModal,
		applicationEvent,
	} = useContext(StateContext);

	const { data: session, status } = useSession();

	const [theUserEvents, setUserEvents] = useState();
	const [filteredUserEvents, setFilteredUserEvents] = useState();
	const [theEvent, setTheEvent] = useState();
	const [pickedPos, setPickedPos] = useState();
	const [pickedPosId, setPickedPosId] = useState();

	const [isLoading, setLoading] = useState(false);
	const [isEvent, setIsEvent] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	useEffect(() => {
		if (session.id) {
			setLoading(true);
			const fetchUser = async () => {
				const fetchedUser = [];

				try {
					const res = await fetch(`api/user/${session.id}`);
					fetchedUser = await res.json();
					if (!res.ok || res.error) {
						throw Error(fetchedUser.message);
					}
				} catch (err) {
					setStatus({ message: err.message, error: true });
				}

				setUserEvents(fetchedUser.events);
			};
			fetchUser();
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	useEffect(() => {
		if (theUserEvents) {
			if (!isEvent) {
				const filteredEvents = [];
				theUserEvents.forEach((event) => {
					const eventPos = event.positions.filter((pos) => {
						return (
							pos.position.dates.filter(
								(d) => d.id.toString() === dayjs(daySelected).format("YYYYMMDD")
							).length !== 0
						);
					});
					if (eventPos.length !== 0) {
						filteredEvents.push({ ...event, positions: eventPos });
					}
				});
				setFilteredUserEvents(filteredEvents.sort((a, b) => a.label - b.label));
			} else {
				const thefullEvent = theUserEvents.filter(
					(ev) => ev._id === theEvent._id
				);
				setFilteredUserEvents(thefullEvent);
			}
		}
	}, [daySelected, isEvent, theEvent, theUserEvents]);

	useEffect(() => {
		if ((theEvent, pickedPosId)) {
			const thePosition = theEvent.positions.find(
				(p) => p.position._id.toString() === pickedPosId.toString()
			);
			setPickedPos(thePosition);
		}
	}, [pickedPosId, theEvent]);

	useEffect(() => {
		if (isEvent) {
			setIsEvent(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isClicked]);

	const respondHandler = async (e, answer) => {
		e.preventDefault();

		const getLabel = () => {
			if (answer) {
				if (pickedPos.position.invition.type === "open") {
					return 3;
				}
				if (pickedPos.position.invition.type === "direct") {
					return 2;
				}
			} else {
				return 6;
			}
		};

		let newEventLabel;
		theEvent.positions.forEach((pos) => {
			if (pos.position._id.toString() === pickedPosId) {
				pos.label = getLabel();
				pos.status = answer ? "applied" : "resigned";
				if (!newEventLabel || pos.label < newEventLabel) {
					newEventLabel = pos.label;
				}
			} else if (!newEventLabel || pos.label < newEventLabel) {
				newEventLabel = pos.label;
			}
		});
		theEvent.label = newEventLabel;

		theUserEvents.map((evt) => (evt._id === theEvent._id ? theEvent : evt));

		const payload = {
			eventId: theEvent.event._id,
			positionId: pickedPosId,
			answer,
			newLabel: getLabel(),
		};
		applicationEvent(payload);
	};

	const isDisabled = (eventId, answer) => {
		let disable = true;
		if (theEvent && theEvent.event._id == eventId) {
			if (answer && pickedPos && pickedPos.label > 3) {
				disable = false;
			} else if (!answer && pickedPos && pickedPos.label < 4) {
				disable = false;
			}
		}
		return disable;
	};

	if (isLoading || !filteredUserEvents || status === "loading")
		return (
			<div className={classes.Loding_Spinner}>
				<Spinner />;
			</div>
		);

	return (
		<>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.acceptorDates_MainLayout}>
						{filteredUserEvents.map((event) => (
							<div
								key={event.event._id}
								className={classes.acceptorDates_MainDiv}
							>
								<div>
									{" "}
									<p>
										{event.event.title} {" - "} {event.event.shortTitle}
									</p>
									<p className={classes.Text400}>
										{"Létrehozta: "}
										{event.event.creator}
									</p>
								</div>
								<div className={classes.acceptorDates_SubDiv}>
									<div className={classes.acceptorDates}>
										{event?.positions
											.sort((a, b) => a.label - b.label)
											.map((pos) => {
												const style = {
													backgroundColor: findColor(pos.label)
														.slice(0, -4)
														.concat("90%)"),
												};
												const val = control.invitionType.find(
													(v) => v.type === pos.position.invition.type
												);
												return (
													<div
														key={pos.position._id}
														id={pos.position._id}
														className={[
															classes.acceptorDates_div,
															pickedPosId &&
																pos.position._id.toString() ===
																	pickedPosId.toString() &&
																classes.activePos,
														].join(" ")}
														onClick={(e) => {
															setPickedPosId(e.currentTarget.id);
															setTheEvent(event);
														}}
													>
														<div
															style={style}
															className={classes.acceptorDates_Pos}
														>
															<p>{pos.position.posName}</p>
															<p className={classes.Text400}>{val.name}</p>
															<p className={classes.Text400}>
																Napok: {pos.position.dates.length}
															</p>
														</div>
													</div>
												);
											})}
									</div>
									<div className={classes.acceptorDates_Buttons}>
										<Button
											clicked={(e) => {
												e.preventDefault();
												setTheEvent(event);
												setIsEvent((currentValue) => !currentValue);
											}}
											btnType="Info"
										>
											{isEvent ? "A dátumhoz" : "Eseményhez"}
										</Button>
										<Button
											type="submit"
											clicked={(e) => {
												respondHandler(e, true);
											}}
											btnType="Success"
											disabled={isDisabled(event.event._id, true)}
										>
											{event?.event._id === theEvent?._id &&
											pickedPos?.label < 5
												? "Vállalom"
												: "Jelentkezem"}
										</Button>
										<Button
											type="submit"
											clicked={(e) => {
												respondHandler(e, false);
											}}
											btnType="Danger"
											disabled={isDisabled(event.event._id, false)}
										>
											Lemondom
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className={classes.Sidebar}>
						<div className={classes.EventModal_Calendar}>
							<SmallCalendar
								filteredEvents={[
									{
										label: pickedPos?.label || 0,
										dates: pickedPos?.position.dates,
										selectedEventDates: [{ startTime: +dayjs(daySelected) }],
									},
								]}
								setClickedDate={setDaySelected}
								setIsClicked={setIsClicked}
							/>
						</div>
						{pickedPos && (
							<div className={classes.EventModal_Sidebar}>
								<div>
									<p>
										{theEvent.event.title} {" - "} {theEvent.event.shortTitle}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Leírás</p>
									<p className={classes.Text400}>
										{theEvent.event.description}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Dátumok:</p>
									{pickedPos?.position.dates?.map((d) => (
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
									<p className={classes.Text400}>{theEvent.event.creator}</p>
								</div>
							</div>
						)}
					</div>
				</div>
				<footer className={classes.EventModal_Footer}>
					<Button
						type="submit"
						clicked={() => {
							setShowEventModal(false);
						}}
					>
						OK
					</Button>
				</footer>
			</form>
		</>
	);
};

export default EventAccepter;
