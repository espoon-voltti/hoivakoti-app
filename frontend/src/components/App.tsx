import React, { useEffect } from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageLanding from "./PageLanding";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
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
import PageUpdateImages from "./PageUpdateImages";
import PageUploadReport from "./PageUploadReport";
import PageReportsAdmin from "./PageReportsAdmin";
import PageCancel from "./PageCancel";
import PageSurvey from "./PageSurvey";
import PageSurveyResults from "./PageSurveyResults";
import PageManualSurveyEntry from "./PageManualSurveyEntry";
import PageAdmin from "./PageAdmin";
import PageOpenFeedbackResults from "./PageOpenFeedbackResults";
import PageRespondFeedback from "./PageRespondFeedback";
import PrivateRoute from "./PrivateRoute";

import AuthContextProvider from "./auth-context";
import AuthTypes from "../shared/types/auth-types";

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

	return (
		<ErrorBoundary>
			<div id="app">
				<Router basename={`/${currentLanguage}`}>
					<ScrollToTop />
					<Title />
					<AuthContextProvider>
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
									path="/hoivakodit/:id/paivita/:key/tiedot"
									component={PageUpdate}
								/>
								<Route
									exact
									path="/hoivakodit/:id/paivita/:key/palaute"
									component={PageRespondFeedback}
								/>
								<Route
									exact
									path="/hoivakodit/:id/paivita/:key/kuvat"
									component={PageUpdateImages}
								/>
								<Redirect
									from="/hoivakodit/:id/paivita/:key"
									to="/hoivakodit/:id/paivita/:key/tiedot"
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
								<PrivateRoute
									path="/valvonta"
									exact
									authType={AuthTypes.VALVONTA}
									component={PageReportsAdmin}
								/>
								<PrivateRoute
									path="/valvonta/asiakaskyselyn-vastaukset/:id"
									exact
									authType={AuthTypes.VALVONTA}
									component={PageManualSurveyEntry}
								/>
								<PrivateRoute
									path="/valvonta/palaute"
									exact
									authType={AuthTypes.VALVONTA}
									component={PageOpenFeedbackResults}
								/>
								<Route
									exact
									path="/saavutettavuus"
									component={PageAccessibility}
								/>
								<Route
									exact
									path="/admin"
									component={PageAdmin}
								/>
								<Route
									component={() => <PageError error="404" />}
								/>
							</Switch>
						</main>
					</AuthContextProvider>
					<Footer />
				</Router>
			</div>
		</ErrorBoundary>
	);
};

export default App;
