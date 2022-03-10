import React from "react";
import { useRouter } from "next/router";

import Logo from "../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

import classes from "./Toolbar.module.scss";

const Toolbar = (props) => {
	const router = useRouter();

	return (
		<div className={classes.Toolbar}>
			<DrawerToggle clicked={props.drawerToggleClicked} />
			<nav className={classes.DesktopOnly}>
				<NavigationItems />
			</nav>
			{router.pathname !== "/" && (
				<div className={classes.Logo}>
					<Logo />
				</div>
			)}
		</div>
	);
};

export default Toolbar;
