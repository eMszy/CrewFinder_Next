import NextAuth from "next-auth/next";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs/dist/bcrypt";

import User from "../../../models/user";
import clientPromise from "../../../shared/mongodb";
import dbConnect from "../../../shared/dbConnect";

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
				try {
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
				} catch (err) {
					console.log("err", err);
				}
			},
		}),
		CredentialsProvider({
			id: "LogIn",
			name: "LogIn",

			async authorize(credentials, req) {
				dbConnect();
				try {
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
				} catch (err) {
					console.log("err", err);
				}
			},
		}),
	],
	callbacks: {
		// signIn: async (data) => {
		// 	console.log("signIn - DATA:", data);
		// 	return true;
		// },
		jwt: async ({ token, user, account }) => {
			if (user) {
				// console.log("account", account);
				token.id = user.id;
				token.metaData = user.metaData;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.id = token.id;
				session.metaData = token.metaData;
				session.error = token.error;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
		// encryption: true,
		maxAge: 60 * 60 * 24 * 30,
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
			console.log("isNewUser", isNewUser);
			if (
				isNewUser &&
				(account.provider !== "SingIn" || account.provider !== "LogIn")
			) {
				dbConnect();
				const user = await User.findOne({ email: profile.email });
				user.set("timestamps");
				await user.save();
			}
		},
		async linkAccount(message) {
			console.log("linkAccount", message);
		},
		async signOut() {
			console.log("signOut");
		},
	},
	debug: false,
});
