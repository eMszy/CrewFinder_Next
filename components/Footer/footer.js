import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import classes from "./footer.module.scss";

const Footer = () => {
	const { status } = useSession();
	const link = status === "authenticated" ? "/home" : "/";

	return (
		<div className={classes.FooterDiv}>
			<div className={classes.FooterDiv__Nav}>
				<ul className={classes.NaviItems}>
					<li>
						<h3>
							<Link href={link}>
								<a>Crew Finder</a>
							</Link>
						</h3>
					</li>
					<li>
						<Link href="/ismerteto">
							<a>Így működik a Crew Finder</a>
						</Link>
					</li>
					<li>
						<Link href="/rolunk">
							<a>Rólunk</a>
						</Link>
					</li>
				</ul>
			</div>
			<div className={classes.Copyright}>
				<p>Copyright © Crew Finder - Minden jog fenntartva</p>
			</div>
		</div>
	);
};

export default Footer;
