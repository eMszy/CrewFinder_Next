import { useRouter } from "next/router";
import Head from "next/head";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { autoLogin } from "../../shared/autoLogin";

const profil = () => {
	const authContext = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (!authContext.isAuth) {
			router.push("/");
		}
	}, []);

	let content = (
		<div>
			<h1>Profilod!!</h1>
		</div>
	);

	return (
		<>
			<Head>
				<title>CrewFinder - Profil</title>
			</Head>
			{content}
		</>
	);
};

export default profil;
