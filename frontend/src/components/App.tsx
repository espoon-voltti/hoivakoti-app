import React from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageFeedback from "./PageFeedback";
import PageLanding from "./PageLanding";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const App: React.FC = () => {
	return (
		<div id="app">
			<Router>
				<Header />

				<main id="content">
					<Route exact path="/" component={PageLanding} />
					<Route exact path="/hoivakodit" component={PageNursingHomes} />
					<Route exact path="/hoivakodit/:id" component={PageNursingHome} />
					<Route exact path="/topics" component={PageNursingHomes} />
					<Route exact path="/palaute" component={PageFeedback} />
				</main>

				<Footer />
			</Router>
		</div>
	);
};

export default App;
