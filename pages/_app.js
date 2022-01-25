import AuthContextProvider from "../context/auth-context";
import StateContextProvider from "../context/state-context";
import StatusContextProvider from "../context/status-context";
import Layout from "../hoc/Layout/Layout";
import "../styles/globals.scss";

const App = ({ Component, pageProps }) => {
	console.log(`title`, Component.title);

	return (
		<StatusContextProvider>
			<AuthContextProvider>
				<StateContextProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</StateContextProvider>
			</AuthContextProvider>
		</StatusContextProvider>
	);
};

export default App;
