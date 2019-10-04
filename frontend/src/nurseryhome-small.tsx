import React, { useState } from 'react';
import './nurseryhome-small.css';

const nursery_home_context = React.createContext({});

type NurseryHomeSmallProps = {
  nurseryhome: any,
  rating: any,
  expand_callback: (id: string) => void
}

function NurseryHomeSmall({nurseryhome, rating, expand_callback}: NurseryHomeSmallProps) {
	console.log(nurseryhome.name);
	console.log(rating);

	let rating_dom;
	if (rating)
		rating_dom = <p>{rating && rating.avg}/5.0 n: {rating && rating.total}</p>;

	let expand_dom;
	if (expand_callback)
		expand_dom = <button onClick={()=>expand_callback(nurseryhome.id)}>Avaa</button>;

	return (
		<div className="nurseryhome-container">
			<img className="nurseryhome-container-child" id="nurseryhome-review-image" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/%27Banks%27%2C_near_Tunshill%2C_Milnrow%2C_Lancashire_-_geograph.org.uk_-_305445.jpg" width="300px"/>
			
			<div id="nurseryhome-info">
				<p className="nurseryhome-container-child" id="nurseryhome-name">{nurseryhome && nurseryhome.name}</p>
				<p className="nurseryhome-container-child" id="nurseryhome-summary">{nurseryhome && nurseryhome.owner}</p>
				<p className="nurseryhome-container-child" id="nurseryhome-address">{nurseryhome && nurseryhome.address}</p>
			</div>

			{rating_dom}
			{expand_dom}
		</div>
	);
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export {NurseryHomeSmall};