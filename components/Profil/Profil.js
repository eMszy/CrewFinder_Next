import React, { useContext, useState } from "react";
import { signOut } from "next-auth/react";

import { StateContext } from "../../context/state-context";
import { inputChangedHandler, isAllInputVaild } from "../../shared/utility";

import InputElement from "../UI/Input/InputElement";
import Button from "../UI/Button/Button";

import classes from "./Profil.module.scss";

const Profil = ({ formedUser, user }) => {
	const stateContext = useContext(StateContext);

	const [DataForm, setDataForm] = useState(formedUser);
	const [IsEdit, setIsEdit] = useState(false);
	const [isDelete, setIsDelete] = useState(false);

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
					const res = await fetch("/api/user/" + user._id, {
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
				const res = await fetch("/api/user/" + user._id, {
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

	return (
		<>
			<div className={classes.Profil}>
				<div className={classes.Profil_Panels}>
					<h2>A Profilod</h2>
					<form className={classes.Profil_Form}>
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

export default Profil;
