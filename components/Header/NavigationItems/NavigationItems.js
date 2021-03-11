import Link from "next/link";
import React, { useContext } from "react";

// import { AuthContext } from "../../../context/auth-context";
import Button from "../../UI/Button/Button";

import classes from "./NavigationItem.module.scss";

const NavigationItems = () => {
	// const authContext = useContext(AuthContext);

	let navMenu = (
		<ul className={classes.NaviItems}>
			<li>
				<Link href="/ismerteto" activeClassName={classes.active}>
					Így működik a Crew Finder
				</Link>
			</li>
			<li>
				<Link href="/rolunk" activeClassName={classes.active}>
					Rólunk
				</Link>
			</li>
		</ul>
	);

	// if (authContext.isAuth) {
	// 	navMenu = (
	// 		<ul className={classes.NaviItems}>
	// 			<li>
	// 				<Link href="/profil" activeClassName={classes.active}>
	// 					Profil
	// 				</Link>
	// 			</li>
	// 			<li>
	// 				<Button clicked={authContext.logout}>Kijelentkezés</Button>
	// 			</li>
	// 		</ul>
	// 	);
	// }

	return navMenu;
};

export default NavigationItems;
