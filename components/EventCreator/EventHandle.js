import React, { useContext, useState } from "react";
import { useSession } from "next-auth/react";

import { StateContext } from "../../context/state-context";
import EventCreatorMain from "./EventCreatorElements/EventCreatorMain";
import EventCreatorSecondary from "./EventCreatorElements/EventCreatorSecondary";
import EventAccepter from "./EventCreatorElements/EventDateAccepter";

import { GiHamburgerMenu } from "react-icons/gi";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

// import control from "../../control.json";

import classes from "./EventHandle.module.scss";

const EventHandle = () => {
	const { setShowEventModal, selectedEvent, dispatchCallEvent } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	const [isEventCreatorMain, setEventCreatorMain] = useState(true);
	const [department, setDepartment] = useState(
		session?.metaData?.isHOD[0] || "Privát"
	);

	const deletHandel = (e) => {
		e.preventDefault();
		dispatchCallEvent({
			type: "delete",
			payload: selectedEvent,
		});
		setShowEventModal(false);
	};

	return (
		<div className={classes.EventModal_Main}>
			<div className={classes.EventModal_Main_Div}>
				<header className={classes.EventModal_Main_Header}>
					<div className={classes.IconDiv}>
						<div className={classes.Icon}>
							<GiHamburgerMenu />
						</div>

						<div
							className={[
								classes.Icon,
								classes.Buttom1,
								isEventCreatorMain && classes.Active,
							].join(" ")}
							onClick={() => setEventCreatorMain(true)}
						>
							1
						</div>
						{selectedEvent && (
							<div
								className={[
									classes.Icon,
									classes.Buttom1,
									!isEventCreatorMain && classes.Active,
								].join(" ")}
								onClick={() => setEventCreatorMain(false)}
							>
								2
							</div>
						)}
					</div>
					<div className={classes.IconDiv}>
						{selectedEvent && session.id === selectedEvent.creator && (
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
				{!selectedEvent || selectedEvent?.creator === session?.id ? (
					isEventCreatorMain ? (
						<EventCreatorMain
							setIsCreatroPage={setEventCreatorMain}
							department={department}
							setDepartment={setDepartment}
							isEventCreatorMain={isEventCreatorMain}
						/>
					) : (
						<EventCreatorSecondary
							setIsCreatroPage={setEventCreatorMain}
							department={department}
							isEventCreatorMain={isEventCreatorMain}
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
