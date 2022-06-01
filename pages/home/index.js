import { useSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useEffect } from "react";

import Calendar from "../../components/Calendar/Calendar";
import Sidebar from "../../components/Sidebar/Sidebar";

import { server } from "../../config";
import { StateContext } from "../../context/state-context";

import classes from "../index.module.scss";

const Home = ({ title, event, err }) => {
	Home.title = title;

	const { setShowEventModal, setSelectedEvent, setStatus } =
		useContext(StateContext);

	const { data: session, status } = useSession();

	useEffect(() => {
		if (event) {
			setSelectedEvent(event);
			setShowEventModal(true);
		}
	}, [event, status]);

	useEffect(() => {
		if (err) {
			setStatus({
				message: err,
				error: true,
			});
		}
		// eslint-disable-next-line
	}, [err]);

	return (
		<>
			<Head>
				<title>{Home.title}</title>
			</Head>
			<div className={classes.Main}>
				<Sidebar />
				<Calendar />
			</div>
		</>
	);
};

export const getServerSideProps = async (context) => {
	const title = "CrewFinder - Home";
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

export default Home;
