import { SessionProvider } from "next-auth/react";

import StateContextProvider from "../context/state-context";
import StatusContextProvider from "../context/status-context";
import Layout from "../hoc/Layout/Layout";
import "../styles/globals.scss";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
	// console.log(`title`, Component.title);

	return (
		<StatusContextProvider>
			<SessionProvider session={session}>
				<StateContextProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</StateContextProvider>
			</SessionProvider>
		</StatusContextProvider>
	);
};

export default App;
