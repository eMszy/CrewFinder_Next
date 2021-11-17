import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";

export const autoLogin = () => {
	const authContext = useContext(AuthContext);

	useEffect(() => {
		if (!authContext.isAuth) {
			authContext.autoLogin();
		}
	}, []);
};
