import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
	IoAmericanFootballOutline,
	IoCloseCircleOutline,
} from "react-icons/io5";

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
}) => {
	const { data: session } = useSession();

	const [fetchedUsers, setFetchedUsers] = useState([]);
	const [crewMemberTarget, setCrewMemberTarget] = useState([]);

	useEffect(() => {
		let isAllDirectInputValid = true;
		crewMembers.forEach((crewMember) => {
			if (crewMember.invitionType.name === "direct" && !crewMember._id) {
				isAllDirectInputValid = false;
			}
			setValid(isAllDirectInputValid);
		});
		// eslint-disable-next-line
	}, [crewMembers]);

	const fetchUser = async (e, pos) => {
		try {
			const data = await fetch(
				`/api/user/search?input=${e.target.value}&pos=${pos}`
			);
			const dataJson = await data.json();
			if (data.ok) {
				const filteredData = dataJson.filter(
					(d) => d._id.toString() !== session.id
				);
				setFetchedUsers(filteredData);
			}
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

	const directInputHandler = (e, crewMember = crewMemberTarget) => {
		const target = e.currentTarget;
		if (target.type === "text") {
			changeHandle({
				...crewMember,
				[target.name]: target.value,
				_id: null,
			});
			if (target.value.length > 2) {
				fetchUser(e, crewMember.pos);
			} else {
				setFetchedUsers([]);
			}
		} else {
			changeHandle({
				...crewMember,
				name: target.value,
				_id: target.id,
				// image: target.image,
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
					<p>Az csapatod:</p>
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
											{crewMember.pos}
										</div>
										{crewMember.invitionType?.name === "direct" &&
											(crewMember._id ? (
												<div className={classes.BaseTeam_Pos__Direct}>
													{crewMember.name}
													{/* <Image
														src={crewMember.image}
														width={35}
														height={35}
														alt={crewMember.name}
													/> */}
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
														directInputHandler(e, crewMember);
													}}
												/>
											))}
										{crewMember.invitionType?.name === "attribute" && (
											<div className={classes.BaseTeam_Pos_Attribute}>
												<div>
													Találtok száma:{" "}
													{crewMember.invitionType.result.length}
												</div>
												{control.departments[department].attribute.map(
													(att, id) => (
														<div key={id}>
															<label htmlFor={att.type}>
																{att.name} -{" "}
																{att.range[crewMember.invitionType[att.type]]}
															</label>
															<input
																type="range"
																id={id}
																name={att.type}
																min="0"
																max={att.range.length - 1}
																onChange={async (e) => {
																	const findUsers = await fetchNumberofUsers(
																		crewMember.pos,
																		"attribute"
																	);
																	changeHandle({
																		...crewMember,
																		label: 5,
																		invitionType: {
																			...crewMember.invitionType,
																			[e.target.name]: e.target.value,
																			result: findUsers,
																		},
																	});
																}}
															/>
														</div>
													)
												)}
											</div>
										)}
										{crewMember.invitionType?.name === "open" && (
											<div className={classes.BaseTeam_Pos_Attribut}>
												<div>
													Találtok száma:{" "}
													{crewMember.invitionType.result?.length}
												</div>
											</div>
										)}
										<select
											name="invitionType"
											value={crewMember.invitionType?.name}
											onChange={async (e) => {
												changeHandle({
													...crewMember,
													name: "",
													_id: null,
													label: 5,
													[e.target.name]: {
														name: e.target.value,
														result: await fetchNumberofUsers(crewMember.pos),
													},
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
												directInputHandler(e);
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
