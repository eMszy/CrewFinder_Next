import React from "react";

import classes from "./Button.module.scss";

const Button = (props) => (
	<button
		disabled={props.disabled}
		className={[classes.Button, classes[props.btnType]].join(" ")}
		onClick={props.clicked}
		type={props.type}
		value={props.value}
		id={props.id}
	>
		{props.children}
	</button>
);

export default Button;
