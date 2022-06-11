import React from "react";

import classes from "./Input.module.scss";

const Input = (props) => {
	let inputElement = null;
	const inputClasses = [classes.InputElement];

	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
	}

	switch (props.elementType) {
		case "input":
			inputElement = (
				<input
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
					name={props.name}
					disabled={props.disabled}
				/>
			);
			break;
		case "textarea":
			inputElement = (
				<textarea
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
					name={props.name}
					disabled={props.disabled}
				/>
			);
			break;
		case "select":
			inputElement = (
				<select
					className={inputClasses.join(" ")}
					value={props.value}
					onChange={props.changed}
					name={props.name}
					disabled={props.disabled}
				>
					{props.elementConfig.options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.displayValue}
						</option>
					))}
				</select>
			);
			break;
		default:
			inputElement = (
				<input
					className={inputClasses.join(" ")}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
					name={props.name}
					disabled={props.disabled}
				/>
			);
	}

	return (
		<React.Fragment>
			<label className={classes.Label} htmlFor={props.name}>
				{props.label}
			</label>
			{inputElement}
		</React.Fragment>
	);
};

export default Input;
