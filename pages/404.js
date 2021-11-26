import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import classes from "./404.module.scss";

const Costume404 = () => {
	Costume404.title = "CrewFinder - 404";

	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/");
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<Head>
				<title>{Costume404.title}</title>
			</Head>
			<div className={classes.Main}>
				<h1>Sajnáljuk, ez az oldal nem létezik.</h1>
			</div>
		</>
	);
};

export default Costume404;
