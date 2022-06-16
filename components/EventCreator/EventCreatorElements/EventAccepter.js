import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { MdOutlineDescription, MdTitle } from "react-icons/md";
import { IoCalendarOutline, IoCloseCircleOutline } from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";
import Spinner from "../../UI/Spinner/Spinner";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";
import { findColor } from "../../../shared/utility";

const EventAccepter = ({ department }) => {
	const { setShowEventModal, selectedEvent, setStatus } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	const [isLoading, setLoading] = useState(false);
	const [theEvent, setTheEvent] = useState();
	const [pickedDays, setPickedDays] = useState([]);
	const [isClicked, setIsClicked] = useState();
	const [clickedDate, setClickedDate] = useState();

	const [pickedPos, setPickedPos] = useState();

	const [theUser, setTheUser] = useState();

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
					setTheUser(fetchedUser);
					// setPickedDays(fetchedUser.dates);
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
		setLoading(true);
		const fetchEvent = async () => {
			try {
				const res = await fetch(`api/event/${selectedEvent._id}`);
				const fetchedEvent = await res.json();
				if (!res.ok || res.error) {
					throw Error(resJson.message);
				}
				setTheEvent(fetchedEvent);
				setPickedDays(fetchedEvent.dates);
			} catch (err) {
				setStatus({ message: err.message, error: true });
			}
		};
		fetchEvent();
		setLoading(false);
		// eslint-disable-next-line
	}, []);

	const respondHandler = async (e, answer) => {
		e.preventDefault();
		console.log("first", answer);
		// try {
		// 	console.log("application", theEvent, session);
		// 	const res = await fetch("/api/event/application", {
		// 		method: "PUT",
		// 		body: JSON.stringify({
		// 			eventId: theEvent._id,
		// 			userId: session.id,
		// 			answer,
		// 		}),
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 	});

		// 	const resJson = await res.json();
		// 	if (!res.ok || res.error) {
		// 		throw Error(resJson.message);
		// 	}

		setStatus({ message: "Sikeresen jelentkeztél a pozicíóra" });
		// setStatus(resJson);
		setShowEventModal(false);
		// 	return resJson;
		// } catch (err) {
		// 	setShowEventModal(false);
		// 	setStatus({ message: err.message, error: true });
		// }
	};

	useEffect(() => {
		if (clickedDate) {
			let updatedpickedDays = pickedDays;

			const pickedDay = theEvent.dates.find(
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

	if (isLoading || !theUser || !theEvent || status === "loading")
		return (
			<div className={classes.Loding_Spinner}>
				<Spinner />;
			</div>
		);

	return (
		<>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						<div className={classes.Icon}>
							<MdTitle />
						</div>
						{theUser.events.map((event) => (
							<React.Fragment key={event._id}>
								<div className={classes.EventModal_TwoInput}>
									<p>
										{event.title} {" - "}
										{event.shortTitle}
									</p>
									<p className={classes.Text400}>
										{"Létrehozta: "}
										{event.creatorName}
									</p>
								</div>
								<div className={classes.Icon}>
									<IoCalendarOutline />
								</div>
								<div className={classes.EventModal_TwoInputs}>
									<p className={classes.Text400}>
										{dayjs(event.startDate).format("YYYY. MM. DD.")}
										{" - "}
										{dayjs(event.endDate).format("MM. DD.")}
									</p>
								</div>
								<div className={classes.Icon}>
									<MdOutlineDescription />
								</div>
								<p>{event.description}</p>
								<div className={classes.Icon}>
									<IoCalendarOutline />
								</div>

								<div className={classes.acceptorDates}>
									{event.positions.map((pos) => {
										const style = {
											backgroundColor: findColor(pos.label)
												.slice(0, -4)
												.concat("90%)"),
										};

										return (
											<div
												key={pos.id}
												id={pos.id}
												className={[
													classes.acceptorDates_div,
													pickedPos &&
														pos.id.toString() === pickedPos.toString() &&
														classes.activePos,
												].join(" ")}
												onClick={(e) => setPickedPos(e.currentTarget.id)}
											>
												<div
													style={style}
													className={classes.acceptorDates_Pos}
												>
													Pozició:{" "}
													<p className={classes.Text400}>
														{pos.yourPosition} - {pos.invitionType[0].name}
													</p>
												</div>
												<div>
													{pos.date.map((d) => (
														<div key={d.startTime} className={classes.Text400}>
															{dayjs(d.startTime).format("YY. MMMM DD.")}
															{" - "}
															{dayjs(d.startTime).format("HH:mm")}
															{" - "}
															{dayjs(d.endTime).format("HH:mm")}
														</div>
													))}
												</div>
											</div>
										);
									})}
								</div>
							</React.Fragment>
						))}
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							filteredEvents={[
								{
									label: theEvent.label,
									startDate: +dayjs(theEvent.startDate),
									endDate: +dayjs(theEvent.endDate),
									dates: pickedDays,
									selectedEventDates: theEvent.dates,
								},
							]}
							setClickedDate={setClickedDate}
							setIsClicked={setIsClicked}
						/>
						<div className={classes.EventModal_Calendar__ControlBtns}>
							<Button
								type="button"
								clicked={() => setPickedDays(theEvent.dates)}
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
						clicked={(e) => {
							respondHandler(e, true);
						}}
						btnType="Success"
						disabled={!pickedPos}
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
