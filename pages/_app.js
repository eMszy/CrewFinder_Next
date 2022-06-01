import { SessionProvider } from "next-auth/react";

import StateContextProvider from "../context/state-context";

import Layout from "../hoc/Layout/Layout";
import "../styles/globals.scss";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<StateContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</StateContextProvider>
		</SessionProvider>
	);
};

export default App;
