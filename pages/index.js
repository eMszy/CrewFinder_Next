import Head from "next/head";
// import Image from "next/image";
import { useContext } from "react";
import Login from "../components/Login/Login";
import { AuthContext } from "../context/auth-context";
import { autoLogin } from "../shared/autoLogin";

import classes from "./index.module.scss";

const Home = () => {
	Home.title = "CrewFinder";

	const authContext = useContext(AuthContext);
	autoLogin();

	let content = <Login />;

	if (authContext.isAuth) {
		content = (
			<div>
				<h1>Be vagy jelentkezve!!</h1>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>CrewFinder</title>
			</Head>
			{content}
		</>
	);
};

export default Home;
