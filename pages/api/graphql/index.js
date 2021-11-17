import { ApolloServer } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import Cors from "micro-cors";

import { resolvers } from "../../../GraphQl/resolvers";
import { typeDefs } from "../../../GraphQl/schemas";

import dbConnect from "../../../shared/dbConnect";

const cors = Cors();
dbConnect();

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		let isAuth = true;
		let err = {};

		let userId = "";

		const authHeader = req.headers.authorization || "";
		if (!authHeader) {
			return;
		}
		const token = authHeader.split(" ")[1];

		try {
			const decodedToken = jwt.verify(token, process.env.SECRET_WORD);
			if (!decodedToken) {
				const error = new Error("Not authenticated!");
				err.statusCode = 401;
				isAuth = false;
			} else {
				userId = decodedToken.userId;
			}
		} catch (error) {
			err.statusCode = 500;
			isAuth = false;
		}

		return { isAuth, err, userId };
	},
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const startServer = apolloServer.start();

export default cors(async (req, res) => {
	if (req.method === "OPTIONS") {
		res.end();
		return false;
	}
	req.isAuth = true;

	await startServer;
	await apolloServer.createHandler({
		path: "/api/graphql",
	})(req, res);
});
