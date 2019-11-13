import React from "react";
import "../styles/global.scss";
import "../styles/App.scss";
import PageNursingHomes from "./PageNursingHomes";
import PageNursingHome from "./PageNursingHome";
import PageFeedback from "./PageFeedback";
import PageLanding from "./PageLanding";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import * as config from "./config";

const App: React.FC = () => {
	return (
		<div id="app">
			<Router>
				<header className="header">
					<div className="logo-container">
						<a href="/">
							<img className="logo" src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"} alt="Espoo logo" />
							<h1 className="title">Espoon hoivakodit</h1>
						</a>
					</div>

					<nav id="page-nav">
						<input type="checkbox" role="button" aria-haspopup="true" id="hamburger" />
						<label htmlFor="hamburger" className="menu-btn">
							&#9776; valikko
						</label>
						<div className="nav-menus">
							<ul className="nav-menu" role="menu">
								<li>
									<NavLink activeClassName="selected" exact to="/">
										Etusivu
									</NavLink>
								</li>
								<li>
									<NavLink activeClassName="selected" exact to="/hoivakodit">
										Hoivakodit
									</NavLink>
								</li>
							</ul>
						</div>
						<ul className="nav-menu--language" role="menu">
							<li className="selected link-fi"></li>
							<li className="separator">|</li>
							<li>
								<NavLink to="#" lang="sv" className="link-sv"></NavLink>
							</li>
						</ul>
					</nav>
				</header>

				<main id="content">
					<Route exact path="/" component={PageLanding} />
					<Route exact path="/hoivakodit" component={PageNursingHomes} />
					<Route exact path="/hoivakodit/:id" component={PageNursingHome} />
					<Route exact path="/topics" component={PageNursingHomes} />
					<Route exact path="/palaute" component={PageFeedback} />
				</main>
			</Router>
		</div>
	);
};

export default App;
