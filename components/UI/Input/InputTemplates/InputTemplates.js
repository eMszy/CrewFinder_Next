export const text = {
	elementType: "input",
	elementConfig: {
		type: "text",
	},
	value: "",
	validation: {
		required: true,
		minLength: 4,
	},
	valid: false,
	touched: false,
	disabled: true,
};

export const name = {
	elementType: "input",
	elementConfig: {
		type: "text",
		title: "Név",
		placeholder: "Név",
	},
	value: "",
	validation: {
		required: true,
		minLength: 4,
	},
	valid: false,
	touched: false,
	disabled: true,
};

export const email = {
	elementType: "input",
	elementConfig: {
		type: "email",
		title: "E-mail",
		placeholder: "E-mail",
	},
	value: "",
	validation: {
		required: true,
		isEmail: true,
	},
	valid: false,
	touched: false,
	disabled: true,
};

export const password = {
	elementType: "input",
	elementConfig: {
		type: "password",
		title: "Jelszó",
		placeholder: "Jelszó",
	},
	value: "",
	validation: {
		required: true,
		isPassword: true,
	},
	valid: false,
	touched: false,
	disabled: true,
};

export const confirm_password = {
	elementType: "input",
	elementConfig: {
		type: "password",
		title: "Jelszó megerősítés",
		placeholder: "Jelszó megerősítés",
	},
	value: "",
	validation: {
		required: true,
	},
	valid: false,
	touched: false,
	disabled: true,
};

export const eventType = {
	elementType: "select",
	elementConfig: {
		options: [
			{ value: "Private", displayValue: "Privát" },
			{ value: "Open", displayValue: "Nyílt" },
			{ value: "Parameter", displayValue: "Szűrő" },
			{ value: "Direct", displayValue: "Direkt" },
		],
		title: "Típus",
	},
	value: "Private",
	validation: {
		required: false,
	},
	valid: true,
	touched: false,
	disabled: true,
};

export const formTemplate = {
	name: name,
	email: email,
	nickName: {
		...text,
		elementConfig: {
			title: "Becenév",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	tel: {
		...text,
		elementConfig: {
			title: "Telefonszám",
			placeholder: "",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	dob: {
		...text,
		elementConfig: {
			title: "Születési dátum",
			placeholder: "",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	gender: {
		...text,
		elementConfig: {
			title: "Neme",
			placeholder: "",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	imdb: {
		...text,
		elementConfig: {
			title: "IMDB link",
			placeholder: "",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	facebook: {
		...text,
		elementConfig: {
			title: "Facebook link",
			placeholder: "",
			editable: true,
			subfolder: "connectInfo",
		},
	},
	city: {
		...text,
		elementConfig: {
			title: "Város",
			placeholder: "",
			editable: true,
			subfolder: "address",
		},
	},
	street: {
		...text,
		elementConfig: {
			title: "Utca",
			placeholder: "",
			editable: true,
			subfolder: "address",
		},
	},
	postCode: {
		...text,
		elementConfig: {
			title: "Irányítószám",
			placeholder: "",
			editable: true,
			subfolder: "address",
		},
	},
	createdAt: {
		...text,
		elementConfig: {
			title: "Létrehozva",
			placeholder: "",
		},
	},
	updatedAt: {
		...text,
		elementConfig: {
			title: "Utolsó módosítás",
			placeholder: "",
		},
	},
};
