import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import classes from "./Auth.module.scss";
import crewfinderLogoWhite from "../../public/icons/crewfinderLogoWhite.svg";

import Spinner from "../../components/UI/Spinner/Spinner.js";
import { inputChangedHandler, isAllInputVaild } from "../../shared/utility.js";
import * as InputTemplates from "../../components/UI/Input/InputTemplates/InputTemplates.js";
import Button from "../../components/UI/Button/Button";
import { AuthContext } from "../../context/auth-context";
import InputElement from "../../components/UI/Input/InputElement";
import ErrorHandel from "../../shared/errorHandel";

const AuthForm = () => {
	const authContext = useContext(AuthContext);

	const formElmentTemplates = {
		login: {
			email: { ...InputTemplates.email, disabled: false },
			password: { ...InputTemplates.password, disabled: false },
		},
		reg: {
			name: { ...InputTemplates.name, disabled: false },
			email: { ...InputTemplates.email, disabled: false },
			password: { ...InputTemplates.password, disabled: false },
			confirm_password: { ...InputTemplates.confirm_password, disabled: false },
		},
	};

	const [LoginRegForm, setLoginRegForm] = useState(formElmentTemplates.login);
	const [IsSignup, setIsSignup] = useState(false);

	const signupHandler = (event) => {
		event.preventDefault();
		authContext.reg(LoginRegForm);
		switchAuthModeHandler(LoginRegForm.email.value);
	};

	const loginHandler = async (event) => {
		event.preventDefault();
		authContext.login(LoginRegForm);
	};

	const switchAuthModeHandler = (email) => {
		setIsSignup(!IsSignup);
		let formElments = IsSignup
			? formElmentTemplates.login
			: formElmentTemplates.reg;
		if (email !== null) {
			formElments.email = {
				...formElments.email,
				valid: true,
				touched: true,
				value: email,
			};
		}
		setLoginRegForm(formElments);
		authContext.setErrNull();
	};

	if (LoginRegForm.confirm_password) {
		LoginRegForm.confirm_password.valid = false;
		if (LoginRegForm.password.value === LoginRegForm.confirm_password.value) {
			LoginRegForm.confirm_password.valid = true;
		}
	}

	const inputChanged = (event) => {
		setLoginRegForm(inputChangedHandler(event, LoginRegForm));
	};

	let logoElement = (
		<div className={classes.LoginMain__Reglink}>
			<div className={classes.LoginMain__Reglink_Icon}>
				<Link href="/">
					<a>
						<Image
							src={crewfinderLogoWhite}
							alt="Crew Finder"
							width={170}
							height={50}
						/>
					</a>
				</Link>
			</div>
			<p>Szervezd egyszerűen a filmes stábot</p>
			<div className={classes.LoginMain__Reglink_Link}>
				<Button
					clicked={() => {
						switchAuthModeHandler(null);
					}}
				>
					{IsSignup ? "BELÉPÉS" : "REGISZTRÁCIÓ"}
				</Button>
			</div>
		</div>
	);

	let FormElementRender = (
		<React.Fragment>
			{logoElement}
			<form
				onSubmit={IsSignup ? signupHandler : loginHandler}
				className={classes.LoginMain__LoginForm}
			>
				<h2>{IsSignup ? "Regisztráció" : "Belépés"}</h2>
				{authContext.err ? (
					<div className={classes.LoginMain_Error}>
						<ErrorHandel err={authContext.err} />
					</div>
				) : null}
				{authContext.loading ? (
					<Spinner />
				) : (
					<InputElement
						Form={LoginRegForm}
						IsEdit={true}
						changed={inputChanged}
					/>
				)}
				<input
					className={classes.LoginMain__LoginForm__SubmitBtn}
					type="submit"
					name="submit"
					value={IsSignup ? "REGISZTRÁCIÓ" : "BEJELENTKEZÉS"}
					disabled={!isAllInputVaild(LoginRegForm)}
				/>
			</form>
		</React.Fragment>
	);

	return FormElementRender;
};

export default AuthForm;
