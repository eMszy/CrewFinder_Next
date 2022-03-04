import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { StateContext } from "../../context/state-context";
import EventModal from "./EventCreatorElements/EventModal";
import EventTeamManager from "./EventCreatorElements/EventTeamManager";

import control from "../../control.json";

import classes from "./EventModal.module.scss";

const EventCreaterModal = () => {
	const { setShowEventModal, selectedEvent, dispatchCallEvent } =
		useContext(StateContext);

	const [isCreatroPage, setIsCreatroPage] = useState(true);
	const [department, setDepartment] = useState(
		Object.keys(control.departments)[0]
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
						{!isCreatroPage && (
							<div
								className={`${classes.Icon}  ${classes.Buttom1}`}
								onClick={() => setIsCreatroPage(true)}
							>
								<IoArrowBack />
							</div>
						)}
					</div>
					<div className={classes.IconDiv}>
						{selectedEvent && (
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
				{isCreatroPage ? (
					<EventModal
						setIsCreatroPage={setIsCreatroPage}
						department={department}
						setDepartment={setDepartment}
					/>
				) : (
					<EventTeamManager
						setIsCreatroPage={setIsCreatroPage}
						department={department}
						setDepartment={setDepartment}
					/>
				)}
			</div>
		</div>
	);
};

export default EventCreaterModal;
