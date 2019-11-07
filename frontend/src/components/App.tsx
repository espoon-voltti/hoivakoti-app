import React from "react"
import "../styles/App.scss"
import { NursingHomes } from "./nursinghomes"
import { NursingHome } from "./nursinghome"
import { Feedback } from "./feedback"
import { Landing } from "./landing"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import { Provider } from "reakit";
import * as system from "reakit-system-bootstrap";
import * as config from "./config";

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/
	// 				<img id="logo-large" src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>

	//<Button>Button</Button>;

	// 						<NavLink to="/palaute?id=985507e2-735f-48a9-a941-75b38f0e4adb">Hoivakodit</NavLink>

	console.log("ENV");
	console.log(Object.keys(process.env));
	console.log(process.env.NODE_ENV);

	return (
		<Provider unstable_system={system}>

			<div id="app">
				<Router>
					<header className="header">
						<div className="logo-container">
							<a href="/">	
								<img className="logo" src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"} alt="Espoo logo"/>
								<h1 className="title">Espoon hoivakodit</h1>
							</a>
						</div>
						<nav className="nav-container">
							<ul className="nav-menu">
								<li><NavLink activeClassName="selected" exact to="/">Etusivu</NavLink></li>
								<li><NavLink activeClassName="selected" exact to="/hoivakodit">Hoivakodit</NavLink></li>
							</ul>
							<ul className="nav-menu--language">
								<li className="selected">Suomeksi</li>
								<li>|</li> 
								<li><NavLink to="#" lang="sv">På Svenska</NavLink></li>
							</ul>
						</nav>


					</header>

					<main id="content">
						<Route exact path="/" component={Landing} />
						<Route exact path="/hoivakodit" component={NursingHomes} />
						<Route exact path="/hoivakodit/:id" component={NursingHome} />
						<Route exact path="/topics" component={NursingHomes} />
						<Route exact path="/palaute" component={Feedback} />
					</main>
				</Router>
			</div>

		</Provider>

	)
}

export default App
