import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { StateContext } from "../../../context/state-context";
import {
	IoClose,
	IoBookmarkOutline,
	IoCheckmark,
	IoCalendarOutline,
	IoCalendarSharp,
} from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete, MdOutlineDescription, MdTitle } from "react-icons/md";

import Button from "../../UI/Button/Button";

import classes from "./EventModal.module.scss";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

const EventModal = () => {
	const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent } =
		useContext(StateContext);

	const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");

	const [description, setDescription] = useState(
		selectedEvent ? selectedEvent.description : ""
	);

	const [startDate, setStartDate] = useState(
		selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected)
	);

	const [endDate, setEndDate] = useState(
		selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected)
	);

	const [selectedLabel, setSelectedLabel] = useState(
		selectedEvent
			? labelsClasses.find((lbl) => lbl === selectedEvent.label)
			: labelsClasses[0]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		const calendarEvent = {
			title,
			description,
			label: selectedLabel,
			startDate: dayjs(startDate).valueOf(),
			endDate: dayjs(endDate).valueOf(),
			id: selectedEvent ? selectedEvent.id : Date.now(),
		};
		if (selectedEvent) {
			dispatchCalEvent({ type: "update", payload: calendarEvent });
		} else {
			dispatchCalEvent({ type: "push", payload: calendarEvent });
		}

		setShowEventModal(false);
	};

	const deletHandel = (e) => {
		dispatchCalEvent({
			type: "delete",
			payload: selectedEvent,
		});
		setShowEventModal(false);
	};

	return (
		<div className={classes.EventModal_Main}>
			<form>
				<header>
					<div className={classes.Icon}>
						<GiHamburgerMenu />
					</div>
					<div>
						{selectedEvent && (
							<Button type="button" clicked={deletHandel}>
								<div className={classes.Icon}>
									<MdDelete />
								</div>
							</Button>
						)}
						<Button clicked={() => setShowEventModal(false)}>
							<div className={classes.Icon}>
								<IoClose />
							</div>
						</Button>
					</div>
				</header>
				<div className={classes.EventModal_Body}>
					<div className={classes.Icon}>
						<MdTitle />
					</div>
					<input
						type="text"
						name="title"
						placeholder="Add title"
						value={title}
						required
						onChange={(e) => setTitle(e.target.value)}
					/>
					<div className={classes.Icon}>
						<IoCalendarOutline />
					</div>
					<input
						type="datetime-local"
						name="startDate"
						value={startDate}
						required
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<div className={classes.Icon}>
						<IoCalendarSharp />
					</div>
					<input
						type="datetime-local"
						name="endDate"
						value={endDate}
						min={startDate}
						required
						onChange={(e) => setEndDate(e.target.value)}
					/>
					<div className={classes.Icon}>
						<MdOutlineDescription />
					</div>
					<input
						type="text"
						name="description"
						placeholder="Add a description"
						value={description}
						required
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div className={classes.Icon}>
						<IoBookmarkOutline />
					</div>
					<div className={classes.labelsClass}>
						{labelsClasses.map((lblClass, i) => (
							<span
								key={i}
								onClick={() => setSelectedLabel(lblClass)}
								style={{ backgroundColor: lblClass }}
							>
								{selectedLabel === lblClass && <IoCheckmark />}
							</span>
						))}
					</div>
				</div>
				<footer className={classes.EventModal_Footer}>
					<Button type="submit" clicked={handleSubmit}>
						Mentés
					</Button>
				</footer>
			</form>
		</div>
	);
};

export default EventModal;
