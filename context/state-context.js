import React, { useState, useEffect, useReducer, useMemo } from "react";
import dayjs from "dayjs";
import control from "../control.json";

export const StateContext = React.createContext({
	daySelected: null,
	setDaySelected: (day) => {},
	showEventModal: false,
	setShowEventModal: () => {},
	dispatchCallEvent: ({ type, payload }) => {},
	savedEvents: [],
	selectedEvent: null,
	setSelectedEvent: () => {},
	setLabels: () => {},
	labels: [],
	updateLabel: () => {},
	filteredEvents: [],
});

const savedEventsReducer = (state, { type, payload }) => {
	switch (type) {
		case "init":
			return payload;
		case "push":
			{
				const res = fetch("/api/event/" + 0, {
					method: "POST",
					body: JSON.stringify(payload),
					headers: {
						"Content-Type": "application/json",
					},
				});
			}
			return [...state, payload];
		case "update": {
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
	const [labels, setLabels] = useState(control.labels);

	const [savedEvents, dispatchCallEvent] = useReducer(savedEventsReducer, []);

	useEffect(() => {
		if (JSON.parse(localStorage.getItem("savedEvents"))) {
			dispatchCallEvent({
				type: "init",
				payload: JSON.parse(localStorage.getItem("savedEvents")),
			});
		}
	}, []);

	const filteredEvents = useMemo(() => {
		return savedEvents
			.filter((evt) =>
				labels
					.filter((lbl) => lbl.checked)
					.map((lbl) => lbl.id)
					.includes(evt.label)
			)
			.sort((a, b) => b.id - a.id);
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
		setLabels(labels.map((lbl) => (lbl.id === label.id ? label : lbl)));
	};

	return (
		<StateContext.Provider
			value={{
				daySelected,
				setDaySelected,
				showEventModal,
				setShowEventModal,
				dispatchCallEvent,
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
