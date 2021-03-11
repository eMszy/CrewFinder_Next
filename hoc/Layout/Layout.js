import Footer from "../../components/Footer/footer";
import Toolbar from "../../components/Header/Toolbar/Toolbar";
import SideDrawer from "../../components/Header/SideDrawer/SideDrawer";

import classes from "./Layout.module.scss";
import { useState } from "react";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHeandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	return (
		<div className={classes.MainDiv}>
			<header className={classes.Header}>
				<Toolbar drawerToggleClicked={sideDrawerToggleHeandler} />
				<SideDrawer
					open={sideDrawerIsVisible}
					closed={sideDrawerClosedHandler}
				/>
			</header>
			<main>{props.children}</main>
			<footer className={classes.Footer}>
				<Footer />
			</footer>
		</div>
	);
};

export default Layout;
