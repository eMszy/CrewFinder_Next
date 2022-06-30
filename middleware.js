import { getToken } from "next-auth/jwt";
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from "next/server";

export const middleware = async (req) => {
	if (
		req.nextUrl.pathname.startsWith("/home") ||
		req.nextUrl.pathname.startsWith("/api/event") ||
		req.nextUrl.pathname.startsWith("/api/user")
	) {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: process.env.NODE_ENV === "production",
		});

		if (!token) {
			const url = req.nextUrl.clone();
			url.pathname = "/api/auth/signin";
			return NextResponse.redirect(url);
		}

		return NextResponse.next();
	}
};

export default middleware;
