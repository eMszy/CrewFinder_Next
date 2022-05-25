import Image from "next/image";
import React from "react";

import classes from "./Spinner.module.scss";

const crewfinderLogoWhite = "/icons/crewfinderLogoWhiteNoText.svg";

const spinner = () => {
	return (
		<div className={classes.spinnerContainer}>
			<div className={classes.SpinerLogo}>
				<Image
					src={crewfinderLogoWhite}
					alt="Crew Finder"
					width={40}
					height={40}
				/>
			</div>
			<div className={classes.loadingSpinner}></div>
		</div>
	);
};
export default spinner;
