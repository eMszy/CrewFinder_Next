import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { StateContext } from "../../../context/state-context";
import {
	IoClose,
	IoBookmarkOutline,
	IoCheckmark,
	IoCalendarOutline,
} from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete, MdOutlineDescription, MdTitle } from "react-icons/md";

import Button from "../../UI/Button/Button";

import classes from "./EventModal.module.scss";
import SmallCalendar from "./SmallCalendar";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];
const weekDays = ["h", "k", "sze", "cs", "p", "szo", "v"];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

const EventModal = () => {
	const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent } =
		useContext(StateContext);

	const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
	const [shortTitle, setShortTitle] = useState(
		selectedEvent ? selectedEvent.shortTitle : ""
	);

	const [description, setDescription] = useState(
		selectedEvent ? selectedEvent.description : ""
	);

	const [startDate, setStartDate] = useState(
		selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.add(6, "hour"))
	);

	const [endDate, setEndDate] = useState(
		selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.add(18, "hour"))
	);

	const [selectedLabel, setSelectedLabel] = useState(
		selectedEvent
			? labelsClasses.find((lbl) => lbl === selectedEvent.label)
			: labelsClasses[0]
	);

	const [selectedWeekDays, setSelectedWeekDays] = useState(
		selectedEvent ? selectedEvent.weekDays : weekDays
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		const calendarEvent = {
			title,
			shortTitle,
			description,
			label: selectedLabel,
			startDate: dayjs(startDate).valueOf(),
			endDate: dayjs(endDate).valueOf(),
			weekDays: selectedWeekDays,
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
		e.preventDefault();
		dispatchCalEvent({
			type: "delete",
			payload: selectedEvent,
		});
		setShowEventModal(false);
	};

	return (
		<div className={classes.EventModal_Main}>
			<form>
				<header className={classes.EventModal_Main_Header}>
					<div className={classes.Icon}>
						<GiHamburgerMenu />
					</div>
					<div className={classes.ButtomDiv}>
						{selectedEvent && (
							<div type="button" className={classes.Icon} onClick={deletHandel}>
								<MdDelete />
							</div>
						)}
						<div
							type="button"
							className={classes.Icon}
							onClick={() => setShowEventModal(false)}
						>
							<IoClose />
						</div>
					</div>
				</header>
				<div className={classes.EventModal_MainBody}>
					<div className={classes.EventModal_Input}>
						<div className={classes.Icon}>
							<MdTitle />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<input
								type="text"
								name="title"
								placeholder="Projek neve"
								value={title}
								required
								onChange={(e) => setTitle(e.target.value)}
							/>
							<input
								type="text"
								name="shortTitle"
								placeholder="Rövidítés"
								value={shortTitle}
								required
								onChange={(e) => setShortTitle(e.target.value)}
							/>
						</div>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<input
								type="datetime-local"
								name="startDate"
								value={startDate}
								required
								onChange={(e) => setStartDate(e.target.value)}
							/>
							<input
								type="datetime-local"
								name="endDate"
								value={endDate}
								min={startDate}
								required
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<input
							type="text"
							name="Leírás"
							placeholder="Leírás"
							value={description}
							required
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div></div>
						<div className={classes.weekDayClass}>
							{weekDays.map((day, i) => {
								let style = {};
								selectedWeekDays.includes(day) ||
									(style = { backgroundColor: "#ff000080" });

								return (
									<span
										key={i}
										onClick={() => {
											let updatedDaySelection = [...selectedWeekDays];
											selectedWeekDays.includes(day)
												? (updatedDaySelection = selectedWeekDays.filter(
														(d) => day !== d
												  ))
												: updatedDaySelection.push(day);
											setSelectedWeekDays(updatedDaySelection);
										}}
										style={style}
									>
										{day}
									</span>
								);
							})}
						</div>
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
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<input
							type="text"
							name="Leírás"
							placeholder="Saját pozíció"
							value={description}
							required
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div></div>
						<div>Alapcsapat</div>
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							daySelected={dayjs()}
							filteredEvents={[
								{
									label: selectedLabel,
									startDate: dayjs(startDate).valueOf(),
									endDate: dayjs(endDate).valueOf(),
									weekDays: selectedWeekDays,
								},
							]}
						/>
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
