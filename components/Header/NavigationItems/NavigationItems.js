import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/auth-context";
import Button from "../../UI/Button/Button";

import classes from "./NavigationItem.module.scss";

const NavigationItems = () => {
	const authContext = useContext(AuthContext);
	const router = useRouter();
	const [userName, setUserName] = useState("Profil");

	useEffect(() => {
		if (authContext.userNickName) {
			setUserName(authContext.userNickName);
		} else if (authContext.userName) {
			setUserName(authContext.userName);
		}
	}, [authContext.userNickName, authContext.userName]);

	let navMenu = (
		<ul className={classes.NaviItems}>
			<li>
				<Link href="/ismerteto">
					<a className={router.pathname === "/ismerteto" ? classes.Active : ""}>
						Így működik a Crew Finder
					</a>
				</Link>
			</li>
			<li>
				<Link href="/rolunk">
					<a className={router.pathname === "/rolunk" ? classes.Active : ""}>
						Rólunk
					</a>
				</Link>
			</li>
		</ul>
	);

	if (authContext.isAuth) {
		navMenu = (
			<ul className={classes.NaviItems}>
				<li>
					<Link href="/profil" activeClassName={classes.active}>
						{userName}
					</Link>
				</li>
				<li>
					<p onClick={authContext.logout}>Kijelentkezés</p>
				</li>
				{/* <li>
					<Button clicked={signOut}>Ki</Button>
				</li> */}
			</ul>
		);
	}

	return navMenu;
};

export default NavigationItems;
