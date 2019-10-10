import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "./landing.css"

import {
	useMenuState,
	Menu,
	MenuItem,
	MenuDisclosure,
	MenuSeparator
} from "reakit/Menu";

import { Button } from "reakit/Button";


function Landing() {

	const menu = useMenuState();

	const areas = ["Espoon Keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	let selected_area = "";

	const on_selected_area = function(event: any) {
		console.log(event.target.value)
		selected_area = event.target.value;
	}

	const menu_items_dom: object[] = areas.map((area) => {
		return (
 			<option value={area}>{area}</option>
		)
	});

	return (
		<div id="landing">
			<div id="pick-nursery">
				<b>Miltä alueelta etsit hoivakotia?</b>
				<select onChange={on_selected_area}>
					{menu_items_dom}
				</select>

				<Button onClick={() => alert("clicked")}>
					Näytä Hoivakodit
				</Button>
			</div>
			<div id="info">
				Miten saan tehostetun palveluasumisen?

				Mitä on tehostettu blah blah?
			</div>
		</div>
	)
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export { Landing }
