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

import { server } from "../../../config";
import control from "../../../control.json";

import classes from "./Profil.module.scss";

const Profil = ({ formedUser, user, err }) => {
	Profil.title = "CrewFinder - Profil";

	const { data: session, status } = useSession();

	const stateContext = useContext(StateContext);
	const [DataForm, setDataForm] = useState(formedUser);
	const [IsEdit, setIsEdit] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [positions, setPositions] = useState(user.metaData.positions);
	const [filteredDepts, setFilteredDepts] = useState(
		Object.keys(control.departments).filter((dep) => dep !== "Privát")
	);

	//sorbarendezni a pozikat
	// useEffect(()=>{},[positions])

	useEffect(() => {
		if (err) {
			stateContext.setStatus({
				message: err,
				error: true,
			});
		}
		// eslint-disable-next-line
	}, [err]);

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
						body: JSON.stringify({ subPlusData, type: "userData" }),
						headers: {
							"Content-Type": "application/json",
						},
					});

					const resJson = await res.json();

					if (!res.ok || res.error) {
						throw Error(resJson.message);
					}
					stateContext.setStatus(resJson);
					return resJson;
				}
			} catch (err) {
				setStatus({ message: err.message, error: true });
			}
		}
	};

	const inputChanged = (event) => {
		setDataForm(inputChangedHandler(event, DataForm));
	};

	const deletBtnHendle = async () => {
		if (isDelete) {
			try {
				const res = await fetch("/api/user/" + session.id, {
					method: "DELETE",
				});

				if (!res.ok || res.error) {
					throw Error(res.error);
				}

				stateContext.setStatus({
					message: "Sikeres törölted a regisztrációdat",
					err: true,
				});
				signOut();
				return res;
			} catch (err) {
				stateContext.setStatus({ message: err.message, error: true });
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
	const addRemoveDep = (dep) => {
		let updatedDep = [];
		if (departments.includes(dep)) {
			updatedDep = departments.filter((d) => d !== dep);
		} else {
			updatedDep = [...departments, dep];
		}
		setDepartments(updatedDep);
	};

	const addPositions = (pos) => {
		if (!positions.includes(pos)) {
			setPositions([...positions, pos]);
		}
	};

	const removePositions = (pos) => {
		const updatedPos = positions.filter((p) => p !== pos);
		setPositions(updatedPos);
	};

	const submitHandler = async () => {
		console.log("session", session);

		try {
			const res = await fetch("/api/user/" + session.id, {
				method: "PUT",
				body: JSON.stringify({ positions, type: "positions" }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const resJson = await res.json();

			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}
			stateContext.setStatus(resJson);
			return resJson;
		} catch (err) {
			stateContext.setStatus({ message: err.message, error: true });
		}
	};

	return (
		<>
			<Head>
				<title>{Profil.title}</title>
			</Head>
			<div className={classes.Profil}>
				{/* <div className={classes.Profil_Panels}>
					<List />
				</div> */}
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
				<div className={classes.Profil_Panels}>
					<h2>Pozicióid</h2>
					<div className={classes.Profile_PosPanel}>
						<div className={classes.Profil_Panels__Departments}>
							<div>Részlegek</div>
							<div>Pozicíók</div>
							<div>Te pozicióid</div>
						</div>
						<div className={classes.Profil_Panels__Departments}>
							{filteredDepts.map((dep) => (
								<>
									<div className={classes.Profil_Panels__Department}>
										<Button
											clicked={() => {
												addRemoveDep(dep);
											}}
											value={dep}
										>
											{dep}
										</Button>
									</div>
									{departments.includes(dep) &&
										Object.keys(control.departments[dep].positions).map(
											(pos) => (
												<div
													key={pos}
													className={classes.Profil_Panels__Positions}
												>
													<Button
														clicked={() => {
															addPositions(pos);
														}}
														value={pos}
													>
														{pos}
													</Button>
												</div>
											)
										)}
								</>
							))}

							{positions.map((pos) => (
								<div key={pos} className={classes.Profil_Panels__YourPositions}>
									<Button
										clicked={() => {
											removePositions(pos);
										}}
										value={pos}
									>
										{pos}
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className={classes.SubmitBtn_EditMode}>
						<Button clicked={submitHandler}>Mentés</Button>
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
		return { props: { formedUser, user, session } };
	} catch (err) {
		console.log("err", err.message);
		return { props: { err: err.message } };
	}
};

export default Profil;
