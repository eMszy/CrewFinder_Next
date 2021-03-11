import Document, { Html, Head, Main, NextScript } from "next/document";
import Footer from "../components/Footer/footer";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="hu">
				<Head>
					<link rel="shortcut icon" href="/icons/favicon.ico" />
				</Head>
				<body>
					<main>
						<Main />
					</main>
					<NextScript />
					<footer>
						<Footer />
					</footer>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
