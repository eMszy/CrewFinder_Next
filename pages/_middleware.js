import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.SECRET;

const middleware = async (req, res) => {
	const token = await getToken({ req, secret });
	console.log("token", token);
	NextResponse.next();
};

export default middleware;
