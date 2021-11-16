import React from "react";
import Link from "next/link";
import Image from "next/image";

import classes from "./Logo.module.scss";

const logo = () => {
	const crewfinderLogoWhite = "/icons/crewfinderLogoWhite.svg";

	return (
		<div className={classes.Logo}>
			<Link href="/">
				<a>
					<Image
						src={crewfinderLogoWhite}
						alt="Crew Finder"
						width={110}
						height={30}
					/>
				</a>
			</Link>
		</div>
	);
};

export default logo;
