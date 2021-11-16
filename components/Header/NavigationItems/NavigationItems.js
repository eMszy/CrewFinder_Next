import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";

// import { AuthContext } from "../../../context/auth-context";
import Button from "../../UI/Button/Button";

import classes from "./NavigationItem.module.scss";

const NavigationItems = () => {
	// const authContext = useContext(AuthContext);
	const router = useRouter();

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
