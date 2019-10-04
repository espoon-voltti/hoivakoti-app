import React from 'react';
import './App.css';
import {NurseryHomes} from './nurseryhomes'
import {Feedback} from './feedback'
import { NurseryHomeProvider } from './nurseryhomes-context'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from "reakit/Button";

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/
		// 				<img id="logo-large" src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>

		//<Button>Button</Button>;

	return (
		<div className="app">
			<Router>
			<header className="app-header">

				<div id="app-name">
					Espoon Hoivakodit
				</div>

				<div id="app-links">
					<Link to="/palaute?id=985507e2-735f-48a9-a941-75b38f0e4adb">Hoivakodit</Link>
					<Link to="/">Hakeminen</Link>
					<Link to="/">Tietoa Palvelusta</Link>
				</div>
			</header>

			<div id="app-banner">
				<img width="100%" src={process.env.PUBLIC_URL + "person-elderly.jpg"}/>
			</div>

			<div>

				<Route exact path="/" component={NurseryHomes} />
				<Route path="/about" component={NurseryHomes} />
				<Route path="/topics" component={NurseryHomes} />
				<Route path="/palaute" component={Feedback} />
			  </div>
			</Router>
		</div>
	);
}

export default App;