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

	let ara_dom 
	if (nursinghome && nursinghome.ara) ara_dom = <div className="card-list-item__tag">ARA-kohde</div>

	return (
		<div className="card-list-item">
			<div className="card-list-item__image-container">
				<img className="card-list-item__image" src={config.PUBLIC_FILES_URL + "/img-placeholder.jpg"}/>
			</div>

			<div className="card-list-item__content">
				
				<div className="card-list-item__content--top">
					<div className="card-list-item__subheader">
						{nursinghome && nursinghome.owner}
					</div>

					<h3 className="card-list-item__header">
						{nursinghome && nursinghome.name}
					</h3>
					
					<div className="card-list-item__text">
						{nursinghome && nursinghome.address}
					</div>
					{ara_dom}
				</div>
				
				<div className="card-list-item__content--bottom">
					<div className="card-list-item__text">
						Palvelukieli: {nursinghome && nursinghome.language} <span className="card-list-item__text--dot"> • </span> Asuntojen määrä: {nursinghome && nursinghome.apartment_count}
					</div>
					<div className="card-list-item__text card-list-item__text--lah">
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
