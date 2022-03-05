import { useContext } from "react";
import Head from "next/head";
import { AuthContext } from "../context/auth-context";
import { autoLogin } from "../shared/autoLogin";

import Login from "../components/Login/login";
import { Calendar } from "../components/Calendar/Calendar";
import Sidebar from "../components/Sidebar/Sidebar";

import classes from "./index.module.scss";

const Home = () => {
	Home.title = "CrewFinder";

	const authContext = useContext(AuthContext);
	autoLogin();

	let content = <Login />;

	if (authContext.isAuth) {
		content = (
			<div className={classes.Main}>
				<Sidebar />
				<Calendar />;
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{Home.title}</title>
			</Head>
			{content}
		</>
	);
};

export default Home;
