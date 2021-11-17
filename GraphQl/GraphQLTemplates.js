import { gql } from "apollo-server-micro";

export const userLogin = (email, password) => {
	const graphqlQuery = {
		query: `
			query UserLogin($email: String!, $password: String!) {
				login(email: $email, password: $password) {
					token
					userId
					metaData {
						isAdmin
						isHOD
					}
				}
			}
		`,
		variables: {
			email: email,
			password: password,
		},
	};
	return graphqlQuery;
};

export const createNewUser = (email, name, password) => {
	const graphqlQuery = {
		query: `
			mutation CreateNewUser(
				$email: String!
				$name: String!
				$password: String!
			) {
				createUser(
					userInput: { email: $email, name: $name, password: $password }
				) {
					_id
					email
					password
				}
			}
		`,
		variables: {
			email: email,
			name: name,
			password: password,
		},
	};
	return graphqlQuery;
};

export const FetchByIdGQL = (database, Id, FetchData) => {
	const graphqlQuery = {
		query: `
		{
			${database}(id: "${Id}") {
				${FetchData}
        }
    }
	`,
	};
	return graphqlQuery;
};

export const updateByIdGQL = (Id, Data, Database) => {
	let mutationName = null;
	let inputDataType = null;

	switch (Database) {
		case "user":
			mutationName = "updateUser";
			inputDataType = "userInput!";
			break;
		case "event":
			mutationName = "updateEvent";
			inputDataType = "eventInputData!";
			break;
		default:
	}

	const graphqlQuery = {
		query: gql`
        mutation ${mutationName}($Data: ${inputDataType}){
			${mutationName}(id: "${Id}", Data: $Data) {
				updatedAt
			}
		}
		`,
		variables: {
			Data: Data,
		},
	};
	return graphqlQuery;
};

export const createEvent = (id, eventInput) => {
	const graphqlQuery = {
		query: gql`
			mutation CreateEvent($id: ID!, $eventInput: eventInputData!) {
				createEvent(id: $id, eventInput: $eventInput) {
					updatedAt
				}
			}
		`,
		variables: {
			id: id,
			eventInput: eventInput,
		},
	};
	return graphqlQuery;
};

export const events = () => {
	const graphqlQuery = {
		query: gql`
			query Event {
				events {
					events {
						_id
						title
						shortName
						eventType
						creator {
							name
						}
						title
						startDate
						endDate
						createdAt
						updatedAt
					}
				}
			}
		`,
	};
	return graphqlQuery;
};

export const event = (id) => {
	const graphqlQuery = {
		query: gql`
			query Event($id: ID!) {
				event(id: $id) {
					title
					shortName
					startDate
					endDate
					eventType
					createdAt
					updatedAt
					__typename
				}
			}
		`,
		variables: {
			id: id,
		},
	};
	return graphqlQuery;
};
