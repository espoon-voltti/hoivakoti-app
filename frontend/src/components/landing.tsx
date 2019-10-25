import React from "react"
import "../styles/landing.scss"
import { useHistory } from "react-router-dom";
import { Button } from "reakit/Button";


function Landing() {
	let history = useHistory();

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
			<div className="jumbotron">
				<h2 className="jumbotron__header">Löydä sopiva hoivakoti<span>Tutustu Espoon kaupungin hyväksymiin hoivakoteihin.</span></h2>		
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
