import React, { useContext, useEffect } from "react";
import Head from "next/head";
import { getSession } from "next-auth/react";

import Positions from "../../../components/Profil/Positions";
import Profil from "../../../components/Profil/Profil";

import { formTemplate } from "../../../components/UI/Input/InputTemplates/InputTemplates";

import { formingData } from "../../../shared/utility";

import { server } from "../../../config";
import { StateContext } from "../../../context/state-context";

import classes from "./Profil.module.scss";

const ProfilPage = ({ formedUser, user, err, title }) => {
	const stateContext = useContext(StateContext);

	useEffect(() => {
		if (err) {
			stateContext.setStatus({
				message: err,
				error: true,
			});
		}
		// eslint-disable-next-line
	}, [err]);

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div className={classes.Profil}>
				<div className={classes.Profil_Panels}>
					<Positions user={user} />
				</div>
				<div className={classes.Profil_Panels}>
					<Profil formedUser={formedUser} user={user} />
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = async (context) => {
	const title = "CrewFinder - Profil";
	const headers = context.req.headers;
	try {
		const session = await getSession(context);
		const res = await fetch(`${server}/api/user/${session.id}`, {
			headers: headers,
		});
		const user = await res.json();
		if (!user) {
			throw Error(user.message);
		}
		const formedUser = formingData(user, formTemplate);
		return { props: { formedUser, user, session, title } };
	} catch (err) {
		return {
			props: { err: err.message, title },
		};
	}
};

export default ProfilPage;
