import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "../styles/landing.scss"
import { withRouter, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import * as config from "./config";

import {
	useMenuState,
	Menu,
	MenuItem,
	MenuDisclosure,
	MenuSeparator
} from "reakit/Menu";

import { Button } from "reakit/Button";


function Landing() {
	let history = useHistory();

	const menu = useMenuState();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	let selected_area = -1;

	const on_selected_area = function(event: any) {
		console.log(event.target.value)
		selected_area = event.target.value;
	}

	const menu_items_dom: object[] = areas.map((area, index) => {
		return (
			<option value={index} key={index}>{area}</option>
		)
	});

	return (
		<div id="landing">
			<div id="landing-banner">
				<img width="100%" src={config.PUBLIC_FILES_URL + "/person-elderly.jpg"} />
			</div>

			<div id="pick-nursing">
				<b>Miltä alueelta etsit hoivakotia?</b>
				<select onChange={on_selected_area}>
					{menu_items_dom}
				</select>
				<Button onClick={() => {
					const url = "/hoivakodit" + (selected_area >= 0 ? "?hk=" + selected_area : "");
					history.push(url);
				}}>
					Näytä Hoivakodit
				</Button>
			</div>
			<div id="info">
			<h2>Miten saan tehostetun palveluasumisen?</h2>
			<p>
			Tehostetun palveluasumisen tekstiä. Mitä kautta palveluasumista haetaan, mihin tahoon otetaan yhteyttä yms.
			</p>

			<h2>Mitä on tehostettu palveluasuminen?</h2>
			<p>
			Tehostetun palveluasumisen tekstiä. Mitä tehostettu palveluasuminen tarkoittaa - vuokranmaksua, yhteisiä tiloja, hoitajasaatavuus, yms
			</p>

			<h2>Palvelulupaus</h2>
			<p>
			Palvelulupauksen teksti.
			</p>

			</div>
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>

export { Landing }
