import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import classes from "./Logo.module.scss";

const Logo = () => {
	const { status } = useSession();

	const crewfinderLogoWhite = "/icons/crewfinderLogoWhite.svg";

	const link = status === "authenticated" ? "/home" : "/";

	return (
		<div className={classes.Logo}>
			<Link href={link}>
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

export default Logo;
