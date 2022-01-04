import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { AuthContext } from "../../context/auth-context";
import Button from "../UI/Button/Button";

const clientId = process.env.FACEBOOK_SINGIN_CLIENT_ID;

const FacebookLoginButton = () => {
	const authContext = useContext(AuthContext);

	const responseFacebook = (response) => {
		const { email, name, id, picture } = response;

		let UserForm = {
			email: { value: email },
			name: { value: name },
			password: { value: id },
			imageUrl: { value: picture.data.url },
		};

		authContext.googleLoginHandler(UserForm);
	};

	return (
		<FacebookLogin
			appId={clientId}
			fields="name,email,picture"
			callback={responseFacebook}
			render={(renderProps) => (
				<Button clicked={renderProps.onClick}>
					<div>
						<svg
							width="60"
							height="60"
							clipRule="evenodd"
							fillRule="evenodd"
							viewBox="0 0 560 400"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="m410.096 200.048c0-71.818-58.23-130.048-130.048-130.048s-130.048 58.23-130.048 130.048c0 64.905 47.55 118.709 109.73 128.476v-90.875h-33.029v-37.601h33.029v-28.658c0-32.59 19.422-50.604 49.122-50.604 14.228 0 29.115 2.542 29.115 2.542v32.005h-16.405c-16.148 0-21.196 10.022-21.196 20.318v24.396h36.064l-5.761 37.601h-30.304v90.875c62.18-9.749 109.73-63.553 109.73-128.476z"
								fill="#1977f3"
							/>
							<path
								d="m330.67 237.648 5.761-37.601h-36.064v-24.396c0-10.278 5.029-20.318 21.196-20.318h16.405v-32.005s-14.886-2.542-29.115-2.542c-29.7 0-49.122 17.996-49.122 50.604v28.658h-33.029v37.601h33.029v90.875c6.62 1.041 13.405 1.572 20.318 1.572s13.698-.549 20.318-1.572v-90.875h30.304z"
								fill="#fefefe"
							/>
						</svg>
						<p>Facebook bejelentkezés</p>
					</div>
				</Button>
			)}
		/>
	);
};

export default FacebookLoginButton;
