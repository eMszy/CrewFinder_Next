import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const middleware = async (req) => {
	const token = await getToken({
		req,
		secret: process.env.SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	});

	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = "/api/auth/signin";
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
};

export default middleware;
