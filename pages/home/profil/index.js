import React, { useContext, useState } from "react";
import Head from "next/head";
import { useEffect } from "react";
import { getSession, signOut, useSession } from "next-auth/react";

import { StateContext } from "../../../context/state-context";
import InputElement from "../../../components/UI/Input/InputElement";
import { formTemplate } from "../../../components/UI/Input/InputTemplates/InputTemplates";
import {
	formingData,
	inputChangedHandler,
	isAllInputVaild,
} from "../../../shared/utility";
import Button from "../../../components/UI/Button/Button";
import { List } from "../../../components/Calendar/CalendarElements/List";
import { server } from "../../../config";

import classes from "./Profil.module.scss";

const Profil = ({ formedUser, err }) => {
	Profil.title = "CrewFinder - Profil";
	const { data: session, status } = useSession();

	const stateContext = useContext(StateContext);

	const [DataForm, setDataForm] = useState(formedUser);
	const [IsEdit, setIsEdit] = useState(false);
	const [isDelete, setIsDelete] = useState(false);

	useEffect(() => {
		if (err) {
			stateContext.setStatus({
				message: err,
				error: true,
			});
		}
	}, [err]);

	// const fetchData = async () => {
	// 	try {
	// const fData = await EditForm(formTemplate, Id, Collection);
	// 		setDataForm(fData);
	// 		console.log("fData", fData);
	// 	} catch (err) {
	// 		stateContext.setStatus(err);
	// 	}
	// };

	const editModeHandler = async () => {
		if (!IsEdit) {
			setIsEdit(true);
		} else {
			setIsEdit(false);

			let subPlusData = {};
			if (DataForm) {
				for (const [key] of Object.entries(DataForm)) {
					if (
						DataForm[key].elementConfig.editable &&
						DataForm[key].touched &&
						DataForm[key].valid
					) {
						let subfolder = DataForm[key].elementConfig.subfolder;
						subPlusData[subfolder] = {
							...subPlusData[subfolder],
							[key]: DataForm[key].value,
						};
					}
				}
			}

			try {
				if (Object.keys(subPlusData).length !== 0) {
					const res = await fetch("/api/user/" + session.id, {
						method: "PUT",
						body: JSON.stringify(subPlusData),
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (res.ok) {
						stateContext.setStatus(await res.json());
					}
				}
			} catch (err) {
				stateContext.setStatus(await res.json());
			}
			// 	fetchData();
		}
	};

	const inputChanged = (event) => {
		setDataForm(inputChangedHandler(event, DataForm));
	};

	const deletBtnHendle = async () => {
		if (isDelete) {
			const res = await fetch("/api/user/" + session.id, {
				method: "DELETE",
			});
			if (res.ok) {
				stateContext.setStatus(await res.json());
				signOut();
			}
		} else {
			setIsDelete(true);
			stateContext.setStatus({
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
					<div
						className={!IsEdit ? classes.SubmitBtn : classes.SubmitBtn_EditMode}
					>
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

export const getServerSideProps = async (context) => {
	try {
		const session = await getSession(context);
		const res = await fetch(`${server}/api/user/` + session.id);
		const user = await res.json();
		const formedUser = formingData(user, formTemplate);
		return { props: { formedUser } };
	} catch (err) {
		console.log("err", err.message);
		return { props: { err: err.message } };
	}
};

export default Profil;
