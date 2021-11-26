import { gql } from "apollo-server-micro";

export const typeDefs = gql`
	# User types
	type User {
		_id: ID!
		email: String!
		password: String!
		name: String
		userData: UserData
		events: [Event!]!
		createdAt: String!
		updatedAt: String!
		metaData: MetaD
	}

	type UserData {
		connectInfo: ConnectInfo
		address: Address
	}

	type MetaD {
		isAdmin: Boolean!
		isHOD: Boolean!
	}

	type ConnectInfo {
		nickName: String
		tel: String
		facebook: String
		imdb: String
		dob: String
		gender: String
	}

	type Address {
		postCode: String
		city: String
		street: String
	}

	type AuthData {
		token: String!
		userId: String!
		metaData: MetaD!
	}

	# Event types
	type Event {
		_id: ID!
		title: String!
		creator: User!
		shortName: String!
		startDate: String!
		endDate: String!
		eventType: String!
		createdAt: String!
		updatedAt: String!
	}

	type EventData {
		events: [Event!]!
		totalEvents: Int!
	}

	# User Inputs
	input mainUserInputData {
		name: String!
		email: String!
		password: String!
	}

	input userInput {
		connectInfo: connectInfoInput
		address: addressInput
	}

	input connectInfoInput {
		nickName: String
		tel: String
		facebook: String
		imdb: String
		dob: String
		gender: String
	}

	input addressInput {
		city: String
		street: String
		houseNumber: String
		postCode: String
	}

	#Event inputs
	input eventInputData {
		title: String!
		shortName: String!
		startDate: String!
		endDate: String!
		eventType: String!
	}

	type Query {
		# User Querys
		login(email: String!, password: String!): AuthData!
		user(id: ID!): User!

		# Event Querys
		events(page: Int, perPage: Int): EventData!
		event(id: ID!): Event!
	}

	type Mutation {
		# User Mutations
		createUser(userInput: mainUserInputData!): User!
		updateUser(id: ID!, Data: userInput!): User
		# deleteUser
		deleteUser(id: ID!): Boolean

		# Event Mutations
		createEvent(id: ID!, eventInput: eventInputData!): Event
		# updateEvent
		deleteEvent(id: ID!): Boolean
	}
`;
