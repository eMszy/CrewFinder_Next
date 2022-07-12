import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import { StateContext } from "../../context/state-context";
import EventCreatorMain from "./EventCreatorElements/EventCreatorMain";
import EventCreatorSecondary from "./EventCreatorElements/EventCreatorSecondary";
import EventAccepter from "./EventCreatorElements/EventAccepter";
import Spinner from "../UI/Spinner/Spinner";

import classes from "./EventHandle.module.scss";

const EventHandle = () => {
	const {
		setShowEventModal,
		selectedEvent,
		// deleteEvent,
		filteredEvents,
		isSocket,
		setStatus,
		dispatchCallEvent,
		setSelectedEvent,
	} = useContext(StateContext);

	const { data: session, status } = useSession();

	const [eventPositions, setEventPositions] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [department, setDepartment] = useState(
		selectedEvent
			? selectedEvent.event.department
			: session?.metaData?.isHOD[0] || "Privát"
	);
	const [isEventCreatorMain, setEventCreatorMain] = useState(
		selectedEvent && department !== "Privát" ? false : true
	);

	const deletHandel = (e) => {
		e.preventDefault();
		isSocket.emit(
			"delete-event",
			selectedEvent.event._id,
			selectedEvent.event.positions,
			session.id,
			(res) => {
				if (res.error) {
					setStatus(res);
					return;
				}
				console.log("res", res);
				dispatchCallEvent({
					type: "deleteEvent",
					payload: res.eventId,
				});
				setStatus({ message: res.message });
				setSelectedEvent(null);
				setShowEventModal(false);
				return;
			}
		);
	};

	const fetchEventPos = async () => {
		const fetchedEventPos = [];

		try {
			await isSocket.emit("get-event", selectedEvent.event._id, (res) => {
				if (res.error) {
					setStatus(res);
					return;
				}
				setEventPositions(res);
			});
		} catch (err) {
			setStatus(err);
		}
	};

	useEffect(() => {
		if (status === "authenticated" && selectedEvent) {
			setLoading(true);
			fetchEventPos();
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, isEventCreatorMain, selectedEvent, filteredEvents]);

	return (
		<div className={classes.EventModal_Main}>
			<div className={classes.EventModal_Main_Div}>
				<header className={classes.EventModal_Main_Header}>
					<div className={classes.IconDiv}>
						<div className={classes.Icon}>
							<GiHamburgerMenu />
						</div>
						{selectedEvent?.event.creator === session.id && (
							<>
								<div
									className={[
										classes.Icon2,
										classes.Buttom1,
										isEventCreatorMain && classes.Active,
									].join(" ")}
									onClick={() => setEventCreatorMain(true)}
								>
									Esemény
								</div>
								{selectedEvent && (
									<div
										className={[
											classes.Icon2,
											classes.Buttom1,
											!isEventCreatorMain && classes.Active,
										].join(" ")}
										onClick={() => setEventCreatorMain(false)}
									>
										Poziciók
									</div>
								)}
							</>
						)}
					</div>
					<div className={classes.IconDiv}>
						{selectedEvent && session.id === selectedEvent.event.creator && (
							<div
								className={`${classes.Icon}  ${classes.Buttom2}`}
								onClick={deletHandel}
							>
								<MdDelete />
							</div>
						)}
						<div
							className={`${classes.Icon}  ${classes.Buttom2}`}
							onClick={() => setShowEventModal(false)}
						>
							<IoClose />
						</div>
					</div>
				</header>
				{isLoading || status === "loading" ? (
					<div className={classes.Loding_Spinner}>
						<Spinner />
					</div>
				) : !selectedEvent || selectedEvent.event.creator === session.id ? (
					isEventCreatorMain ? (
						<EventCreatorMain
							setDepartment={setDepartment}
							department={department}
							setEventCreatroPage={setEventCreatorMain}
							isEventCreatorMain={isEventCreatorMain}
							eventPositions={eventPositions}
						/>
					) : (
						<EventCreatorSecondary
							department={department}
							setEventCreatroPage={setEventCreatorMain}
							isEventCreatorMain={isEventCreatorMain}
							eventPositions={eventPositions}
						/>
					)
				) : (
					<EventAccepter />
				)}
			</div>
		</div>
	);
};

export default EventHandle;
