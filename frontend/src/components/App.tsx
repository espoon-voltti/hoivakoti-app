import React, { useEffect, FC } from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageLanding from "./PageLanding";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useCurrentLanguage } from "../translations";

const App: React.FC = () => {
	const currentLanguage = useCurrentLanguage();
	const currentPath = window.location.pathname;
	useEffect(() => {
		if (currentPath === "/") window.location.pathname = `/${currentLanguage}/`;
	}, [currentLanguage, currentPath]);
	return (
		<div id="app">
			<Router basename={`/${currentLanguage}`}>
				<Header />

				<main id="content">
					<Route exact path="/" component={PageLanding} />
					<Route exact path="/hoivakodit" component={PageNursingHomes} />
					<Route exact path="/hoivakodit/:id" component={PageNursingHome} />
				</main>

				<Footer />
			</Router>
		</div>
	);
};

export default App;
