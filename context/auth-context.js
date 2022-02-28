import React, { useContext, useState } from "react";
import { useRouter } from "next/router";

import { createNewUser, userLogin } from "../GraphQl/GraphQLTemplates";
import { FetchData, PostData } from "../GraphQl/utility";
import { StatusContext } from "./status-context";

export const AuthContext = React.createContext({
	isAuth: false,
	loading: false,
	token: null,
	userId: null,
	isAdmin: false,
	isHOD: false,
	userName: null,
	userNickName: null,
	setNickName: () => {},
	reg: () => {},
	login: () => {},
	googleLoginHandler: () => {},
	logout: () => {},
	autoLogin: () => {},
});

const AuthContextProvider = (props) => {
	const statusContext = useContext(StatusContext);

	const [IsAuth, setIsAuth] = useState(false);
	const [IsAdmin, setIsAdmin] = useState(false);
	const [IsHOD, setIsHOD] = useState(false);
	const [AuthLoading, setAuthLoading] = useState(false);
	const [Token, setToken] = useState(null);
	const [UserId, setUserId] = useState(null);
	const [name, setName] = useState(null);
	const [nickName, setNickName] = useState(null);

	const router = useRouter();

	const signupHandler = async (UserForm) => {
		const imgUrl = UserForm?.imageUrl?.value || "";
		setAuthLoading(true);

		const graphqlQuery = createNewUser(
			UserForm.email.value,
			UserForm.name.value,
			UserForm.password.value,
			imgUrl
		);

		try {
			await PostData(graphqlQuery);
			setAuthLoading(false);
			console.log("Creating a new User: ", UserForm);
			statusContext.setStatus({ message: "Sikeres regisztráció" });
			loginHandler(UserForm);
		} catch (err) {
			setIsAuth(false);
			setAuthLoading(false);
			err.error = true;
			statusContext.setStatus(err);
		}
	};

	const loginHandler = async (UserForm) => {
		setAuthLoading(true);

		const graphqlQuery = userLogin(
			UserForm.email.value,
			UserForm.password.value
		);

		try {
			const resData = await PostData(graphqlQuery);
			console.log(`login`, resData.data);
			setIsAuth(true);
			setAuthLoading(false);
			setToken(resData.data.login.token);
			setUserId(resData.data.login.userId);
			setIsAdmin(resData.data.login.metaData.isAdmin);
			setIsHOD(resData.data.login.metaData.isHOD);
			setName(resData.data.login.userData.name);
			setNickName(resData.data.login.userData.userData.connectInfo.nickName);

			localStorage.setItem("token", resData.data.login.token);
			localStorage.setItem("userId", resData.data.login.userId);

			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
			localStorage.setItem("expiryDate", expiryDate.toISOString());

			setAutoLogout(remainingMilliseconds);
			statusContext.setStatus({ message: "Sikeres bejelentkezés" });
		} catch (err) {
			setIsAuth(false);
			setAuthLoading(false);
			err.error = true;
			statusContext.setStatus(err);
		}
	};

	const googleLoginHandler = async (UserForm) => {
		const graphqlQuery = userLogin(
			UserForm.email.value,
			UserForm.password.value
		);

		try {
			const resData = await PostData(graphqlQuery);
			loginHandler(UserForm);
		} catch (err) {
			signupHandler(UserForm);
		}
	};

	const autoLogin = async () => {
		const token = localStorage.getItem("token");
		const userId = localStorage.getItem("userId");
		let expiryDate = localStorage.getItem("expiryDate");
		if (!token || !expiryDate || !userId) {
			return;
		}
		try {
			await FetchData("user", userId, "name");
			if (new Date(expiryDate) <= new Date()) {
				logoutHandler();
				return;
			}
			setIsAuth(true);
			setToken(token);
			console.log("AutoLogin is working!");
		} catch (err) {
			console.log(`err`, err);
			logoutHandler();
		}
	};

	const logoutHandler = () => {
		setIsAuth(false);
		setToken(null);
		setUserId(null);
		localStorage.removeItem("token");
		localStorage.removeItem("expiryDate");
		localStorage.removeItem("userId");
		router.push("/");
		statusContext.setStatus({ message: "Sikeres kijelentkezés" });
	};

	const setAutoLogout = (milliseconds) => {
		setTimeout(() => {
			logoutHandler("AUTO LOGED OUT!");
		}, milliseconds);
	};

	return (
		<AuthContext.Provider
			value={{
				reg: signupHandler,
				login: loginHandler,
				googleLoginHandler: googleLoginHandler,
				logout: logoutHandler,
				autoLogin: autoLogin,
				isAdmin: IsAdmin,
				isHOD: IsHOD,
				token: Token,
				userId: UserId,
				isAuth: IsAuth,
				loading: AuthLoading,
				userName: name,
				userNickName: nickName,
				setNickName: setNickName,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
