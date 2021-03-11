import React, { useContext } from "react";
import { useRouter } from "next/router";

import classes from "./Toolbar.module.scss";
import Logo from "../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";
// import { AuthContext } from "../../../context/auth-context";
// import FelhasznaloIcon from "../NavigationItems/FelhasznaloIcon/FelhasznaloIcon";

const Toolbar = (props) => {
	// const authContext = useContext(AuthContext);

	const router = useRouter();

	return (
		<div className={classes.Toolbar}>
			<DrawerToggle clicked={props.drawerToggleClicked} />
			{router.pathname !== "/" ? (
				// || authContext.isAuth
				<Logo className={classes.Logo} />
			) : null}
			<nav className={classes.DesktopOnly}>
				<NavigationItems />
			</nav>
			{/* <FelhasznaloIcon /> */}
		</div>
	);
};

export default Toolbar;
