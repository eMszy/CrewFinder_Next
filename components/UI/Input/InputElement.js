import React from "react";

import Input from "./Input";

const InputElement = (props) => {
	let formElementsArray = [];

	for (let key in props.Form) {
		formElementsArray.push({
			id: key,
			config: props.Form[key],
		});
	}

	let formInput = formElementsArray.map((formElement) => (
		<Input
			key={formElement.id}
			label={formElement.config.elementConfig.title}
			name={formElement.id}
			elementType={formElement.config.elementType}
			elementConfig={formElement.config.elementConfig}
			value={formElement.config.value}
			invalid={!formElement.config.valid}
			shouldValidate={formElement.config.validation}
			touched={formElement.config.touched}
			changed={(event) => {
				props.changed(event);
			}}
			disabled={
				props.IsDisabled && formElement.config.elementConfig.editable
					? null
					: formElement.config.disabled
			}
		/>
	));

	return formInput;
};

export default InputElement;
