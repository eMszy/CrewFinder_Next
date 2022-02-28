import { useRouter } from "next/router";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/auth-context";
import { StatusContext } from "../../context/status-context";
import { DeleteHandel, EditForm, SavingHandel } from "../../GraphQl/utility";
import InputElement from "../../components/UI/Input/InputElement";
import { formTemplate } from "../../components/UI/Input/InputTemplates/InputTemplates";
import { inputChangedHandler, isAllInputVaild } from "../../shared/utility";
import Button from "../../components/UI/Button/Button";

import classes from "./Profil.module.scss";
import { List } from "../../components/Calendar/CalendarElements/List";

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
	const [isDelete, setIsDelete] = useState(false);

	const fetchData = async () => {
		try {
			const fData = await EditForm(formTemplate, Id, Collection, OutputData);
			setDataForm(fData);
			console.log("fData", fData);
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

	useEffect(() => {
		if (DataForm && DataForm.nickName && DataForm.nickName.value) {
			authContext.setNickName(DataForm.nickName.value);
		}
	}, [DataForm?.nickName.value]);

	const editModeHandler = async () => {
		if (!IsEdit) {
			setIsEdit(true);
		} else {
			setIsEdit(false);
			try {
				await SavingHandel(Id, DataForm, Collection);
				statusContext.setStatus({ message: "Sikeres mentés" });
			} catch (err) {
				statusContext.setStatus({ message: err, error: true });
			}
			fetchData();
		}
	};

	const inputChanged = (event) => {
		setDataForm(inputChangedHandler(event, DataForm));
	};

	const deletBtnHendle = () => {
		if (isDelete) {
			DeleteHandel(Id);
			statusContext.setStatus({
				message: "Sikeresen törölted a regisztrációdat",
				error: true,
			});
			authContext.logout();
		} else {
			setIsDelete(true);
			statusContext.setStatus({
				message:
					"Biztos hogy törlöd a Profilodat? Így az általad létrehozott eseményeid is törlésre kerülnek!",
				error: true,
			});
		}
	};

	return (
		<>
			<Head>
				<title>{Profil.title}</title>
			</Head>
			<div className={classes.Profil}>
				<div className={classes.Profil_Panels}>
					<List />
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
					<div className={!isDelete ? classes.DeleteBtn : classes.DeleteAlert}>
						<Button clicked={() => deletBtnHendle()}>
							{!isDelete ? "A profilom törlése" : "Igen, törlöm"}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profil;
