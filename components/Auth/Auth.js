import React, { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

import { StateContext } from "../../context/state-context";
import { inputChangedHandler, isAllInputVaild } from "../../shared/utility.js";
import * as InputTemplates from "../../components/UI/Input/InputTemplates/InputTemplates.js";
import InputElement from "../../components/UI/Input/InputElement";
import Button from "../../components/UI/Button/Button";
import crewfinderLogoWhite from "../../public/icons/crewfinderLogoWhite.svg";
import Spinner from "../../components/UI/Spinner/Spinner.js";
import classes from "./Auth.module.scss";

const AuthForm = () => {
	const { status } = useSession();
	// const router = useRouter();

	const { setStatus } = useContext(StateContext);

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

	const signupHandler = async (event) => {
		event.preventDefault();
		try {
			const res = await signIn("SingIn", {
				name: LoginRegForm.name.value,
				email: LoginRegForm.email.value,
				password: LoginRegForm.password.value,
				redirect: false,
			});

			if (!res.ok || res.error) {
				throw Error(res.error);
			}

			setStatus({ message: "Sikeres regisztráció" });
			return res;
		} catch (err) {
			setStatus({ message: err.message, error: true });
		}
	};

	const loginHandler = async (event) => {
		event.preventDefault();
		try {
			const res = await signIn("LogIn", {
				email: LoginRegForm.email.value,
				password: LoginRegForm.password.value,
				redirect: false,
			});
			if (!res.ok || res.error) {
				throw Error(res.error);
			}
			setStatus({ message: "Sikeres belépés" });
			return res;
		} catch (err) {
			setStatus({ message: err.message, error: true });
		}
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

	return (
		<React.Fragment>
			{logoElement}
			<div className={classes.LoginMain__LoginDiv}>
				<form
					onSubmit={IsSignup ? signupHandler : loginHandler}
					className={classes.LoginMain__LoginForm}
				>
					<h2>{IsSignup ? "Regisztráció" : "Belépés"}</h2>
					{status === "loading" || status === "authenticated" ? (
						<div className={classes.Spinner}>
							<Spinner />
						</div>
					) : (
						<InputElement
							Form={LoginRegForm}
							// IsEdit={true}
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

				<div className={classes.LoginMain__LoginForm__LoginBtn}>
					<Button clicked={() => signIn("google")}>
						<div className={classes.LoginIcons}>
							<FcGoogle />
							GOOGLE
						</div>
					</Button>
					<Button clicked={() => signIn("facebook")}>
						<div className={classes.LoginIcons}>
							<BsFacebook />
							FACEBOOK
						</div>
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AuthForm;
