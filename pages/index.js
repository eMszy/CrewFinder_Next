import { useContext } from "react";
import Head from "next/head";
// import Image from "next/image";
import { AuthContext } from "../context/auth-context";
import { autoLogin } from "../shared/autoLogin";

import Login from "../components/Login/Login";
import { Calendar } from "../components/Calendar/Calendar";

// import classes from "./index.module.scss";

const Home = () => {
	Home.title = "CrewFinder";

	const authContext = useContext(AuthContext);
	autoLogin();

	let content = <Login />;

	if (authContext.isAuth) {
		content = <Calendar />;
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
