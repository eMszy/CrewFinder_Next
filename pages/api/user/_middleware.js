import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

const middleware = async (req) => {
	// console.log("first", process.env.NODE_ENV);

	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	const session = await getSession({ req });

	console.log("token1", token);
	console.log("token2", session);

	// if (!token) {
	// 	const url = req.nextUrl.clone();
	// 	url.pathname = "/api/auth/signin";
	// 	return NextResponse.redirect(url);
	// }

	return NextResponse.next();
};

export default middleware;
