import React, { useState } from 'react';
import './nurseryhome-small.css';

const nursery_home_context = React.createContext({});

type NurseryHomeSmallProps = {
  nurseryhome: any,
  rating: any
}

function NurseryHomeSmall({nurseryhome, rating}: NurseryHomeSmallProps) {
	console.log(nurseryhome.name);
	console.log(rating);

	let rating_dom;
	if (rating)
		rating_dom = <p>{rating && rating.avg}/5.0 n: {rating && rating.total}</p>;

	return (
		<div className="nurseryhome-container">
			<img className="nurseryhome-container-child" id="nurseryhome-review-image" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/%27Banks%27%2C_near_Tunshill%2C_Milnrow%2C_Lancashire_-_geograph.org.uk_-_305445.jpg" width="25%" height="25%"/>
			<p className="nurseryhome-container-child" id="nurseryhome-name">{nurseryhome && nurseryhome.name}</p>
			<p className="nurseryhome-container-child" id="nurseryhome-summary">{nurseryhome && nurseryhome.summary}</p>
			<p>{rating_dom}</p>
		</div>
	);
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export {NurseryHomeSmall};