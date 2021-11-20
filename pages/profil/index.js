import { useRouter } from "next/router";
import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context/auth-context";
import { StatusContext } from "../../context/status-context";
import { EditForm, SavingHandel } from "../../GraphQl/utility";
import InputElement from "../../components/UI/Input/InputElement";
import { formTemplate } from "../../components/UI/Input/InputTemplates/InputTemplates";
import { inputChangedHandler } from "../../shared/utility";
import Button from "../../components/UI/Button/Button";
import ErrorHandel from "../../shared/errorHandel";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./Profil.module.scss";

const Profil = () => {
	Profil.title = "CrewFinder - Profil";

	const authContext = useContext(AuthContext);
	const router = useRouter();

	let Id;

	if (typeof window !== "undefined") {
		Id = localStorage.getItem("userId");
	}

	const Collection = "user";
	const OutputData =
		"name email userData {address {postCode city street} connectInfo {nickName tel facebook	imdb dob gender}} createdAt updatedAt ";

	const [DataForm, setDataForm] = useState();
	const [Saving, setSaving] = useState(false);
	const [IfError, setIfError] = useState(null);
	const [IsEdit, setIsEdit] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isDataFetched = useRef(false);
	const isFirstRun = useRef(true);
	const saveTimer = 5 * 1000;

	const fetchData = async () => {
		setIsLoading(true);
		const fData = await EditForm(formTemplate, Id, Collection, OutputData);
		setDataForm(fData);
		isDataFetched.current = true;
		setIsLoading(false);
	};

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			router.push("/");
			authContext.logout();
			return;
		}
		if (!authContext.isAuth) {
			authContext.autoLogin();
		}
		fetchData();
	}, []);

	useEffect(() => {
		setIfError(null);
		setSaving(true);
		let timer1 = setTimeout(() => {
			SavingHandel(Id, DataForm, Collection);
			setSaving(false);
			setIsEdit(false);
		}, saveTimer);
		return () => {
			clearTimeout(timer1);
		};
	}, [DataForm]);

	const editModeHandler = () => {
		setIsEdit(!IsEdit);
	};

	const inputChanged = (event) => {
		setDataForm(inputChangedHandler(event, DataForm));
	};

	let Message = <p className={classes.Green}>Mentve</p>;
	if (IfError) Message = <ErrorHandel err={IfError} />;

	let SavingSpinner = <div></div>;

	if (Saving) SavingSpinner = <Spinner />;
	if (!IsEdit) {
		SavingSpinner = (
			<React.Fragment>
				<Button clicked={editModeHandler}>Szerkesztés</Button>
				{Message}
			</React.Fragment>
		);
	}

	return (
		<>
			<Head>
				<title>CrewFinder - Profil</title>
			</Head>
			<div className={classes.Profil}>
				<div className={classes.Profil_Panels}>
					<h2>Eseményeid</h2>
				</div>
				<div className={classes.Profil_Panels}>
					<form className={classes.Profil_Form}>
						<h2>A Profilod</h2>
						<div className={classes.Profil_SavingSpinner}>
							<div>{SavingSpinner}</div>
						</div>
						{isLoading ? (
							<div className={classes.Profil_SavingSpinner}>
								<Spinner />
							</div>
						) : (
							<InputElement
								Form={DataForm}
								changed={inputChanged}
								IsDisabled={IsEdit}
							/>
						)}
					</form>
					<div className={classes.DeleteBtn}>
						<Button>A profilom törlése</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profil;
