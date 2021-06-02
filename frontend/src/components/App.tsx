import React, { useEffect, Suspense, lazy } from "react";
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
import { useCurrentLanguage, useT } from "../i18n";
import PageError from "./PageError";
import ScrollToTop from "./ScrollToTop";
import PageAccessibility from "./PageAccessibility";
import Title from "./Title";
import PageSurvey from "./PageSurvey";
import PageSurveyResults from "./PageSurveyResults";
import PrivateRoute from "./PrivateRoute";

import AuthContextProvider from "./auth-context";
import AuthTypes from "../shared/types/auth-types";

import HeaderContextProvider from "./header-context";

//Lazy components
const PageUpdate = lazy(() => import("./PageUpdate"));
const PageRespondFeedback = lazy(() => import("./PageRespondFeedback"));
const PageUpdateImages = lazy(() => import("./PageUpdateImages"));
const PageCancel = lazy(() => import("./PageCancel"));
const PageReportsAdmin = lazy(() => import("./PageReportsAdmin"));
const PageOpenFeedbackResults = lazy(() => import("./PageOpenFeedbackResults"));
const PageUploadReport = lazy(() => import("./PageUploadReport"));
const PageManualSurveyEntry = lazy(() => import("./PageManualSurveyEntry"));
const PageNursingHomeCommunes = lazy(() => import("./PageNursingHomeCommunes"));
const PageAdmin = lazy(() => import("./PageAdmin"));

const App: React.FC = () => {
	const currentLanguage = useCurrentLanguage();
	const currentPath = window.location.pathname;

	useEffect(() => {
		if (currentPath === "/") {
			window.location.pathname = `/${currentLanguage}/`;
		}
	}, [currentLanguage, currentPath]);

	const loadingText = useT("loadingText");

	return (
		<ErrorBoundary>
			<div id="app">
				<Router basename={`/${currentLanguage}`}>
					<ScrollToTop />
					<Title />
					<AuthContextProvider>
						<HeaderContextProvider>
							<Header />

							<main id="content">
								<Suspense
									fallback={
										<div className="loading-container">
											<h2 className="loading-text">
												{loadingText}
											</h2>
										</div>
									}
								>
									<Switch>
										<Route
											exact
											path="/"
											component={PageLanding}
										/>
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
											path="/valvonta/palaute"
											exact
											authType={AuthTypes.VALVONTA}
											component={PageOpenFeedbackResults}
										/>
										<PrivateRoute
											path="/valvonta/:id"
											exact
											authType={AuthTypes.VALVONTA}
											component={PageUploadReport}
										/>
										<PrivateRoute
											path="/valvonta/asiakaskyselyn-vastaukset/:id"
											exact
											authType={AuthTypes.VALVONTA}
											component={PageManualSurveyEntry}
										/>
										<PrivateRoute
											path="/valvonta/kotikunnat/:id"
											exact
											authType={AuthTypes.VALVONTA}
											component={PageNursingHomeCommunes}
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
											component={() => (
												<PageError error="404" />
											)}
										/>
									</Switch>
								</Suspense>
							</main>
						</HeaderContextProvider>
					</AuthContextProvider>
					<Footer />
				</Router>
			</div>
		</ErrorBoundary>
	);
};

export default App;
