import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete, MdOutlineDescription, MdTitle } from "react-icons/md";
import {
	IoClose,
	IoBookmarkOutline,
	IoCheckmark,
	IoCalendarOutline,
} from "react-icons/io5";

import { StateContext } from "../../../context/state-context";
import SmallCalendar from "./SmallCalendar";
import { findColor } from "../../../shared/utility";
import Button from "../../UI/Button/Button";

import control from "../../../control.json";

import classes from "./EventModal.module.scss";

const weekDays = [1, 2, 3, 4, 5, 6, 0];

const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

const EventModal = () => {
	const {
		setShowEventModal,
		daySelected,
		dispatchCalEvent,
		selectedEvent,
		labels,
	} = useContext(StateContext);

	const [inputData, setInputData] = useState({
		title: selectedEvent ? selectedEvent.title : "",
		shortTitle: selectedEvent ? selectedEvent.shortTitle : "",
		description: selectedEvent ? selectedEvent.description : "",
		label: selectedEvent ? selectedEvent.label : labels[0].id,
		dates: selectedEvent ? selectedEvent.dates : [],
		yourPosition: selectedEvent ? selectedEvent.yourPosition : "",
		baseCrew: selectedEvent ? selectedEvent.baseCrew : {},
		startDate: selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.hour(6)),
		endDate: selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.hour(18)),
		weekDays: selectedEvent ? selectedEvent.weekDays : weekDays,
	});

	const [clickedDate, setClickedDate] = useState([]);

	const [department, setDepartment] = useState(
		Object.keys(control.departments)[0]
	);

	useEffect(() => {
		setInputData({
			...inputData,
			yourPosition: Object.keys(control.departments[department])[0],
		});
	}, [department]);

	console.log("first", department, inputData.yourPosition);

	const getDates = () => {
		const daysBetween = dayjs(inputData.endDate).diff(
			dayjs(inputData.startDate),
			"d"
		);
		const sTime = dayjs(inputData.startDate).format("THHmm");
		const eTime = dayjs(inputData.endDate).format("THHmm");
		let dates = [];

		for (let i = 0; i <= daysBetween; i++) {
			const startTime = dayjs(inputData.startDate)
				.add(i, "d")
				.format(`YYYYMMDD${sTime}`);

			if (inputData.weekDays.includes(+dayjs(startTime).format("d"))) {
				let j = i;
				if (sTime > eTime) {
					j++;
				}

				const endTime = dayjs(inputData.startDate)
					.add(j, "d")
					.format(`YYYYMMDD${eTime}`);

				dates.push({
					id: i,
					startTime: +dayjs(startTime),
					endTime: +dayjs(endTime),
					crew: {},
				});
			}
		}
		return dates;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const calendarEvent = {
			...inputData,
			startDate: +dayjs(inputData.startDate),
			endDate: +dayjs(inputData.endDate),
			dates: getDates(),
			id: selectedEvent
				? selectedEvent.id
				: +dayjs(inputData.startDate) + Math.random(),
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
								value={inputData.title}
								required
								onChange={(e) =>
									setInputData({ ...inputData, title: e.target.value })
								}
							/>
							<input
								type="text"
								name="shortTitle"
								placeholder="Rövidítés"
								value={inputData.shortTitle}
								required
								onChange={(e) =>
									setInputData({ ...inputData, shortTitle: e.target.value })
								}
							/>
						</div>
						<div className={classes.Icon}>
							<IoCalendarOutline />
						</div>
						<div className={classes.EventModal_TwoInputs}>
							<input
								type="datetime-local"
								name="startDate"
								value={inputData.startDate}
								required
								onChange={(e) =>
									setInputData({
										...inputData,
										startDate: e.target.value,
									})
								}
							/>
							<input
								type="datetime-local"
								name="endDate"
								value={inputData.endDate}
								min={inputData.startDate}
								required
								onChange={(e) =>
									setInputData({
										...inputData,
										endDate: e.target.value,
									})
								}
							/>
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<input
							type="text"
							name="Leírás"
							placeholder="Leírás"
							value={inputData.description}
							required
							onChange={(e) =>
								setInputData({ ...inputData, description: e.target.value })
							}
						/>
						<div></div>
						<div className={classes.weekDayClass}>
							{weekDays.map((dayNum, i) => {
								const day = dayjs().day(dayNum).format("dd");
								let style = {};
								inputData.weekDays.includes(dayNum) ||
									(style = { backgroundColor: "#ff000080" });
								return (
									<span
										key={i}
										onClick={() => {
											let updatedDaySelection = [...inputData.weekDays];
											inputData.weekDays.includes(dayNum)
												? (updatedDaySelection = inputData.weekDays.filter(
														(d) => dayNum !== d
												  ))
												: updatedDaySelection.push(dayNum);
											setInputData({
												...inputData,
												weekDays: updatedDaySelection,
											});
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
							{labels.map((lblClass, i) => (
								<span
									key={i}
									onClick={() =>
										setInputData({ ...inputData, label: lblClass.id })
									}
									style={{ backgroundColor: findColor(lblClass.id) }}
								>
									{inputData.label === lblClass.id && <IoCheckmark />}
								</span>
							))}
						</div>
						<div className={classes.Icon}>
							<MdOutlineDescription />
						</div>
						<div className={classes.YourPosition}>
							<p>Saját pozicíód: </p>
							<select
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
							>
								{Object.keys(control.departments).map((dep, id) => (
									<option key={id} value={dep}>
										{dep}
									</option>
								))}
							</select>
							<select
								value={inputData.yourPosition}
								onChange={(e) =>
									setInputData({ ...inputData, yourPosition: e.target.value })
								}
							>
								{control.departments[department] &&
									Object.keys(control.departments[department]).map(
										(pos, id) => (
											<option key={id} value={pos}>
												{pos}
											</option>
										)
									)}
							</select>
						</div>
						<div></div>
						<div>Alapcsapat</div>
					</div>
					<div className={classes.EventModal_Calendar}>
						<SmallCalendar
							filteredEvents={[
								{
									label: inputData.label,
									startDate: +dayjs(inputData.startDate),
									endDate: +dayjs(inputData.endDate),
									weekDays: inputData.weekDays,
								},
							]}
							clickedDate={clickedDate}
							setClickedDate={setClickedDate}
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
