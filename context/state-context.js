import React, { useState, useEffect, useReducer, useMemo } from "react";
import dayjs from "dayjs";

export const StateContext = React.createContext({
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
		case "update": {
			console.log("evt", payload);
			return state.map((evt) => (evt.id === payload.id ? payload : evt));
		}
		case "delete":
			return state.filter((evt) => evt.id !== payload.id);
		default:
			throw new Error();
	}
};

const StateContextProvider = (props) => {
	const [daySelected, setDaySelected] = useState(dayjs());
	const [showEventModal, setShowEventModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [labels, setLabels] = useState([
		{ label: "purple", title: "Privát esemény", checked: true },
		{ label: "green", title: "Visszaigazolt", checked: true },
		{ label: "blue", title: "Jelentkeztél", checked: true },
		{ label: "orange", title: "Célzott megkeresés", checked: true },
		{ label: "yellow", title: "Nyitott pozicíó", checked: true },
	]);

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
