import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const middleware = async (req) => {
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

	if (!token.metaData.positions || token.metaData.positions.length === 0) {
		const url = req.nextUrl.clone();
		if (url.pathname !== "/home/profil") {
			url.pathname = "/home/profil";

			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
};

export default middleware;
