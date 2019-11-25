import React, { useEffect, FC } from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageLanding from "./PageLanding";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import { useCurrentLanguage } from "../translations";
import PageError from "./PageError";
import ScrollToTop from "./ScrollToTop";
import PageAccessibility from "./PageAccessibility";
import Title from "./Title";
import PageUpdate from "./PageUpdate";

const App: React.FC = () => {
	const currentLanguage = useCurrentLanguage();
	const currentPath = window.location.pathname;
	useEffect(() => {
		if (currentPath === "/")
			window.location.pathname = `/${currentLanguage}/`;
	}, [currentLanguage, currentPath]);
	return (
		<ErrorBoundary>
			<div id="app">
				<Router basename={`/${currentLanguage}`}>
					<ScrollToTop />
					<Title />

					<Header />

					<main id="content">
						<Switch>
							<Route exact path="/" component={PageLanding} />
							<Route
								exact
								path="/hoivakodit"
								component={PageNursingHomes}
							/>
							<Route
								exact
								path="/hoivakodit/:id"
								component={PageNursingHome}
							/>
							<Route
								exact
								path="/hoivakodit/:id/paivita/:key"
								component={PageUpdate}
							/>
							<Route
								exact
								path="/saavutettavuus"
								component={PageAccessibility}
							/>
							<Route
								component={() => <PageError error="404" />}
							/>
						</Switch>
					</main>

					<Footer />
				</Router>
			</div>
		</ErrorBoundary>
	);
};

export default App;
