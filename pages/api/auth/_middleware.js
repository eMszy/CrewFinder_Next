import { NextResponse } from "next/server";

export const middleware = (req) => {
	console.log("req", req.headers);
	return NextResponse.next();
};
