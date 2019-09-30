import React from 'react';
import './App.css';
import {NurseryHomes} from './nurseryhomes'
import {Feedback} from './feedback'
import { NurseryHomeProvider } from './nurseryhomes-context'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/

	return (
		<div className="App">
			<header className="App-header">
				<img id="logo-large" src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>
			</header>

			<Router>
			<div>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/about">About</Link>
				 	</li>
				 	<li>
						<Link to="/topics">Topics</Link>
				 	</li>
				</ul>

				<hr />

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