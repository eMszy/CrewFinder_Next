import React from "react";
import Link from "next/link";
import Image from "next/image";

import classes from "./Logo.module.scss";

const logo = () => {
	const crewfinderLogoWhite = "/icons/crewfinderLogoWhite.svg";

	return (
		<div className={classes.Logo}>
			<Link href="/">
				<Image
					src={crewfinderLogoWhite}
					alt="Crew Finder"
					width={110}
					height={30}
				/>
			</Link>
		</div>
	);
};

export default logo;
