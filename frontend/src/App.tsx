import React from 'react';
import './App.css';
import {NurseryHomes} from './nurseryhomes'
import { NurseryHomeProvider } from './nurseryhomes-context'

const App: React.FC = () => {
	/*await fetch('localhost:3000/nursing-homes')
		.then(response => response.json())
		.then(data => this.setState({ data }));*/

	return (
		<div className="App">
			<header className="App-header">
				<img src={process.env.PUBLIC_URL + "hoivakodit-logo-large.png"}/>
			</header>

			<NurseryHomes/>
		</div>
	);
}

export default App;