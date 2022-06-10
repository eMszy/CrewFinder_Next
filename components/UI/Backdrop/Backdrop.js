import React from "react";

import classes from "./Backdrop.module.scss";

const Backdrop = ({ clicked }) => (
	<div className={classes.Backdrop} onClick={() => clicked(false)}></div>
);

export default Backdrop;
