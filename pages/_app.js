import { Head } from "next/document";
import AuthContextProvider from "../context/auth-context";
import Layout from "../hoc/Layout/Layout";
import "../styles/globals.scss";

const App = ({ Component, pageProps }) => {
	console.log(`object`, Component.title);
	return (
		<AuthContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AuthContextProvider>
	);
};

export default App;
