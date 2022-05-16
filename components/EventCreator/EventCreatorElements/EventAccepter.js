import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { MdOutlineDescription, MdTitle } from "react-icons/md";
import {
	IoCalendarOutline,
	IoCloseCircleOutline,
	IoBookmarkOutline,
	IoLocationOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "../../Calendar/CalendarElements/SmallCalendar";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./../EventModal.module.scss";

const EventAccepter = ({ department }) => {
	const { setShowEventModal, selectedEvent, setStatus } =
		useContext(StateContext);

	const [pickedDays, setPickedDays] = useState(selectedEvent.dates);
	const [isClicked, setIsClicked] = useState();
	const [clickedDate, setClickedDate] = useState();

	const { data: session, status } = useSession();

	const respondHandler = async (e, answer) => {
		e.preventDefault();
		try {
			console.log("first", selectedEvent, session);
			const res = await fetch("/api/event/application", {
				method: "PUT",
				body: JSON.stringify({
					eventId: selectedEvent._id,
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

	return (
		<div>
			<form>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						<div className={classes.Icon}>
							<MdTitle />
						</div>
						<div className={classes.EventModal_TwoInput}>
							<p>
								{selectedEvent.title} {" - "}
								{selectedEvent.shortTitle}
							</p>
							<p className={classes.Text400}>
								{"Létrehozta: "}
								{selectedEvent.creatorName}
							</p>
						</div>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<p className={classes.Text400}>
								{dayjs(selectedEvent.startDate).format("YYYY. MM. DD.")}
								{" - "}
								{dayjs(selectedEvent.endDate).format("MM. DD.")}
							</p>
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<p>{selectedEvent.description}</p>

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
																<div>{selectedEvent.creatorName}</div>
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
		</div>
	);
};

export default EventAccepter;
