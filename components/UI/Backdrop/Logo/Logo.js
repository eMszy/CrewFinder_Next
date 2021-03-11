import React from "react";
import { Link } from "react-router-dom";

import crewfinderLogoWhite from "../../../assets/crewfinderLogoWhite.svg";
import classes from "./Logo.module.scss";

const logo = () => {
	return (
		<div className={classes.Logo}>
			<Link to="/">
				<img src={crewfinderLogoWhite} alt="Crew Finder" />
			</Link>
		</div>
	);
};

export default logo;
