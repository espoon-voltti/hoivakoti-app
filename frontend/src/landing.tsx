import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "./landing.css"
import { withRouter, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";

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
			<option value={index}>{area}</option>
		)
	});

	return (
		<div id="landing">
			<div id="pick-nursery">
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
			Elikkäs elikkäs.
			</p>

			<h2>Mitä on tehostettu palveluasuminen?</h2>
			<p>
			Elikkäs elikkäs.
			</p>

			<h2>Palvelulupaus</h2>
			<p>
			Elikkäs elikkäs.
			</p>

			</div>
		</div>
	)
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export { Landing }
