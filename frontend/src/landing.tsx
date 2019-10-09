import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "./nurseryhome-large.css"

const nursery_home_context = React.createContext({})

type NurseryHomeProps = {
	nurseryhome: any
	rating: any
	expand_callback: (id: string) => void
}

function Landing({ nurseryhome, rating, expand_callback }: NurseryHomeProps) {
	console.log(nurseryhome.name)
	console.log(rating)

	let rating_dom
	if (rating)
		rating_dom = (
			<p>
				{rating && rating.avg}/5.0 n: {rating && rating.total}
			</p>
		)

	let expand_dom
	if (expand_callback) {
		expand_dom = (
			<div className="expanded">
				<button onClick={() => expand_callback(nurseryhome.id)}>Avaa</button>
			</div>
		)
	}

	return (
		<div className="nurseryhome-expanded-container">
			<img
				className="nurseryhome-container-child"
				id="nurseryhome-review-image"
				src="https://upload.wikimedia.org/wikipedia/commons/b/b6/%27Banks%27%2C_near_Tunshill%2C_Milnrow%2C_Lancashire_-_geograph.org.uk_-_305445.jpg"
				width="25%"
				height="25%"
			/>
			<p className="nurseryhome-container-child" id="nurseryhome-name">
				{nurseryhome && nurseryhome.name}
			</p>
			<p className="nurseryhome-container-child" id="nurseryhome-summary">
				{nurseryhome && nurseryhome.summary}
			</p>
			{rating_dom}
			{expand_dom}
			Lots of shit here.
			<Link to={"/palaute?id=" + nurseryhome.id}>
				<button onClick={() => expand_callback(nurseryhome.id)}>Anna Palautetta</button>
			</Link>
			some more stuff.
		</div>
	)
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export { Landing }
