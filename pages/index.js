import Head from "next/head";

import Login from "../components/Login/login";

const Home = () => {
	Home.title = "CrewFinder";

	return (
		<>
			<Head>
				<title>{Home.title}</title>
			</Head>
			<Login />
		</>
	);
};

export default Home;
