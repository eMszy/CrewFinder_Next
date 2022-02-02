import React, { useState, useEffect, useReducer, useMemo } from "react";
import dayjs from "dayjs";

export const StateContext = React.createContext({
	monthIndex: 0,
	setMonthIndex: (index) => {},
	smallCalendarMonth: 0,
	setSmallCalendarMonth: (index) => {},
	daySelected: null,
	setDaySelected: (day) => {},
	showEventModal: false,
	setShowEventModal: () => {},
	dispatchCalEvent: ({ type, payload }) => {},
	savedEvents: [],
	selectedEvent: null,
	setSelectedEvent: () => {},
	setLabels: () => {},
	labels: [],
	updateLabel: () => {},
	filteredEvents: [],
});

const savedEventsReducer = (state, { type, payload }) => {
	console.log("type", type, payload);
	switch (type) {
		case "init":
			return payload;
		case "push":
			return [...state, payload];
		case "update":
			return state.map((evt) => (evt.id === payload.id ? payload : evt));
		case "delete":
			return state.filter((evt) => evt.id !== payload.id);
		default:
			throw new Error();
	}
};

const StateContextProvider = (props) => {
	const [monthIndex, setMonthIndex] = useState(dayjs().month());
	const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
	const [daySelected, setDaySelected] = useState(dayjs());
	const [showEventModal, setShowEventModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [labels, setLabels] = useState([]);

	const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, []);

	useEffect(() => {
		if (JSON.parse(localStorage.getItem("savedEvents"))) {
			dispatchCalEvent({
				type: "init",
				payload: JSON.parse(localStorage.getItem("savedEvents")),
			});
		}
	}, []);

	const filteredEvents = useMemo(() => {
		return savedEvents.filter((evt) =>
			labels
				.filter((lbl) => lbl.checked)
				.map((lbl) => lbl.label)
				.includes(evt.label)
		);
	}, [savedEvents, labels]);

	useEffect(() => {
		localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
	}, [savedEvents]);

	useEffect(() => {
		setLabels((prevLabels) => {
			return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
				const currentLabel = prevLabels.find((lbl) => lbl.label === label);
				return {
					label,
					checked: currentLabel ? currentLabel.checked : true,
				};
			});
		});
	}, [savedEvents]);

	useEffect(() => {
		if (smallCalendarMonth !== null) {
			setMonthIndex(smallCalendarMonth);
		}
	}, [smallCalendarMonth]);

	useEffect(() => {
		if (!showEventModal) {
			setSelectedEvent(null);
		}
	}, [showEventModal]);

	const updateLabel = (label) => {
		setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
	};

	return (
		<StateContext.Provider
			value={{
				monthIndex,
				setMonthIndex,
				smallCalendarMonth,
				setSmallCalendarMonth,
				daySelected,
				setDaySelected,
				showEventModal,
				setShowEventModal,
				dispatchCalEvent,
				selectedEvent,
				setSelectedEvent,
				savedEvents,
				setLabels,
				labels,
				updateLabel,
				filteredEvents,
			}}
		>
			{props.children}
		</StateContext.Provider>
	);
};

export default StateContextProvider;
