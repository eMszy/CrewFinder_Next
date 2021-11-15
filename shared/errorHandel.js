import React from "react";

const ErrorHandel = (err) => {
	console.log("Error: ", err);
	// throw new Error(err.message)
	return <p style={{ color: "red" }}>{"Hiba: " + err.mesage}</p>;
};

export default ErrorHandel;
