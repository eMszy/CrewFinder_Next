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
		dispatchCallEvent,
		setShowEventModal,
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
					const eventPos = event.positions.filter(
						(pos) =>
							pos.date.filter(
								(d) => d.id.toString() === dayjs(daySelected).format("YYYYMMDD")
							).length !== 0
					);
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
				(p) => p.id.toString() === pickedPosId.toString()
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
				if (pickedPos.invitionType[0].name === "open") {
					return 3;
				}
				if (pickedPos.invitionType[0].name === "direct") {
					return 2;
				}
			} else {
				return 7;
			}
		};

		// let otherUsers = [];

		let newEventLabel;
		theEvent.positions.forEach((pos) => {
			if (pos.id.toString() === pickedPosId) {
				pos.label = getLabel();
				pos.status = answer ? "applied" : "resigned";
				if (!newEventLabel || pos.label < newEventLabel) {
					newEventLabel = pos.label;
				}
				// if (pos.invitionType[0].result) {
				// 	otherUsers = pos.invitionType[0].result.filter(
				// 		(u) => u._id.toString() !== session.id
				// 	);
				// }
			} else if (!newEventLabel || pos.label < newEventLabel) {
				newEventLabel = pos.label;
			}
		});
		theEvent.label = newEventLabel;

		// console.log('otherUsers', otherUsers)

		theUserEvents.map((evt) => (evt._id === theEvent._id ? theEvent : evt));

		const payload = {
			theUserEvents: theUserEvents,
			theEvent: theEvent,
			positionId: pickedPosId,
			userSession: session,
			answer,
			getLabel: getLabel(),
		};
		dispatchCallEvent({ type: "application", payload });
	};

	const isDisabled = (eventId, test) => {
		let disable = true;
		if (theEvent && theEvent._id == eventId) {
			if (
				test &&
				pickedPos &&
				(pickedPos.label === 4 ||
					pickedPos.label === 5 ||
					pickedPos.label === 7)
			) {
				disable = false;
			} else if (
				!test &&
				pickedPos &&
				(pickedPos.label === 2 || pickedPos.label === 3)
			) {
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
							<div key={event._id} className={classes.acceptorDates_MainDiv}>
								<div>
									{" "}
									<p>
										{event.title} {" - "} {event.shortTitle}
									</p>
									<p className={classes.Text400}>
										{"Létrehozta: "}
										{event.creatorName}
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
													(v) => v.type === pos.invitionType[0].name
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
															setTheEvent(event);
														}}
													>
														<div
															style={style}
															className={classes.acceptorDates_Pos}
														>
															<p>{pos.yourPosition}</p>
															<p className={classes.Text400}>{val.name}</p>
															<p className={classes.Text400}>
																Napok: {pos.date.length}
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
											disabled={isDisabled(event._id, true)}
										>
											{event?._id === theEvent?._id &&
											pickedPos?.label !== 5 &&
											pickedPos?.label !== 7
												? "Vállalom"
												: "Jelentkezem"}
										</Button>
										<Button
											type="submit"
											clicked={(e) => {
												respondHandler(e, false);
											}}
											btnType="Danger"
											disabled={isDisabled(event._id, false)}
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
										startDate: +dayjs(theEvent?.startDate),
										endDate: +dayjs(theEvent?.endDate),
										dates: pickedPos?.date,
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
									{" "}
									<p>
										{theEvent.title} {" - "} {theEvent.shortTitle}
									</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Leírás</p>
									<p className={classes.Text400}>{theEvent.description}</p>
								</div>
								<div className={classes.EventModal_Sidebar_div}>
									<p>Dátumok:</p>
									{pickedPos?.date?.map((d) => (
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
									<p className={classes.Text400}>{theEvent.creatorName}</p>
								</div>
							</div>
						)}
					</div>
				</div>
				<footer className={classes.EventModal_Footer}>
					<Button
						type="submit"
						clicked={(e) => {
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
