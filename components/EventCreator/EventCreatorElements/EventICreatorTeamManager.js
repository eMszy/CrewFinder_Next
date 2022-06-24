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

const EventICreatorTeamManager = ({
	crewMembers,
	department,
	addPosHandel,
	changeHandle,
	deletPosHandel,
	setValid,
	isValid,
	isEventCreatorMain,
	eventPositions,
	isLoading,
}) => {
	const { data: session } = useSession();

	const [fetchedUsers, setFetchedUsers] = useState([]);
	const [crewMemberTarget, setCrewMemberTarget] = useState([]);

	const { selectedEvent, setStatus } = useContext(StateContext);
	console.log("crewMembers", crewMembers);

	// console.log("selectedEvent", selectedEvent);

	useEffect(() => {
		let isAllDirectInputValid = true;
		crewMembers.forEach((crewMember) => {
			if (crewMember.invition.type === "direct" && !crewMember._id) {
				isAllDirectInputValid = false;
			}
			setValid(isAllDirectInputValid);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [crewMembers]);

	const fetchUser = async (e, posName) => {
		console.log("e, posName: ", e.target.value, posName);
		try {
			const res = await fetch(
				`/api/user/search?input=${e.target.value}&pos=${posName}`
			);
			const dataJson = await res.json();

			if (!res.ok || res.error) {
				throw Error(resJson.message);
			}

			const filteredData = dataJson.filter(
				(d) => d._id.toString() !== session.id
			);
			setFetchedUsers(filteredData);
		} catch (err) {
			console.error("Error", err);
			throw new Error({ message: err.message });
		}
	};

	const fetchNumberofUsers = async (pos, attribute) => {
		// console.log("attribute", attribute);
		try {
			const data = await fetch(
				`/api/user/countMatches?pos=${pos}&attribute=${attribute}`
			);
			const dataJson = await data.json();
			return dataJson;
		} catch (err) {
			console.error("Error", err);
			throw new Error({ message: err.message });
		}
	};

	const directInputHandler = (e, f, crewMember = crewMemberTarget) => {
		const target = e.currentTarget;
		if (target.type === "text") {
			changeHandle({
				...crewMember,
				invition: { type: "direct" },
				[target.name]: target.value,
				_id: null,
			});
			if (target.value.length > 2) {
				fetchUser(e, crewMember.posName);
			} else {
				setFetchedUsers([]);
			}
		} else {
			changeHandle({
				...crewMember,
				...f,
				invition: { type: "direct" },
				label: 4,
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
						{crewMembers
							.sort((a, b) => a.id - b.id)
							.map((crewMember, idx) => {
								return (
									<div key={idx} className={classes.BaseTeam_Pos}>
										<div className={classes.BaseTeam_PosTitle}>
											{crewMember.posName}
										</div>
										{crewMember.invition.type === "direct" &&
											(crewMember._id ? (
												<div className={classes.BaseTeam_Pos__Direct}>
													{crewMember.image ? (
														<Image
															src={crewMember.image}
															width={35}
															height={35}
															alt={crewMember.name}
														/>
													) : (
														<div></div>
													)}
													{crewMember.name}
												</div>
											) : (
												<input
													type="text"
													name="name"
													placeholder="Név"
													value={crewMember.name}
													required
													onChange={(e) => {
														setCrewMemberTarget(crewMember);
														directInputHandler(e, null, crewMember);
													}}
												/>
											))}
										{crewMember.invition.type === "attribute" && (
											<div className={classes.BaseTeam_Pos_Attribute}>
												<div>Találtok száma: {crewMember.users?.length}</div>
												{control.departments[department].attribute.map(
													(att, id) => (
														<div key={id}>
															<label htmlFor={att.type}>
																{att.name} -{" "}
																{att.range[crewMember.invition[att.type]]}
															</label>
															<input
																type="range"
																id={id}
																name={att.type}
																min="0"
																max={att.range.length - 1}
																onChange={async (e) => {
																	const findUsers = await fetchNumberofUsers(
																		crewMember.posName,
																		"attribute"
																	);
																	changeHandle({
																		...crewMember,
																		label: 5,
																		invition: {
																			...crewMember.invition,
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
										{crewMember.invition?.type === "open" && (
											<div className={classes.BaseTeam_Pos_Attribut}>
												<div>Találtok száma: {crewMember.users?.length}</div>
											</div>
										)}
										<select
											name="invition"
											value={crewMember.invition.type}
											onChange={async (e) => {
												changeHandle({
													...crewMember,
													name: "",
													_id: null,
													label: 5,
													[e.target.name]: {
														type: e.target.value,
													},
													users: await fetchNumberofUsers(crewMember.posName),
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
											onClick={() => deletPosHandel(crewMember.id)}
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
