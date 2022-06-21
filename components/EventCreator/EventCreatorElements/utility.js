import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDescription, MdTitle } from "react-icons/md";
import dayjs from "dayjs";

import control from "../../../control.json";

import classes from "./../EventHandle.module.scss";

import * as InputTemplates from "../../UI/Input/InputTemplates/InputTemplates.js";

export const dayFormating = (day) => dayjs(day).format("YYYY-MM-DDTHH:mm");

export const uniqueArray = (array1 = [], array2 = []) => {
	let updatedArray = {};
	array1.forEach((arr1) => {
		updatedArray = { ...updatedArray, [arr1.id]: { ...arr1 } };
	});
	array2.forEach((arr2) => {
		updatedArray = { ...updatedArray, [arr2.id]: { ...arr2 } };
	});
	return Object.values(updatedArray);
};

export const addPosHelper = (
	pos,
	id,
	baseCrew,
	invitionType = { name: "open" },
	name = ""
) => {
	if (pos && pos !== "") {
		const updatedPos = [
			...baseCrew,
			{ id: id + Math.random(), pos, name, invitionType },
		];
		return updatedPos;
	}
	return false;
};

export const eventTypeTemplate = (selectedEvent) => {
	return {
		title: {
			...InputTemplates.text,
			value: selectedEvent ? selectedEvent.title : "",
			disabled: false,
			valid: selectedEvent ? true : false,
			elementConfig: {
				placeholder: "Projek neve",
				title: (
					<div className={classes.Icon}>
						<MdTitle />
					</div>
				),
			},
		},
		shortTitle: {
			...InputTemplates.text,
			value: selectedEvent ? selectedEvent.shortTitle : "",
			disabled: false,
			valid: selectedEvent ? true : false,
			elementConfig: {
				placeholder: "Rövidítés",
			},
			validation: { required: true, maxLength: 5 },
		},
		description: {
			...InputTemplates.text,
			value: selectedEvent ? selectedEvent.description : "",
			disabled: false,
			valid: selectedEvent ? true : false,
			elementConfig: {
				placeholder: "Leírás",
				title: (
					<div className={classes.Icon}>
						<MdOutlineDescription />
					</div>
				),
			},
		},
		location: {
			...InputTemplates.text,
			value: selectedEvent ? selectedEvent.location : "",
			disabled: false,
			valid: selectedEvent ? true : false,
			elementConfig: {
				placeholder: "Helyszín",
				title: (
					<div className={classes.Icon}>
						<IoLocationOutline />
					</div>
				),
			},
		},
	};
};

export const eventOtherTemplate = (selectedEvent, daySelected, department) => {
	return {
		dates: selectedEvent
			? selectedEvent.dates
			: [
					{
						id: +dayjs(daySelected).format(`YYYYMMDD`),
						startTime: +dayjs(daySelected.hour(6).minute(0)),
						endTime: +dayjs(daySelected.hour(18).minute(0)),
					},
			  ],
		startDate: selectedEvent
			? dayFormating(selectedEvent.startDate)
			: dayFormating(daySelected.hour(6).minute(0)),
		endDate: selectedEvent
			? dayFormating(selectedEvent.endDate)
			: dayFormating(daySelected.hour(18).minute(0)),
		weight: selectedEvent
			? selectedEvent.weight
			: +dayjs(daySelected).format(`YYYYMMDD`) +
			  Math.floor(Math.random() * (9999 - 1000) + 1),
		department: selectedEvent ? selectedEvent.department : department,
		positions: selectedEvent ? selectedEvent.positions : [],
		creatorPosition: selectedEvent
			? selectedEvent.creatorPosition
			: Object.values(control.departments[department].positions)[0].name,
	};
};

export const weekdaysSet = [1, 2, 3, 4, 5, 6, 0];
