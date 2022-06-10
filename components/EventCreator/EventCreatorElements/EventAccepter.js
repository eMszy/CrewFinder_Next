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

const EventAccepter = ({ department }) => {
	const { setShowEventModal, selectedEvent, setStatus } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	const [isLoading, setLoading] = useState(false);
	const [theEvent, settheEvent] = useState();
	const [pickedDays, setPickedDays] = useState([]);
	const [isClicked, setIsClicked] = useState();
	const [clickedDate, setClickedDate] = useState();

	useEffect(() => {
		setLoading(true);
		const fetchEvent = async () => {
			try {
				const res = await fetch(`api/event/${selectedEvent._id}`);
				const fetchedEvent = await res.json();
				if (!res.ok || res.error) {
					throw Error(resJson.message);
				}
				settheEvent(fetchedEvent);
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
		try {
			console.log("application", theEvent, session);
			const res = await fetch("/api/event/application", {
				method: "PUT",
				body: JSON.stringify({
					eventId: theEvent._id,
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
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
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

	if (isLoading || !theEvent || status === "loading")
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
						<div className={classes.EventModal_TwoInput}>
							<p>
								{theEvent.title} {" - "}
								{theEvent.shortTitle}
							</p>
							<p className={classes.Text400}>
								{"Létrehozta: "}
								{theEvent.creatorName}
							</p>
						</div>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<p className={classes.Text400}>
								{dayjs(theEvent.startDate).format("YYYY. MM. DD.")}
								{" - "}
								{dayjs(theEvent.endDate).format("MM. DD.")}
							</p>
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<p>{theEvent.description}</p>

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
												<p className={classes.Text400}>
													{dayjs(p.startTime).format("HH:mm")}
												</p>
												<p className={classes.Text400}>
													{dayjs(p.endTime).format("HH:mm")}
												</p>
												<p className={classes.Text400}>{p.location}</p>
											</div>
											<div>
												{p?.crew
													.sort((a, b) => a.id - b.id)
													.map((c, idx) => (
														<div key={idx} className={classes.CrewPosName}>
															<p className={classes.Text400}>{c.pos}</p>
															{c.id > 0 ? (
																<p className={classes.Span2}>{c.name}</p>
															) : (
																<div>{theEvent.creatorName}</div>
															)}
															{c?._id?.toString() === session.id && (
																<div
																	className={classes.Icon}
																	// onClick={() => deletPosHandel(c.id, p.id)}
																	onClick={() => console.log(c._id, p.id)}
																>
																	<IoCloseCircleOutline />
																</div>
															)}
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
