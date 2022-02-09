import React, { useContext } from "react";
import { StateContext } from "../../../context/state-context";
import { findColor } from "../../../shared/utility";

const Filter = () => {
	const { labels, updateLabel } = useContext(StateContext);
	return (
		<>
			<h3>Szürők</h3>
			{labels.map((l, idx) => (
				<div
					key={idx}
					onClick={() => updateLabel({ ...l, checked: !l.checked })}
					style={{ backgroundColor: l.checked && findColor(l.id) }}
				>
					{l.title}
				</div>
			))}
		</>
	);
};

export default Filter;
