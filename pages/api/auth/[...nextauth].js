import NextAuth from "next-auth/next";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import clientPromise from "../../../lib/mongodb";

export default NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	// https://next-auth.js.org/configuration/providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			// profile(profile) {
			// 	return {
			// 		id: profile.sub,
			// 		name: profile.name,
			// 		email: profile.email,
			// 		image: profile.picture,
			// 		role: "user",
			// 	};
			// },
		}),
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "Credentials",
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "email@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const client = await MongoClient.connect(process.env.MONGODB_URI, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});
				const users = await client.db().collection("users");

				const result = await users.findOne({
					email: credentials.email,
				});

				if (!result) {
					client.close();
					throw new Error("No user found with the email");
				}

				if (result.password || result.password === null) {
					const checkPassword = await compare(
						credentials.password,
						result.password
					);

					if (!checkPassword) {
						client.close();
						throw new Error("Password dosnt match");
					}
				} else {
					result.password = credentials.password;
				}

				client.close();
				console.log(`result`, result);
				return { result };
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)
			},
		}),
	],
	secret: process.env.SECRET,
	pages: {
		signIn: "/",
	},
	session: {
		strategy: "jwt",
		// strategy: "database",
		maxAge: 7 * 24 * 60 * 60,
		updateAge: 7 * 24 * 60 * 60,
	},
});
