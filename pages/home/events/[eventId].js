import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { StateContext } from "../../../context/state-context";
import Spinner from "../../../components/UI/Spinner/Spinner";

import { server } from "../../../config";

const Events = ({ title, event, err }) => {
	Events.title = title;

	const router = useRouter();

	const { setShowEventModal, setSelectedEvent, setStatus } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			if (event) {
				setSelectedEvent(event);
				setShowEventModal(true);
			}
			if (err) {
				setStatus({
					message: err,
					error: true,
				});
			}
			router.push("/home");
		}
		// eslint-disable-next-line
	}, [event, err, status]);

	return <Spinner />;
};

export const getServerSideProps = async (context) => {
	const title = "CrewFinder - Events";
	const headers = context.req.headers;
	const { eventId } = context.query;
	if (!eventId) {
		return { props: { title: title } };
	}
	try {
		const res = await fetch(`${server}/api/event/${eventId}`, {
			headers: headers,
		});
		const event = await res.json();
		if (event.error) {
			throw Error(event.message);
		}

		return {
			props: {
				title,
				event,
			},
		};
	} catch (err) {
		return {
			props: { err: err.message, title },
		};
	}
};

export default Events;
