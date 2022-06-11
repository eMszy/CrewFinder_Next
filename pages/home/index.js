import { useSession } from "next-auth/react";
import Head from "next/head";

import Calendar from "../../components/Calendar/Calendar";
import Sidebar from "../../components/Sidebar/Sidebar";

import classes from "../index.module.scss";

const Home = () => {
	Home.title = "CrewFinder - Home";

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

export default Home;
