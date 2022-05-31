import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./404.module.scss";

const Costume404 = () => {
	Costume404.title = "CrewFinder - 404";

	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/");
		}, 5000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Head>
				<title>{Costume404.title}</title>
			</Head>
			<div className={classes.Main}>
				<h1>Sajnáljuk, ez az oldal nem létezik.</h1>
				<Spinner />
			</div>
		</>
	);
};

export default Costume404;
