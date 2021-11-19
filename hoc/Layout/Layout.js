import Footer from "../../components/Footer/footer";
import Toolbar from "../../components/Header/Toolbar/Toolbar";
import SideDrawer from "../../components/Header/SideDrawer/SideDrawer";

import classes from "./Layout.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";

const Layout = (props) => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
	const authContext = useContext(AuthContext);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	};

	const sideDrawerToggleHeandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	let backgroundClass = !authContext.isAuth
		? classes.MainDivBackground
		: (backgroundClass = classes.MainDiv);

	return (
		<div className={backgroundClass}>
			<header className={classes.Header}>
				<Toolbar drawerToggleClicked={sideDrawerToggleHeandler} />
				<SideDrawer
					open={sideDrawerIsVisible}
					closed={sideDrawerClosedHandler}
				/>
			</header>
			<main className={classes.Main}>
				{props.children}
				<footer>
					<Footer />
				</footer>
			</main>
		</div>
	);
};

export default Layout;
