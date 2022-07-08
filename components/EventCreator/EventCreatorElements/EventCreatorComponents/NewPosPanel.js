import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import Button from "../../../UI/Button/Button";
import control from "../../../../control.json";

import classes from "../../EventHandle.module.scss";
import {
	fetchNumberofUsers,
	fetchUserFormDirecInput,
	getBackgorund,
} from "../utility";

const NewPosPanel = ({
	datesHelper,
	department,
	setUpdatedPos,
	setSelectedEventPositions,
	setIsNewPos,
	setLabelHandel,
	labelHandel,
}) => {
	const [newPosName, setNewPosName] = useState(
		Object.keys(control.departments[department].positions).pop()
	);
	const [newPosType, setNewPosType] = useState("open");
	const [newPosUsers, setNewPosUsers] = useState([]);
	const [newPosAttributes, setNewPosAttributes] = useState();
	const [directInvitionTypeing, setDirectInvitionTypeing] = useState("");
	const [fetchedUsers, setFetchedUsers] = useState([]);
	const [directInviteUser, setDirectInviteUser] = useState();

	const submitHandel = (e) => {
		e.preventDefault();
		const newPos = {
			id: newPosName + Math.floor(Math.random() * (9999 - 1000) + 1),
			posName: newPosName,
			invition: {
				type: newPosType,
				attribute: newPosAttributes,
			},
			dates: datesHelper,
			users: newPosType !== "direct" ? newPosUsers : [directInviteUser],
			chosenOne: newPosType === "direct" ? directInviteUser._id : null,
			label: labelHandel,
			resigned: [],
			invited: newPosType !== "direct" ? newPosUsers : [directInviteUser],
			directInvited: [directInviteUser],
			applied: [],
			confirmed: [],
			creator: [],
		};
		setUpdatedPos((currentData) => [...currentData, newPos]);
		setSelectedEventPositions((currentData) => [...currentData, newPos]);
		setIsNewPos(false);
	};

	useEffect(() => {
		const posAttributes = {};
		control.departments[department].attribute.map((att) =>
			Object.assign(posAttributes, { [att.type]: 0 })
		);
		setNewPosAttributes(posAttributes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let newLabel = 5;
		if (newPosType === "direct") {
			newLabel = 4;
		} else {
			setFetchedUsers([]);
			setDirectInviteUser();
		}
		setLabelHandel(newLabel);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newPosType]);

	useEffect(() => {
		const findUsers = async () => {
			const users = await fetchNumberofUsers(newPosName, "attribute");
			setNewPosUsers(users);
		};
		findUsers();
	}, [newPosName, newPosAttributes]);

	useEffect(() => {
		if (directInvitionTypeing.length > 2) {
			const fetchingDirectInputUsers = async () => {
				setFetchedUsers(
					await fetchUserFormDirecInput(directInvitionTypeing, newPosName)
				);
			};
			fetchingDirectInputUsers();
		} else {
			setFetchedUsers([]);
		}
	}, [directInvitionTypeing, newPosName]);

	return (
		<div
			className={classes.acceptorDates_MainDiv}
			style={getBackgorund(labelHandel)}
		>
			<div className={classes.acceptorDates_SubDiv}>
				<div className={classes.acceptorDates}>
					<div className={classes.acceptorDates_Pos}>
						<select
							name="invition"
							value={newPosName}
							onChange={async (e) => setNewPosName(e.target.value)}
						>
							{Object.values(control.departments[department].positions).map(
								(t) => (
									<option key={t.type} value={t.type}>
										{t.name}
									</option>
								)
							)}
						</select>
						<select
							name="invition"
							value={newPosType}
							onChange={(e) => setNewPosType(e.target.value)}
						>
							{control.invitionType
								.filter((t) => t.type !== "creator")
								.map((t) => (
									<option key={t.type} value={t.type}>
										{t.name}
									</option>
								))}
						</select>
						<p className={classes.Text400}>Találatok: {newPosUsers.length}</p>
						<p className={classes.Text400}>Napok: {datesHelper.length}</p>
					</div>
					<div
						className={[classes.Span2, classes.acceptorDates_Candidates].join(
							" "
						)}
					>
						{newPosType === "direct" && (
							<div
								className={
									!directInviteUser
										? classes.acceptorDates_Candidates_Direct
										: classes.acceptorDates_Candidates_Attributes
								}
							>
								{!directInviteUser ? (
									<>
										<input
											type="text"
											name="name"
											placeholder="Név"
											value={directInvitionTypeing}
											required
											onChange={(e) => setDirectInvitionTypeing(e.target.value)}
										/>
										<div className={classes.acceptorDates_Candidates_Message}>
											{directInvitionTypeing.length > 2 ? (
												fetchedUsers.length ? (
													<p>Találatok</p>
												) : (
													<p>Nincs találat</p>
												)
											) : (
												<p>Kezdj el gépelni</p>
											)}
											<div>
												{fetchedUsers.map((pos, idx) =>
													idx < 9 ? (
														<div
															key={pos._id}
															id={pos._id}
															className={[
																classes.acceptorDates_Candidates_Grid,
																// theChosenOnes.posId === pickedPos._id &&
																// 	theChosenOnes.userId === pos._id &&
																// 	classes.acceptorDates_Candidates_Chosen,
															].join(" ")}
															onClick={() => setDirectInviteUser(pos)}
														>
															<div
																className={classes.acceptorDates_Candidates_Img}
															>
																<Image
																	src={pos.image}
																	width={35}
																	height={35}
																	alt={pos.name}
																/>
															</div>
															<p>{pos.name}</p>
															<p className={classes.Text400}>XP: X</p>
															<p className={classes.Text400}>Értékelés: X</p>
														</div>
													) : (
														<div>További találatok...</div>
													)
												)}
											</div>
										</div>
									</>
								) : (
									<div className={classes.acceptorDates_Choosen_Grid}>
										<div className={classes.acceptorDates_Candidates_Img}>
											<Image
												src={directInviteUser.image}
												width={35}
												height={35}
												alt={directInviteUser.name}
											/>
										</div>
										<div>{directInviteUser.name}</div>
										<div>
											<p className={classes.Text400}>XP: X</p>
											<p className={classes.Text400}>Értékelés: X</p>
										</div>

										<div
											className={`${classes.Icon}  ${classes.Buttom2}`}
											onClick={() => {
												setDirectInviteUser();
												setDirectInvitionTypeing("");
												setFetchedUsers([]);
											}}
										>
											<IoClose />
										</div>
									</div>
								)}
							</div>
						)}

						{newPosType === "open" && (
							<div className={classes.acceptorDates_Candidates_Attributes}>
								Mi kéne ide a nyilt megkeresésnél?
							</div>
						)}
						{newPosType === "attribute" && (
							<div className={classes.acceptorDates_Candidates_Attributes}>
								{control.departments[department].attribute.map((att, id) => (
									<div
										key={id}
										className={classes.acceptorDates_Candidates_Attribute}
									>
										<p>{att.name}</p>
										<label htmlFor={att.type}>
											<p className={classes.Text400}>
												{att.range[newPosAttributes[att.type]]}
											</p>
										</label>
										<input
											type="range"
											id={id}
											name={att.type}
											min={0}
											max={att.range.length - 1}
											value={newPosAttributes[att.type]}
											onChange={async (e) => {
												setNewPosAttributes((currentData) => {
													return {
														...currentData,
														[att.type]: +e.target.value,
													};
												});
											}}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			{(newPosType !== "direct" || (fetchedUsers && directInviteUser)) && (
				<div className={classes.acceptorDates_AddBtn}>
					<Button
						btnType="Success"
						clicked={(e) => submitHandel(e)}
						disabled={!datesHelper.length}
					>
						Hozzá addás
					</Button>
				</div>
			)}
		</div>
	);
};

export default NewPosPanel;
