import Footer from "../../components/Footer/footer";
import Toolbar from "../../components/Header/Toolbar/Toolbar";
import SideDrawer from "../../components/Header/SideDrawer/SideDrawer";

import classes from "./Layout.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { StatusContext } from "../../context/status-context";
import Message from "../Message/Message";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
	const authContext = useContext(AuthContext);
	const statusContext = useContext(StatusContext);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHeandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	let backgroundClass = classes.MainDivBackground;
	let headerClass = classes.HeaderNotAuth;
	if (authContext.isAuth) {
		backgroundClass = backgroundClass = classes.MainDiv;
		headerClass = classes.Header;
	}

	return (
		<div className={backgroundClass}>
			<header className={headerClass}>
				<Toolbar drawerToggleClicked={sideDrawerToggleHeandler} />
				<SideDrawer
					open={sideDrawerIsVisible}
					closed={sideDrawerClosedHandler}
				/>
			</header>
			<main className={classes.Main}>
				{statusContext.isStatusMsg && <Message />}
				{props.children}
				<footer>
					<Footer />
				</footer>
			</main>
		</div>
	);
};

export default Layout;
