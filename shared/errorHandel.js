import React from "react";

const ErrorHandel = (err) => {
	const error = err;
	console.error("Error: ", err);
	return <p style={{ color: "red" }}>{"Hiba: " + error.err.message}</p>;
};

export default ErrorHandel;
