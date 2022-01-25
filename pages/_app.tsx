import {
	Container,
	MdxProvider,
	ThemeToggle,
} from "cadells-vanilla-components";
import "cadells-vanilla-components/dist/index.css";
import "@fontsource/source-sans-pro/400.css";
import "@fontsource/source-sans-pro/600.css";

const App = ({ Component, pageProps }) => (
	<MdxProvider>
		<Container>
			<ThemeToggle />
			<Component {...pageProps} />
		</Container>
	</MdxProvider>
);

export default App;
