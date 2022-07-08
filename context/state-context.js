import React, { useState, useEffect, useReducer, useMemo } from "react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
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
	createEvent: (payload) => {},
	updateEvent: (payload) => {},
	deleteEvent: (payload) => {},
	applicationEvent: (payload) => {},
	acceptCandidate: (payload) => {},
});

const StateContextProvider = (props) => {
	const [daySelected, setDaySelected] = useState(dayjs());
	const [showEventModal, setShowEventModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [labels, setLabels] = useState(control.labels);
	const [isStatusMsg, setIsStatusMsg] = useState(null);

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
			const theEvent = resJson.events.filter(
				(eve) => eve.event._id === resJson.eventId
			);

			if (theEvent[0].event.department !== "Privát") {
				setSelectedEvent(...theEvent);
			}
			setStatus({ message: resJson.message });
			dispatchCallEvent({
				type: "updateEvent",
				payload: resJson.events,
			});
			return resJson;
		} catch (err) {
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const updateEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/" + payload.event._id, {
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
			dispatchCallEvent({
				type: "updateEvent",
				payload: resJson.events,
			});
			setStatus({ message: resJson.message });
			return;
		} catch (err) {
			setShowEventModal(false);
			setStatus({ message: err.message, error: true });
		}
	};

	const deleteEvent = async (payload) => {
		try {
			const res = await fetch("/api/event/" + payload, {
				method: "DELETE",
			});
			const resJson = await res.json();
			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			dispatchCallEvent({
				type: "deleteEvent",
				payload: resJson.eventId,
			});
			setStatus({ message: resJson.message });
			setSelectedEvent(null);
			setShowEventModal(false);
			return;
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
			dispatchCallEvent({
				type: "updateEvent",
				payload: resJson.events,
			});
			setStatus(resJson.message);
			return resJson;
		} catch (err) {
			setStatus({ message: err.message, error: true });
		}
	};

	const acceptCandidate = async (payload, eventId) => {
		try {
			const res = await fetch(`/api/position/${eventId}`, {
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

			console.log("resJson", resJson);
			// dispatchCallEvent({
			// 	type: "updateEvent",
			// 	payload: resJson.events,
			// });
			setStatus(resJson);
			return resJson;
		} catch (err) {
			setStatus({ message: err.message, error: true });
		}
	};

	const savedEventsReducer = (state, { type, payload }) => {
		console.log("payload: ", payload, type);
		console.log("state: ", state);
		switch (type) {
			case "updateEvent": {
				return payload;
			}
			case "deleteEvent": {
				return state.filter((evt) => evt.event._id !== payload);
			}
			case "incoming": {
				console.log("incoming: ", payload, state);
				return state;
			}
			default:
				throw new Error();
		}
	};

	const [savedEvents, dispatchCallEvent] = useReducer(savedEventsReducer, []);

	// console.log("savedEvents", savedEvents);

	let socket;

	const socketInitializer = async () => {
		await fetch("/api/socket");
		socket = io();
		if (!socket.connected) {
			socket.on("connect", () => {
				console.log("Socket.IO connected on " + session.id + " broadcast.");
			});
		}
		socket.on(session.id, (updatedEvents) => {
			console.log("Updates from Socket: ", updatedEvents);
			dispatchCallEvent({
				type: "incoming",
				payload: updatedEvents,
			});
		});
	};

	useEffect(() => {
		if (status === "authenticated") {
			const loadAllEvents = async () => {
				try {
					const res = await fetch("/api/event/all");
					const eventsJson = await res.json();
					if (!res.ok || res.error) {
						throw Error(eventsJson.message);
					}
					dispatchCallEvent({
						type: "updateEvent",
						payload: eventsJson,
					});
				} catch (err) {
					setStatus({ message: err.message, error: true });
				}
			};
			console.log("socket", socket);
			// socketInitializer();
			loadAllEvents();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	const filteredEvents = useMemo(() => {
		let events = [];
		if (savedEvents && savedEvents.length) {
			const filteredLabels = labels
				.filter((lbl) => lbl.checked)
				.map((lbl) => lbl.id);

			savedEvents.forEach((event) => {
				const positions = event.positions.filter((pos) =>
					filteredLabels.includes(pos.label)
				);
				if (positions.length) {
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
				createEvent,
				updateEvent,
				deleteEvent,
				applicationEvent,
				acceptCandidate,
			}}
		>
			{props.children}
		</StateContext.Provider>
	);
};

export default StateContextProvider;
