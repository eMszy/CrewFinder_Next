import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import {
	IoAmericanFootballOutline,
	IoCloseCircleOutline,
} from "react-icons/io5";

import control from "../../../control.json";

import Button from "../../UI/Button/Button";
import classes from "./../EventModal.module.scss";

const EventInvition = ({
	crewMembers,
	department,
	addPosHandel,
	changeHandle,
	deletPosHandel,
}) => {
	const { data: session } = useSession();

	const [fetchedUsers, setFetchedUsers] = useState([]);
	const [crewMemberTarget, setCrewMemberTarget] = useState([]);

	const fetchUser = async (e) => {
		try {
			const data = await fetch(`/api/user/search?input=${e.target.value}`);
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

	const directInputHandler = (e, crewMember = crewMemberTarget) => {
		const target = e.currentTarget;
		if (target.type === "text") {
			changeHandle({
				...crewMember,
				[target.name]: target.value,
			});
			if (target.value.length !== 0) {
				fetchUser(e);
			}
		} else {
			changeHandle({
				...crewMember,
				name: target.value,
				_id: target.id,
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
										{crewMember.invitionType?.name === "direct" ? (
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
										) : crewMember.invitionType?.name === "attribute" ? (
											<div className={classes.BaseTeam_Pos_Attribute}>
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
																onChange={(e) =>
																	changeHandle({
																		...crewMember,
																		invitionType: {
																			...crewMember.invitionType,
																			[e.target.name]: e.target.value,
																		},
																	})
																}
															/>
														</div>
													)
												)}
											</div>
										) : (
											<div></div>
										)}
										<select
											name="invitionType"
											value={crewMember.invitionType?.name}
											onChange={(e) =>
												changeHandle({
													...crewMember,
													[e.target.name]: {
														name: e.target.value,
													},
												})
											}
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
						{fetchedUsers.length !== 0 && (
							<div className={classes.BaseTeam_SearchBox}>
								{fetchedUsers.map((f) => (
									<div key={f._id} className={classes.SearchDiv}>
										<Button
											type="button"
											id={f._id}
											value={f.name}
											clicked={(e) => {
												directInputHandler(e);
											}}
										>
											<Image
												src={f.image}
												width={35}
												height={35}
												alt={f.name}
											/>
											<div>{f.name}</div>
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
					<div className={classes.BaseTeam_Choice}>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventInvition;
