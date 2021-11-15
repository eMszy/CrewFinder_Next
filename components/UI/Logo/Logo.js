import React from "react";
import { Link } from "react-router-dom";
import Image from "next/image";

import crewfinderLogoWhite from "../../../assets/crewfinderLogoWhite.svg";
import classes from "./Logo.module.scss";

const logo = () => {
	return (
		<div className={classes.Logo}>
			<Link href="/">
				<Image src={crewfinderLogoWhite} alt="Crew Finder" />
			</Link>
		</div>
	);
};

export default logo;
