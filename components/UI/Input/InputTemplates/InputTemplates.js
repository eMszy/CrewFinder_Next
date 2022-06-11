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

export const date_of_bith = {
	elementType: "date",
	elementConfig: {
		title: "Születési dátum",
		type: "date",
		placeholder: "",
		editable: 1,
		subfolder: "connectInfo",
	},
	value: "",
	validation: {
		required: true,
	},
	valid: false,
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
			editable: 1,
			subfolder: "connectInfo",
		},
	},
	tel: {
		...text,
		elementConfig: {
			title: "Telefonszám",
			placeholder: "",
			editable: 1,
			subfolder: "connectInfo",
		},
	},
	dob: {
		...date_of_bith,
	},
	gender: {
		...text,
		elementConfig: {
			title: "Neme",
			placeholder: "",
			editable: 1,
			subfolder: "connectInfo",
		},
		validation: {
			minLength: 2,
		},
	},
	imdb: {
		...text,
		elementConfig: {
			title: "IMDB link",
			placeholder: "",
			editable: 1,
			subfolder: "connectInfo",
		},
	},
	facebook: {
		...text,
		elementConfig: {
			title: "Facebook link",
			placeholder: "",
			editable: 1,
			subfolder: "connectInfo",
		},
	},
	city: {
		...text,
		elementConfig: {
			title: "Város",
			placeholder: "",
			editable: 1,
			subfolder: "address",
		},
	},
	street: {
		...text,
		elementConfig: {
			title: "Utca",
			placeholder: "",
			editable: 1,
			subfolder: "address",
		},
	},
	postCode: {
		...text,
		elementConfig: {
			title: "Irányítószám",
			placeholder: "",
			editable: 1,
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
