import React, { useEffect, FC } from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageLanding from "./PageLanding";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useLocation,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import { useCurrentLanguage } from "../i18n";
import PageError from "./PageError";
import ScrollToTop from "./ScrollToTop";
import PageAccessibility from "./PageAccessibility";
import Title from "./Title";
import PageUpdate from "./PageUpdate";
import PageUploadReport from "./PageUploadReport";
import PageReportsAdmin from "./PageReportsAdmin";
import PageCancel from "./PageCancel";
import PageSurvey from "./PageSurvey";
import PageSurveyResults from "./PageSurveyResults";
import PageAdmin from "./PageAdmin";
import ReactGA from "react-ga";
import config from "./config";

const App: React.FC = () => {
	const currentLanguage = useCurrentLanguage();
	const currentPath = window.location.pathname;
	useEffect(() => {
		if (
			window.location.hostname.includes("hoivakodit.net") ||
			window.location.hostname.includes("hoivakoti.net")
		)
			window.location.href = "https://hoivakodit.espoo.fi" + currentPath;
		else if (currentPath === "/")
			window.location.pathname = `/${currentLanguage}/`;
	}, [currentLanguage, currentPath]);

	const _doNotTrack = navigator.doNotTrack
		? navigator.doNotTrack === "1" || navigator.doNotTrack === "yes"
		: window.doNotTrack
		? window.doNotTrack === "1"
		: false;
	if (!_doNotTrack) {
		ReactGA.initialize("UA-154249998-1", {
			testMode: config.NODE_ENV === "test",
		});
	}

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
								path="/hoivakodit/:id/valvonta"
								component={PageUploadReport}
							/>
							<Route
								exact
								path="/hoivakodit/:id/paivita/:key/peruuta"
								component={PageCancel}
							/>
							<Route
								exact
								path="/hoivakodit/:id/anna-arvio"
								component={PageSurvey}
							/>
							<Route
								exact
								path="/hoivakodit/:id/arviot"
								component={PageSurveyResults}
							/>
							<Route
								exact
								path="/valvonta"
								component={PageReportsAdmin}
							/>
							<Route
								exact
								path="/saavutettavuus"
								component={PageAccessibility}
							/>
							<Route exact path="/admin" component={PageAdmin} />
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
