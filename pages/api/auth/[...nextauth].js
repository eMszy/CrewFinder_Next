import NextAuth from "next-auth/next";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs/dist/bcrypt";
import validator from "validator";

import User from "../../../models/user";
import clientPromise from "../../../shared/mongodb";
import dbConnect from "../../../shared/dbConnect";
import { StateContext } from "../../../context/state-context";

export default NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
		}),
		CredentialsProvider({
			id: "SingIn",
			name: "SingIn",

			async authorize(credentials, req) {
				dbConnect();
				const existingUser = await User.findOne({ email: credentials.email });

				if (existingUser) {
					const error = new Error("Ezzel az email címmel már regisztráltak");
					throw error;
				}

				const hashedPw = await bcrypt.hash(credentials.password, 12);
				const user = new User({
					name: credentials.name,
					email: credentials.email,
					password: hashedPw,
					image: "/icons/user.png",
				});
				const createdUser = await user.save();

				return createdUser;
			},
		}),
		CredentialsProvider({
			id: "LogIn",
			name: "LogIn",

			async authorize(credentials, req) {
				dbConnect();
				const user = await User.findOne({ email: credentials.email });

				if (!user) {
					throw new Error("Nem regisztrált e-mail cím");
				}

				if (!user.password) {
					throw new Error("Eddig nem léptél be így");
				}

				const isEqual = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isEqual) {
					throw new Error("Helytelen jelszó");
				}
				return user;
			},
		}),
	],
	callbacks: {
		// signIn: async (data) => {
		// 	console.log("signIn - DATA:", data);
		// 	return true;
		// },
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.id = token.id;
			}
			return session;
		},
	},
	secret: process.env.SECRET,
	jwt: {
		secret: process.env.SECRET,
		encryption: true,
	},
	pages: {
		signIn: "/",
		error: "/",
	},
	session: {
		strategy: "jwt",
		maxAge: 7 * 24 * 60 * 60,
		updateAge: 7 * 24 * 60 * 60,
	},
	debug: false,
	events: {
		async signIn({ profile, account, isNewUser }) {
			// const statusContext = useContext(StateContext);

			// statusContext.setStatus({ message: "Sikeres Bejelentkezés" });

			if (
				isNewUser &&
				(account.provider !== "SingIn" || account.provider !== "LogIn")
			) {
				dbConnect();
				const user = await User.findOne({ email: profile.email });
				user.set("timestamps");
				console.log("user", user);
				await user.save();
			}
		},
		async linkAccount(message) {
			console.log("linkAccount", message);
		},
	},
});
