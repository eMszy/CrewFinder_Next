import React, { useState } from "react";
import { useRouter } from "next/router";

import { createNewUser, userLogin } from "../GraphQl/GraphQLTemplates";
import { PostData } from "../GraphQl/utility";

export const AuthContext = React.createContext({
	isAuth: false,
	loading: false,
	err: null,
	token: null,
	userId: null,
	isAdmin: false,
	isHOD: false,
	reg: () => {},
	login: () => {},
	logout: () => {},
	setErrNull: () => {},
	autoLogin: () => {},
});

const AuthContextProvider = (props) => {
	const [IsAuth, setIsAuth] = useState(false);
	const [IsAdmin, setIsAdmin] = useState(false);
	const [IsHOD, setIsHOD] = useState(false);
	const [AuthLoading, setAuthLoading] = useState(false);
	const [Token, setToken] = useState(null);
	const [UserId, setUserId] = useState(null);
	const [IfError, setIfError] = useState(null);

	const router = useRouter();

	const signupHandler = async (UserForm) => {
		setAuthLoading(true);

		const graphqlQuery = createNewUser(
			UserForm.email.value,
			UserForm.name.value,
			UserForm.password.value
		);

		console.log("Creating a new User: ", UserForm);
		try {
			await PostData(graphqlQuery);
			setIsAuth(false);
			setAuthLoading(false);
		} catch (err) {
			console.log(err);
			setIsAuth(false);
			setAuthLoading(false);
			setIfError(err);
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
			setIsAuth(true);
			setAuthLoading(false);
			setToken(resData.data.login.token);
			setUserId(resData.data.login.userId);
			setIsAdmin(resData.data.login.metaData.isAdmin);
			setIsHOD(resData.data.login.metaData.isHOD);

			localStorage.setItem("token", resData.data.login.token);
			localStorage.setItem("userId", resData.data.login.userId);

			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
			localStorage.setItem("expiryDate", expiryDate.toISOString());

			setAutoLogout(remainingMilliseconds);
		} catch (err) {
			console.log(err);
			setIsAuth(false);
			setAuthLoading(false);
			setIfError(err);
		}
	};

	const autoLogin = () => {
		const token = localStorage.getItem("token");
		let expiryDate = localStorage.getItem("expiryDate");
		if (!token || !expiryDate) {
			return;
		}
		if (new Date(expiryDate) <= new Date()) {
			logoutHandler();
			return;
		}
		setIsAuth(true);
		setToken(token);
		console.log("AutoLogin is working");
	};

	const logoutHandler = (message) => {
		setIsAuth(false);
		setToken(null);
		setUserId(null);
		localStorage.removeItem("token");
		localStorage.removeItem("expiryDate");
		localStorage.removeItem("userId");
		router.push("/");
	};

	const setAutoLogout = (milliseconds) => {
		setTimeout(() => {
			logoutHandler("AUTO LOGED OUT!");
		}, milliseconds);
	};

	const setErrorNull = () => {
		setIfError(null);
	};

	return (
		<AuthContext.Provider
			value={{
				reg: signupHandler,
				login: loginHandler,
				logout: logoutHandler,
				setErrNull: setErrorNull,
				autoLogin: autoLogin,
				isAdmin: IsAdmin,
				isHOD: IsHOD,
				token: Token,
				userId: UserId,
				err: IfError,
				isAuth: IsAuth,
				loading: AuthLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
