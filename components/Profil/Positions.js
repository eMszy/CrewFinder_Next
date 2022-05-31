import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";

import { StateContext } from "../../context/state-context";
import Button from "../UI/Button/Button";
import control from "../../control.json";

import classes from "./Positions.module.scss";

const Positions = ({ user }) => {
	const stateContext = useContext(StateContext);

	const [department, setDepartment] = useState("");
	const [positions, setPositions] = useState([]);
	const [yourPositions, setYourPositions] = useState(user?.metaData.positions);
	const [filteredDepts, setFilteredDepts] = useState(
		Object.keys(control.departments).filter((dep) => dep !== "Privát")
	);

	// console.log("yourPositions", yourPositions);
	// console.log("user", user._id, session.id);
	// console.log("status", status);
	// console.log("filteredDepts", filteredDepts);

	const openDepHandler = (dep) => {
		setDepartment((currentDept) => {
			if (dep === currentDept) {
				setPositions([]);
				return "";
			} else {
				setPositions(Object.keys(control.departments[dep].positions));
				return dep;
			}
		});
	};

	const addRemovePosHandler = (pos) => {
		if (!yourPositions?.includes(pos)) {
			setYourPositions((currentPos) => [pos, ...currentPos]);
		} else {
			const updatedPos = yourPositions.filter((p) => p !== pos);
			setYourPositions(updatedPos);
		}
	};

	const submitHandler = async () => {
		try {
			const res = await fetch("/api/user/" + user._id, {
				method: "PUT",
				body: JSON.stringify({ positions: yourPositions, type: "positions" }),
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
			<h2>Pozicióid</h2>
			<div className={classes.Position_Panels__Departments}>
				<div className={classes.Position_Panels__Departments_Divs}>
					<div>Részlegek</div>
					{filteredDepts.map((dep) => (
						<Button
							btnType={dep === department && "Success"}
							key={dep}
							clicked={() => {
								openDepHandler(dep);
							}}
							value={dep}
						>
							{dep}
						</Button>
					))}
				</div>
				<div className={classes.Position_Panels__Departments_Divs}>
					<div>Pozicíók</div>
					{department !== "" &&
						positions.map((pos) => (
							<Button
								key={pos}
								clicked={() => {
									addRemovePosHandler(pos);
								}}
								value={pos}
							>
								{pos}
							</Button>
						))}
				</div>
				<div className={classes.Position_Panels__Departments_Divs}>
					<div>Te pozicióid</div>
					{yourPositions?.map((yourPos) => (
						<div key={yourPos} value={yourPos}>
							<div
								className={classes.Position_Panels__Departments_Divs__YourPos}
							>
								{yourPos}
								<IoClose onClick={() => addRemovePosHandler(yourPos)} />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={classes.SubmitBtn_EditMode}>
				<Button clicked={submitHandler}>Mentés</Button>
			</div>
		</>
	);
};

export default Positions;
