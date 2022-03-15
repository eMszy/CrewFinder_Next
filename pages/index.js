import { useEffect } from "react";

import { useRouter } from "next/router";

import Head from "next/head";
import { useSession } from "next-auth/react";

import Login from "../components/Login/login";

const Home = () => {
	Home.title = "CrewFinder";

	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/home");
		}
	}, [status]);

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
