import React, { useState } from 'react';
import './nurseryhome-small.css';

const nursery_home_context = React.createContext({});

type NurseryHomeSmallProps = {
  nurseryhome: any
}

function NurseryHomeSmall({nurseryhome}: NurseryHomeSmallProps) {
	console.log(nurseryhome.name);

	return (
		<div className="nurseryhome-container">
			<img className="nurseryhome-container-child" id="nurseryhome-review-image" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/%27Banks%27%2C_near_Tunshill%2C_Milnrow%2C_Lancashire_-_geograph.org.uk_-_305445.jpg" width="25%" height="25%"/>
			<p className="nurseryhome-container-child" id="nurseryhome-name">{nurseryhome && nurseryhome.name}</p>
			<p className="nurseryhome-container-child" id="nurseryhome-summary">{nurseryhome.summary}</p>
		</div>
	);
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export {NurseryHomeSmall};