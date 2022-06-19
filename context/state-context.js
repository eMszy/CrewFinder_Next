import React, { useState, useEffect, useReducer, useMemo } from "react";
import { useSession } from "next-auth/react";
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
	isStatusMsg: null,
	setStatus: () => {},
});

const StateContextProvider = (props) => {
	const [daySelected, setDaySelected] = useState(dayjs());
	const [showEventModal, setShowEventModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [labels, setLabels] = useState(control.labels);
	const [isStatusMsg, setIsStatusMsg] = useState(null);
	const [events, setEvents] = useState([]);

	const { data: session, status } = useSession();

	const setStatus = (message) => {
		if (message != null) {
			if (message.error) {
				console.warn("Error:", message);
			} else {
				console.log("Status:", message);
			}
		}
		setIsStatusMsg(message);
	};

	const createEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/new", {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			await setSelectedEvent(resJson.event);
			setStatus(resJson);
			return resJson;
		} catch (err) {
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const updateEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/" + payload._id, {
				method: "PUT",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			setStatus(resJson);
			return;
		} catch (err) {
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const deleteEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/" + payload._id, {
				method: "DELETE",
			});
			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			setStatus(resJson);
			setSelectedEvent(resJson.event);
			return resJson;
		} catch (err) {
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const applicationEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/application", {
				method: "PUT",
				body: JSON.stringify(payload),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			setStatus(resJson);
			setShowEventModal(false);
			return resJson;
		} catch (err) {
			// setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const savedEventsReducer = (state, { type, payload }) => {
		switch (type) {
			case "init": {
				return payload;
			}
			case "push": {
				createEvent(payload);
				console.log("payload", payload, state);
				return [...state, payload];
			}
			case "update": {
				updateEvent(payload);
				return state.map((evt) => (evt.id === payload.id ? payload : evt));
			}
			case "delete": {
				deleteEvent(payload);
				return state.filter((evt) => evt.id !== payload.id);
			}
			case "application": {
				applicationEvent(payload);
				return state.map((evt) =>
					evt._id === payload.theEvent._id ? payload.theEvent : evt
				);
			}
			default:
				throw new Error();
		}
	};

	const [savedEvents, dispatchCallEvent] = useReducer(savedEventsReducer, []);

	useEffect(() => {
		const loadAllEvents = async () => {
			try {
				if (status === "authenticated") {
					const res = await fetch("/api/event/all");
					const eventsJson = await res.json();
					if (!res.ok || res.error) {
						throw Error(eventsJson.message);
					}
					setEvents(eventsJson);
				}
			} catch (err) {
				setStatus({ message: err.message, error: true });
			}
		};
		loadAllEvents();
	}, [status]);

	useEffect(() => {
		dispatchCallEvent({
			type: "init",
			payload: events,
		});
	}, [events]);

	const filteredEvents = useMemo(() => {
		let events = [];
		if (savedEvents && savedEvents.length > 0) {
			const filteredLabels = labels
				.filter((lbl) => lbl.checked)
				.map((lbl) => lbl.id);

			savedEvents.forEach((event) => {
				let positions = [];
				event.positions?.forEach((pos) => {
					if (filteredLabels.includes(pos.label)) {
						positions.push(pos);
					}
				});
				if (filteredLabels.includes(event.label)) {
					events.push({ ...event, positions: positions });
				}
			});
		}
		return events;
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
				isStatusMsg,
				setStatus,
			}}
		>
			{props.children}
		</StateContext.Provider>
	);
};

export default StateContextProvider;
