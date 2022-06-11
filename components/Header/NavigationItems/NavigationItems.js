import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";

import classes from "./NavigationItem.module.scss";
import Image from "next/image";

const NavigationItems = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	let navMenu = (
		<div className={classes.NaviItems}>
			<div>
				<Link href="/ismerteto">
					<a className={router.pathname === "/ismerteto" ? classes.Active : ""}>
						Így működik a Crew Finder
					</a>
				</Link>
			</div>
			<div>
				<Link href="/rolunk">
					<a className={router.pathname === "/rolunk" ? classes.Active : ""}>
						Rólunk
					</a>
				</Link>
			</div>
		</div>
	);

	if (status === "authenticated") {
		navMenu = (
			<div className={classes.NaviItems}>
				<div className={classes.Image}>
					<Link href="/home/profil" activeClassName={classes.active} passHref>
						<a>
							<Image
								src={session.user.image}
								width={50}
								height={50}
								alt={session.user.name}
							/>
						</a>
					</Link>
				</div>
				<div className={classes.Name}>
					<Link href="/home/profil" activeClassName={classes.active}>
						{session.user.name}
					</Link>
					<div
						onClick={() => signOut({ callbackUrl: `/` })}
						className={classes.signOut}
					>
						Kijelentkezés
					</div>
				</div>
			</div>
		);
	}

	return navMenu;
};

export default NavigationItems;
