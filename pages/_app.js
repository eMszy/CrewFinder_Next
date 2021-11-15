import AuthContextProvider from "../context/auth-context";
import Layout from "../hoc/Layout/Layout";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
	return (
		<AuthContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AuthContextProvider>
	);
}

export default MyApp;
