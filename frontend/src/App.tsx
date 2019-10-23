import React from "react"
import "./App.scss"
import { NursingHomes } from "./nursinghomes"
import { NursingHome } from "./nursinghome"
import { Feedback } from "./feedback"
import { Landing } from "./landing"
import { NursingHomeProvider } from "./nursinghomes-context"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import { Provider, Button } from "reakit";
import * as system from "reakit-system-bootstrap";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/
	// 				<img id="logo-large" src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>

	//<Button>Button</Button>;

	// 						<Link to="/palaute?id=985507e2-735f-48a9-a941-75b38f0e4adb">Hoivakodit</Link>
	let public_url = "https://" + window.location.hostname;
	if (window.location.hostname.includes("localhost"))
		public_url = "http://" + window.location.hostname + ":4000";

	return (
		<Provider unstable_system={system}>

			<div className="app">
				<Router>
					<header className="app-header">
						<div id="app-name"><Link to="/">Espoon Hoivakodit</Link></div>

						<div id="app-links">
							<Link to="/hoivakodit">Hoivakodit</Link>
							<Link to="/">Hakeminen</Link>
							<Link to="/">Tietoa Palvelusta</Link>
						</div>
					</header>

					<div id="app-banner">
						<img width="100%" src={public_url + "/person-elderly.jpg"} />
					</div>

					<div id="content">
						<Route exact path="/" component={Landing} />
						<Route exact path="/hoivakodit" component={NursingHomes} />
						<Route exact path="/hoivakodit/:id" component={NursingHome} />
						<Route exact path="/topics" component={NursingHomes} />
						<Route exact path="/palaute" component={Feedback} />
					</div>
				</Router>
			</div>

		</Provider>

	)
}

export default App
