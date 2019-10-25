import React, { useState, useEffect } from "react"
import {
	  useParams
} from "react-router-dom";
import "../styles/nursinghome.scss"
import * as config from "./config";
const axios = require("axios").default

const nursing_home_context = React.createContext({})

type NursingHomeProps = {
	_nursinghome: any
}

function NursingHome({ _nursinghome }: NursingHomeProps) {
	const [nursinghome, SetNursingHome] = useState({})
	let { id } = useParams();

	console.log("id: " + id);

	useEffect(() => {
		if (_nursinghome)
			SetNursingHome(_nursinghome)
		else
			axios
				.get(config.API_URL + "/nursing-homes/" + id)
				.then(function(response: any) {
					// handle success
					console.log("Got data:")
					console.log(response.data[0]);
					SetNursingHome(response.data[0])
				})
				.catch((error: any) => console.warn(error.message))
	}, []);

	return (
		<div id="nurseryhome">
			<div id="infobox">
				<p className="nursinghome-container-child" id="nursinghome-name">
					{nursinghome && (nursinghome as any).name}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-summary">
					{nursinghome && (nursinghome as any).owner}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-location">
					{nursinghome && (nursinghome as any).location}
				</p>
				<p className="nursinghome-container-child" id="nursinghome-address">
					{nursinghome && (nursinghome as any).address}
				</p>
			</div>

			<div id="infobox">
				Infoboxes come here, like contact info, ratings summary.
			</div>
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>

export { NursingHome }
