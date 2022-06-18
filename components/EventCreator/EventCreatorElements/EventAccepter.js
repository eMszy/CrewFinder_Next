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
	const { setShowEventModal, setStatus, daySelected } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	const [theUserEvents, setTheUserEvents] = useState();
	const [theEvent, setTheEvent] = useState();
	const [pickedPos, setPickedPos] = useState();
	const [pickedPosId, setPickedPosId] = useState();

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (session.id) {
			setLoading(true);
			const fetchUser = async () => {
				try {
					const res = await fetch(`api/user/${session.id}`);
					const fetchedUser = await res.json();
					if (!res.ok || res.error) {
						throw Error(fetchedUser.message);
					}
					const filteredEvents = [];
					fetchedUser.events.forEach((e) =>
						e.positions.forEach((p) =>
							p.date.forEach((d) => {
								if (d.id.toString() === dayjs(daySelected).format("YYYYMMDD")) {
									if (!filteredEvents.includes(e)) {
										filteredEvents.push(e);
									}
								}
							})
						)
					);

					// console.log("filteredEvents", filteredEvents);
					setTheUserEvents(filteredEvents);
				} catch (err) {
					setStatus({ message: err.message, error: true });
				}
			};
			fetchUser();
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	useEffect(() => {
		if ((theEvent, pickedPosId)) {
			const thePosition = theEvent.positions.find(
				(p) => p.id.toString() === pickedPosId.toString()
			);
			setPickedPos(thePosition);
		}
	}, [pickedPosId, theEvent]);

	const respondHandler = async (e, answer) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/event/application", {
				method: "PUT",
				body: JSON.stringify({
					eventId: theEvent._id,
					positionId: pickedPosId,
					userId: session.id,
					answer,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			setStatus(resJson);
			setShowEventModal(false);
			return resJson;
		} catch (err) {
			// setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	if (isLoading || !theUserEvents || status === "loading")
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
						{theUserEvents.map((event) => (
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
								<div className={classes.acceptorDates}>
									{event.positions
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
							</div>
						))}
					</div>
					<div className={classes.Sidebar}>
						<div className={classes.EventModal_Calendar}>
							<SmallCalendar
								filteredEvents={[
									{
										label: pickedPos?.label || 6,
										startDate: +dayjs(theEvent?.startDate),
										endDate: +dayjs(theEvent?.endDate),
										dates: pickedPos?.date,
										selectedEventDates: [{ startTime: +dayjs(daySelected) }],
									},
								]}
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
							respondHandler(e, true);
						}}
						btnType="Success"
						disabled={!pickedPosId}
					>
						Igen, válalom
					</Button>
					<Button
						type="submit"
						clicked={(e) => {
							respondHandler(e, false);
						}}
						btnType="Danger"
					>
						Nem jó
					</Button>
				</footer>
			</form>
		</>
	);
};

export default EventAccepter;
