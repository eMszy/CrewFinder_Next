import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const middleware = async (req) => {
	if (req.nextUrl.pathname === "/") {
		const token = await getToken({
			req,
			secret: process.env.SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});
		if (token) {
			const url = req.nextUrl.clone();
			url.pathname = "/home";
			return NextResponse.redirect(url);
		}
	}
};

export default middleware;
