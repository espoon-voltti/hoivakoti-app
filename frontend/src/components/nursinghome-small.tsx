import React, { useState } from "react"
import * as config from "./config";
import "../styles/nursinghome-small.scss"

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
				src={config.PUBLIC_FILES_URL + "/icon-house.svg"}
				width="100px"
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
				<p className="nursinghome-container-child" id="nursinghome-ara">
					ARA-kohde: {nursinghome && nursinghome.ara ? "Kyllä" : "Ei"}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-lah">
					LAH-kohde: {nursinghome && nursinghome.lah ? "Kyllä" : "Ei"}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-apartments">
					Asuntoja: {nursinghome && nursinghome.apartment_count}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-language">
					Kieli: {nursinghome && nursinghome.language}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-address">
					{nursinghome && nursinghome.address}
				</p>
			</div>
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>
//			{/*rating_dom*/}
//			{/*expand_dom*/}
//

export { NursingHomeSmall }
