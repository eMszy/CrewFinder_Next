import React, { useContext } from "react";
import { StateContext } from "../../../context/state-context";

import classes from "./Labels.module.scss";

const Labels = () => {
	const { labels, updateLabel } = useContext(StateContext);

	return (
		<div className={classes.SmallCal_labels}>
			<p>Események</p>
			{labels.map(({ label: lbl, checked }, idx) => (
				<label key={idx} className="items-center mt-3 block">
					<input
						type="checkbox"
						checked={checked}
						onChange={() => updateLabel({ label: lbl, checked: !checked })}
					/>
					<span style={{ color: lbl }}>{lbl}</span>
				</label>
			))}
		</div>
	);
};

export default Labels;
