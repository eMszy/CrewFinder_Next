import Head from "next/head";
// import Image from "next/image";
import { useContext, useEffect } from "react";
import Login from "../components/Login/Login";
import { AuthContext } from "../context/auth-context";

// import classes from "./index.module.scss";

const Home = () => {
	const authContext = useContext(AuthContext);

	useEffect(() => {
		if (!authContext.isAuth) {
			authContext.autoLogin();
		}
	}, []);

	let content = <Login />;

	if (authContext.isAuth) {
		content = (
			<div>
				<h1>Be vagy jelentkezve!!</h1>
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
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
