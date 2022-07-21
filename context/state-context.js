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
	updateEvent: (payload) => {},
	applicationEvent: (payload) => {},
	acceptCandidate: (payload) => {},
	isSocket: null,
});

const StateContextProvider = (props) => {
	const [daySelected, setDaySelected] = useState(dayjs());
	const [showEventModal, setShowEventModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [labels, setLabels] = useState(control.labels);
	const [isStatusMsg, setIsStatusMsg] = useState(null);
	const [isSocket, setSocket] = useState();
	const [reload, setReload] = useState(true);

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

	// console.log("selectedEvent", selectedEvent);

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
		// console.log("payload: ", payload, type);
		// console.log("state: ", state);
		switch (type) {
			case "createEvent": {
				return [...state, ...payload];
			}
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

	const socketInitializer = async () => {
		await fetch("/api/socket");
		const socket = io();
		setSocket(socket);

		if (!socket.connected) {
			console.log("Socket.IO connected...");
			socket.on("to-client", (updatedEvents) => {
				console.log("Updates from Socket: ", updatedEvents);
				dispatchCallEvent({
					type: "incoming",
					payload: updatedEvents,
				});
			});

			socket.on("to-client-reload", () => {
				setReload(true);
			});
			socket.on("to-client-delete-event", (eventId) => {
				dispatchCallEvent({
					type: "deleteEvent",
					payload: eventId,
				});
			});
		}
	};

	useEffect(() => {
		if (status === "authenticated") {
			socketInitializer();
		}
	}, [status]);

	useEffect(() => {
		if (isSocket && reload) {
			isSocket.emit("get-all-events", session.id, (res) => {
				if (res.error) {
					setStatus(res);
					return;
				}
				// console.log("res", res);
				dispatchCallEvent({
					type: "updateEvent",
					payload: res,
				});
			});
			setReload(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSocket, reload]);

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
				updateEvent,
				applicationEvent,
				acceptCandidate,
				isSocket,
			}}
		>
			{props.children}
		</StateContext.Provider>
	);
};

export default StateContextProvider;
