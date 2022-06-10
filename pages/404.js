import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./404.module.scss";
import { useSession } from "next-auth/react";

const Costume404 = () => {
	Costume404.title = "CrewFinder - 404";

	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		let link = "/";
		if (status === "authenticated") {
			link = "/home";
		}
		const timer = setTimeout(() => {
			router.push(link);
		}, 5000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line
	}, [status]);

	return (
		<>
			<Head>
				<title>{Costume404.title}</title>
			</Head>
			<div className={classes.Main}>
				<h1>Sajnáljuk, ez az oldal nem létezik.</h1>
				<Spinner />
				<h3>Hamarossan átirányítunk a föoldalra.</h3>
			</div>
		</>
	);
};

export default Costume404;
