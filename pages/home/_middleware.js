import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const middleware = async (req) => {
	const token = await getToken({
		req,
		secret: process.env.SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	const session = await getSession({ req });
	console.log("_middleware session", session);
	console.log("_middleware Token", token);

	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = "/api/auth/signin";
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
};

export default middleware;
