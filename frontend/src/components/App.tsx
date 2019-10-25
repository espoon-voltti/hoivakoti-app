import React from "react"
import "../styles/App.scss"
import { NursingHomes } from "./nursinghomes"
import { NursingHome } from "./nursinghome"
import { Feedback } from "./feedback"
import { Landing } from "./landing"
import { NursingHomeProvider } from "./nursinghomes-context"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import { Provider, Button } from "reakit";
import * as system from "reakit-system-bootstrap";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import * as config from "./config";

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/
	// 				<img id="logo-large" src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>

	//<Button>Button</Button>;

	// 						<Link to="/palaute?id=985507e2-735f-48a9-a941-75b38f0e4adb">Hoivakodit</Link>

	console.log("ENV");
	console.log(Object.keys(process.env));
	console.log(process.env.NODE_ENV);

	return (
		<Provider unstable_system={system}>

			<div className="app">
				<Router>
					<header className="app-header">
						<img className="logo" src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"} />

						<h1 className="app-name"><Link to="/">Espoon hoivakodit</Link></h1>

						<div className="app-nav">
							<Link to="/">Etusivu</Link>
							<Link to="/hoivakodit">Hoivakodit</Link>
						</div>
						<div className="app-language-nav">
							<Link to="#">Suomi</Link> | <Link to="#">Ruotsi</Link>
						</div>


					</header>

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
