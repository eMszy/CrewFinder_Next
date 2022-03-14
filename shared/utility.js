import control from "../control.json";
import dayjs from "dayjs";

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

export const getMonth = (month = dayjs().month()) => {
	const year = dayjs().year();
	const firstDayOfTheMonth = dayjs(new Date(year, month, 0)).day();
	let currentMonthCount =
		0 - firstDayOfTheMonth - 1 + control.firstDayofTheWeek;
	const daysMatrix = new Array(5).fill([]).map(() => {
		return new Array(7).fill(null).map(() => {
			currentMonthCount++;
			return dayjs(new Date(year, month, currentMonthCount));
		});
	});
	return daysMatrix;
};

export const getWeek = (day) => {
	const year = dayjs().year();
	const month = dayjs().month();

	const weekMatrix = new Array(7).fill([]).map(() => {
		day++;
		return dayjs(new Date(year, month, day - 2 + control.firstDayofTheWeek));
	});
	return weekMatrix;
};

export const findColor = (id) => {
	const color = control.labels.find((l) => l.id === id);
	return color.label;
};

export const IsExist = (element, msg) => {
	if (!element) {
		const error = new Error(`Nincs ilyen ${msg}`);
		error.code = 404;
		throw error;
	}
};

export const returnObject = (data) => {
	return {
		...data._doc,
		_id: data._id.toString(),
		createdAt: dayjs(data.createdAt).format("YYYY. MMMM DD. HH:mm."),
		updatedAt: dayjs(data.updatedAt).format("YYYY. MMMM DD. HH:mm."),
	};
};

export const formingData = (resivedUserData, formTemplate) => {
	let formedResivedData = {};

	const dismantling = (obj, fn) => {
		for (const [key, val] of Object.entries(obj)) {
			val && typeof val === "object" ? dismantling(val, fn) : fn(key, val);
		}
	};
	const dismantlingData = (key, val) =>
		(formedResivedData = { ...formedResivedData, [key]: val });

	dismantling(resivedUserData, dismantlingData);

	if (formedResivedData?.dob)
		formedResivedData.dob = dayjs(formedResivedData.dob).format("YYYY-MM-DD");

	let updatedObject = formTemplate;
	for (const [key] of Object.entries(formTemplate)) {
		updatedObject[key] = {
			...updatedObject[key],
			value: formedResivedData[key]
				? formedResivedData[key]
				: updatedObject[key].value,
			valid: true,
		};
	}

	return updatedObject;
};
