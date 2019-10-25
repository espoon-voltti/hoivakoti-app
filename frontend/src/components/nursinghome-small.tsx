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
		<div className="list-card">
			<div className="list-card__image-container">
				<img className="list-card__image" src={config.PUBLIC_FILES_URL + "/img-placeholder.jpg"}/>
			</div>

			<div className="list-card__content">
				
				<div className="list-card__content--top">
					<div className="list-card__subheader">
						{nursinghome && nursinghome.owner}
					</div>

					<h3 className="list-card__header">
						{nursinghome && nursinghome.name}
					</h3>
					
					<div className="list-card__text">
						{nursinghome && nursinghome.address}
					</div>
					<div className="list-card__tag">
						{nursinghome && nursinghome.ara ? "ARA-kohde" : ""}
					</div>
				</div>
				
				<div className="list-card__content--bottom">
					<div className="list-card__text">
						Palvelukieli: {nursinghome && nursinghome.language} <span className="list-card__text--dot"> • </span> Asuntojen määrä: {nursinghome && nursinghome.apartment_count}
					</div>
					<div className="list-card__text">
						{nursinghome && nursinghome.lah ? "Myös lyhytaikainen asuminen" : ""}
					</div>
				</div>
			</div>
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>
//			{/*rating_dom*/}
//			{/*expand_dom*/}
//

export { NursingHomeSmall }
