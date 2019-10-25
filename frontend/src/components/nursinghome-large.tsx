import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import * as config from "./config";
import "../styles/nursinghome-large.scss"

const nursing_home_context = React.createContext({})

type NursingHomeProps = {
	nursinghome: any
	rating: any
	expand_callback: (id: string) => void
}

function NursingHomeLarge({ nursinghome, rating, expand_callback }: NursingHomeProps) {
	console.log(nursinghome.name)
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
				<button onClick={() => expand_callback(nursinghome.id)}>Avaa</button>
			</div>
		)
	}

	return (
		<div className="nursinghome-expanded-container">
			<img
				className="nursinghome-container-child"
				id="nursinghome-review-image"
				src={config.PUBLIC_FILES_URL + "/icon-house.svg"}
				width="25%"
				height="25%"
			/>
			<p className="nursinghome-container-child" id="nursinghome-name">
				{nursinghome && nursinghome.name}
			</p>
			<p className="nursinghome-container-child" id="nursinghome-summary">
				{nursinghome && nursinghome.summary}
			</p>
			{rating_dom}
			{expand_dom}
			Lots of shit here.
			<Link to={"/palaute?id=" + nursinghome.id}>
				<button onClick={() => expand_callback(nursinghome.id)}>Anna Palautetta</button>
			</Link>
			some more stuff.
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>

export { NursingHomeLarge }
