import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
	IoAmericanFootballOutline,
	IoCloseCircleOutline,
} from "react-icons/io5";
import { StateContext } from "../../../context/state-context";

import control from "../../../control.json";

import Button from "../../UI/Button/Button";
import classes from "./../EventHandle.module.scss";
import { fetchNumberofUsers, fetchUserFormDirecInput } from "./utility";

const EventICreatorTeamManager = ({
	basePositions,
	department,
	addPosHandel,
	changeHandle,
	deletPosHandel,
	setValid,
	isValid,
	isEventCreatorMain,
}) => {
	const { data: session } = useSession();

	const [fetchedUsers, setFetchedUsers] = useState([]);
	const [crewMemberTarget, setCrewMemberTarget] = useState([]);

	const { selectedEvent, setStatus } = useContext(StateContext);

	useEffect(() => {
		let isAllDirectInputValid = true;
		basePositions.forEach((crewMember) => {
			if (
				crewMember.invition.type === "direct" &&
				(!crewMember.users || !crewMember.users[0]._id)
			) {
				isAllDirectInputValid = false;
			}
		});
		setValid(isAllDirectInputValid);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [basePositions]);

	const directInputHandler = async (e, f, crewMember = crewMemberTarget) => {
		const target = e.currentTarget;
		if (target.type === "text") {
			changeHandle({
				...crewMember,
				invition: { type: "direct" },
				[target.name]: target.value,
				_id: null,
			});
			if (target.value.length > 2) {
				setFetchedUsers(
					await fetchUserFormDirecInput(e.target.value, crewMember.posName)
				);
			} else {
				setFetchedUsers([]);
			}
		} else {
			console.log("f", f, crewMember);

			changeHandle({
				...crewMember,
				name: "",
				invition: { type: "direct" },
				label: 4,
				users: [f],
			});
			setCrewMemberTarget([]);
			setFetchedUsers([]);
		}
	};

	return (
		<div className={classes.EventModal_Input2}>
			<div className={classes.Icon}>
				<IoAmericanFootballOutline />
			</div>
			<div>
				<div>
					<p>
						{isEventCreatorMain ? "Az alap csapatod" : "A beugrós csapatod"}
					</p>
				</div>
				<div className={classes.BaseTeam}>
					<div className={classes.BaseTeam_PosDiv}>
						<div>
							<p>Poziciók</p>
						</div>
						{basePositions.map((position, idx) => {
							return (
								<div key={idx} className={classes.BaseTeam_Pos}>
									<div className={classes.BaseTeam_PosTitle}>
										{position.posName}
									</div>
									{position.invition.type === "direct" &&
										(position.users &&
										position.users.length &&
										position.users[0]._id ? (
											<div className={classes.BaseTeam_Pos__Direct}>
												{position.users[0].image ? (
													<Image
														src={position.users[0].image}
														width={35}
														height={35}
														alt={position.users[0].name}
													/>
												) : (
													<div></div>
												)}
												{position.users[0].name}
											</div>
										) : (
											<input
												type="text"
												name="name"
												placeholder="Név"
												value={position.name}
												required
												onChange={(e) => {
													setCrewMemberTarget(position);
													directInputHandler(e, null, position);
												}}
											/>
										))}
									{position.invition.type === "attribute" && (
										<div className={classes.BaseTeam_Pos_Attribute}>
											<div>Találtok száma: {position.users?.length}</div>
											{control.departments[department].attribute.map(
												(att, id) => (
													<div key={id}>
														<label htmlFor={att.type}>
															{att.name} -{" "}
															{att.range[position.invition[att.type]]}
														</label>
														<input
															type="range"
															id={id}
															name={att.type}
															min="0"
															max={att.range.length - 1}
															onChange={async (e) => {
																const findUsers = await fetchNumberofUsers(
																	position.posName,
																	"attribute"
																);
																changeHandle({
																	...position,
																	label: 5,
																	invition: {
																		...position.invition,
																		[e.target.type]: e.target.value,
																	},
																	users: findUsers,
																});
															}}
														/>
													</div>
												)
											)}
										</div>
									)}
									{position.invition?.type === "open" && (
										<div className={classes.BaseTeam_Pos_Attribut}>
											<div>Találtok száma: {position.users?.length}</div>
										</div>
									)}
									<select
										name="invition"
										value={position.invition.type}
										onChange={async (e) => {
											changeHandle({
												...position,
												name: "",
												_id: null,
												label: 5,
												[e.target.name]: {
													type: e.target.value,
												},
												users: await fetchNumberofUsers(position.posName),
											});
										}}
									>
										{control.invitionType.map((t) => (
											<option key={t.type} value={t.type}>
												{t.name}
											</option>
										))}
									</select>

									<div
										className={classes.Icon}
										onClick={() => deletPosHandel(position._id, position.id)}
									>
										<IoCloseCircleOutline />
									</div>
								</div>
							);
						})}
					</div>

					<div className={classes.BaseTeam_Choice}>
						{!isValid ? (
							<>
								<p>Találatok</p>
								{fetchedUsers.length > 0 ? (
									fetchedUsers.map((f) => (
										<Button
											type="button"
											key={f._id}
											id={f._id}
											value={f.name}
											clicked={(e) => {
												directInputHandler(e, f);
											}}
										>
											<div>{f.name}</div>
											<Image
												src={f.image}
												width={35}
												height={35}
												alt={f.name}
											/>
										</Button>
									))
								) : (
									<div>Kezdj el gépelni</div>
								)}
							</>
						) : (
							<>
								<p>Hozzáadása</p>
								{control.departments[department] &&
									Object.keys(control.departments[department].positions).map(
										(pos, id) => (
											<Button
												clicked={() => addPosHandel(pos, id)}
												type="button"
												key={id}
											>
												{pos}
											</Button>
										)
									)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventICreatorTeamManager;
