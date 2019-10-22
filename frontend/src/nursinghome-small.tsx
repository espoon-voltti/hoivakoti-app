import React, { useState } from "react"
import "./nursinghome-small.scss"

const nursing_home_context = React.createContext({})

type NursingHomeSmallProps = {
	nursinghome: any
	rating: any
	expand_callback: (id: string) => void
}

function NursingHomeSmall({ nursinghome, rating, expand_callback }: NursingHomeSmallProps) {
	let rating_dom
	if (rating)
		rating_dom = (
			<p>
				{rating && rating.avg}/5.0 n: {rating && rating.total}
			</p>
		)

	let expand_dom
	if (expand_callback) expand_dom = <button onClick={() => expand_callback(nursinghome.id)}>Avaa</button>

	return (
		<div className="nursinghome-container">
			<img
				className="nursinghome-container-child"
				id="nursinghome-review-image"
				src="https://upload.wikimedia.org/wikipedia/commons/b/b6/%27Banks%27%2C_near_Tunshill%2C_Milnrow%2C_Lancashire_-_geograph.org.uk_-_305445.jpg"
				width="300px"
			/>

			<div id="nursinghome-info">
				<p className="nursinghome-container-child" id="nursinghome-name">
					{nursinghome && nursinghome.name}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-summary">
					{nursinghome && nursinghome.owner}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-location">
					{nursinghome && nursinghome.location}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-address">
					{nursinghome && nursinghome.address}
				</p>
			</div>

			{rating_dom}
			{expand_dom}
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>

export { NursingHomeSmall }
