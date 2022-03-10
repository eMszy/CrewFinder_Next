import { useSession } from "next-auth/react";

import Footer from "../../components/Footer/footer";
import Toolbar from "../../components/Header/Toolbar/Toolbar";
import SideDrawer from "../../components/Header/SideDrawer/SideDrawer";

import classes from "./Layout.module.scss";
import { useContext, useState } from "react";
import { StatusContext } from "../../context/status-context";
import Message from "../Message/Message";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const { isStatusMsg } = useContext(StatusContext);
	const { status } = useSession();

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHeandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	let backgroundClass = classes.MainDivBackground;
	let headerClass = classes.HeaderNotAuth;

	if (status === "authenticated") {
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
				{isStatusMsg && <Message />}
				{props.children}
				<footer>
					<Footer />
				</footer>
			</main>
		</div>
	);
};

export default Layout;
