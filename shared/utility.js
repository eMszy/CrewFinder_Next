const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties,
	};
};

export const inputChangedHandler = (event, form) => {
	const controlName = event.target.name;
	const updatedControls = updateObject(form, {
		[controlName]: updateObject(form[controlName], {
			value: event.target.value,
			valid: checkValidity(event.target.value, form[controlName].validation),
			touched: true,
		}),
	});
	return updatedControls;
};

export const isAllInputVaild = (Form) => {
	let isAllValid = true;
	for (const element in Form) {
		if (!Form[element].valid) {
			isAllValid = false;
		}
	}
	return isAllValid;
};

export const checkValidity = (value, rules) => {
	let isValid = true;
	if (!rules) {
		return true;
	}

	if (rules.required) {
		isValid = value.trim() !== "" && isValid;
	}

	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}

	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
	}

	if (rules.isEmail) {
		const pattern =
			// /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		isValid = pattern.test(value) && isValid;
	}

	if (rules.isPassword) {
		const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
		isValid = pattern.test(value) && isValid;
	}

	if (rules.isNumeric) {
		const pattern = /^\d+$/;
		isValid = pattern.test(value) && isValid;
	}

	return isValid;
};
