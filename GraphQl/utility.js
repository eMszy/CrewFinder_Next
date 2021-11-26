import { deletUser, FetchByIdGQL, updateByIdGQL } from "./GraphQLTemplates";

export const PostData = async (graphqlQuery) => {
	const token = localStorage.getItem("token");

	const res = await fetch(process.env.GRAPHQL, {
		method: "POST",
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(graphqlQuery),
	});
	const resData = await res.json();

	if (resData.errors) {
		console.error("Error: ", resData.errors);
		const error = resData.errors[0];
		error.message = resData.errors[0].message;
		throw error;
	}
	return resData;
};

export const FetchData = async (Collection, Id, OutputData) => {
	const graphqlQuery = FetchByIdGQL(Collection, Id, OutputData);

	try {
		const resivedUserData = await PostData(graphqlQuery);
		return resivedUserData;
	} catch (err) {
		throw err;
	}
};

export const EditForm = (Form, Id, Collection, OutputData) => {
	const formingData = (resivedUserData) => {
		let formedResivedData = {};

		const dismantling = (obj, fn) => {
			for (const [key, val] of Object.entries(obj)) {
				val && typeof val === "object" ? dismantling(val, fn) : fn(key, val);
			}
		};
		const dismantlingData = (key, val) =>
			(formedResivedData = { ...formedResivedData, [key]: val });

		dismantling(resivedUserData, dismantlingData);
		return formedResivedData;
	};

	const FetchDataHandel = async (Collection, Id, OutputData) => {
		try {
			const resivedUserData = await FetchData(Collection, Id, OutputData);
			const formedResivedData = formingData(resivedUserData);

			let updatedObject = Form;
			for (const [key] of Object.entries(Form)) {
				updatedObject[key] = {
					...updatedObject[key],
					value: formedResivedData[key]
						? formedResivedData[key]
						: updatedObject[key].value,
					valid: true,
				};
			}
			return updatedObject;
		} catch (err) {
			err.code = 401;
			err.error = true;
			throw err;
		}
	};

	return FetchDataHandel(Collection, Id, OutputData);
};

export const SavingHandel = async (Id, DataForm, Collection) => {
	let subPlusData = {};
	if (DataForm) {
		for (const [key] of Object.entries(DataForm)) {
			if (
				DataForm[key].elementConfig.editable &&
				DataForm[key].touched &&
				DataForm[key].valid
			) {
				let subfolder = DataForm[key].elementConfig.subfolder;
				subPlusData[subfolder] = {
					...subPlusData[subfolder],
					[key]: DataForm[key].value,
				};
			}
		}
	}
	if (subPlusData) {
		const graphqlQuery = updateByIdGQL(Id, subPlusData, Collection);
		try {
			await PostData(graphqlQuery);
		} catch (err) {
			console.error(err);
			throw err;
		}
	} else {
		errorHandel(err);
		throw new Error("Somtihing went wrong");
	}
};

export const DeleteHandel = async (Id) => {
	const graphqlQuery = deletUser(Id);
	try {
		await PostData(graphqlQuery);
	} catch (err) {
		console.error(err);
		throw err;
	}
};
