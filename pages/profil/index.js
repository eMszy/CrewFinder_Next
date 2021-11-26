import { useRouter } from "next/router";
import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context/auth-context";
import { StatusContext } from "../../context/status-context";
import { EditForm, SavingHandel } from "../../GraphQl/utility";
import InputElement from "../../components/UI/Input/InputElement";
import { formTemplate } from "../../components/UI/Input/InputTemplates/InputTemplates";
import { inputChangedHandler, isAllInputVaild } from "../../shared/utility";
import Button from "../../components/UI/Button/Button";
// import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./Profil.module.scss";

const Profil = () => {
	Profil.title = "CrewFinder - Profil";

	const authContext = useContext(AuthContext);
	const statusContext = useContext(StatusContext);

	const router = useRouter();

	let Id;

	if (typeof window !== "undefined") {
		Id = localStorage.getItem("userId");
	}

	const Collection = "user";
	const OutputData =
		"name email userData {address {postCode city street} connectInfo {nickName tel facebook	imdb dob gender}} createdAt updatedAt ";

	const [DataForm, setDataForm] = useState();
	const [IsEdit, setIsEdit] = useState(false);

	const fetchData = async () => {
		try {
			const fData = await EditForm(formTemplate, Id, Collection, OutputData);
			setDataForm(fData);
		} catch (err) {
			statusContext.setStatus(err);
		}
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

	const editModeHandler = async () => {
		if (!IsEdit) {
			setIsEdit(true);
		} else {
			setIsEdit(false);
			try {
				await SavingHandel(Id, DataForm, Collection);
			} catch (err) {
				statusContext.setStatus(err);
			}
			fetchData();
		}
	};

	const inputChanged = (event) => {
		const test = inputChangedHandler(event, DataForm);
		setDataForm(inputChangedHandler(event, DataForm));
	};

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
						<InputElement
							Form={DataForm}
							changed={inputChanged}
							IsDisabled={IsEdit}
						/>
					</form>
					<div className={classes.SubmitBtn}>
						<Button
							clicked={editModeHandler}
							disabled={!isAllInputVaild(DataForm)}
						>
							{IsEdit ? "Mentés" : "Módósítás"}
						</Button>
					</div>
					<div className={classes.DeleteBtn}>
						<Button>A profilom törlése</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profil;
