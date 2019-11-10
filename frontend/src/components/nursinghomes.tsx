import React, { useState, useEffect } from "react"
import { NursingHomeSmall } from "./nursinghome-small"
import { MenuSelect } from "./menu-select"
import { useHistory } from "react-router-dom";
import "../styles/nursinghomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import * as config from "./config";
import { Link } from "react-router-dom"
const queryString = require('query-string');
const axios = require("axios").default

function NursingHomes() {

	const [nursinghomes, SetNursingHomes] = useState([])
	const [ratings, SetRatings] = useState({})
	const [search, SetSearch] = useState({})

	let history = useHistory();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	useEffect(() => {
		const parsed = queryString.parse(history.location.search);
		SetSearch(parsed);
		if (parsed.alue && !Array.isArray(parsed.alue))
			parsed.alue = [parsed.alue];
		if (!parsed.alue)
			parsed.alue = []
		console.log("Search:");
		console.log(parsed);

		console.log(config.API_URL + "/nursing-homes");
		axios
			.get(config.API_URL + "/nursing-homes")
			.then(function(response: any) {
				// handle success
				SetNursingHomes(response.data)
			})
			.catch((error: any) => console.warn(error.message))
		axios
			.get(config.API_URL + "/ratings")
			.then(function(response: any) {
				// handle success
				SetRatings(response.data)
			})
			.catch((error: any) => console.warn(error.message))
	}, [])

	const search_as_any:any = search as any;

	const selected_area_text = "Sijainti: " + ((search as any).alue ? (search as any).alue : areas[0]);

	const area_options = [{text: "Valitse alueet joilta etsit hoivakotia", type: "header"},
		...areas.map((value: string) => {
			const checked = search_as_any.alue ? search_as_any.alue.includes(value) : false;
			return {text: value, type: "checkbox", checked: checked};
	})]

	const ara_options = [{text: "ARA-kohde", type: "radio"},
		{text: "Ei ARA-kohde", type: "radio"}
	];
	ara_options.push({text: "ARA-kohteet on rahoitettu valtion tuella, ja asukkaiden valintaperusteina ovat hakijan palvelutaloasunnon tarve sekä varallisuus.", type: "text"})

	const language_options = [{text: "Suomi", type: "checkbox"},
		{text: "Ruotsi", type: "checkbox"}
	];

	const filters_dom = (
	<>
		<MenuSelect prefix="Sijainti: " values={area_options} aria_label="Valitse hoivakodin alue" on_changed={(changed_object: any) => 
			{
				console.log("tulee:");
				console.log(changed_object.value);
				//search_as_any.alue = areas.findIndex((v) => v === changed_object.value);
				if (!changed_object.checked)
					search_as_any.alue = search_as_any.alue.filter((value: string) => {return value !== changed_object.value})
				else
					if (!search_as_any.alue.includes(changed_object.value))
						search_as_any.alue.push(changed_object.value);
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}} on_emptied={() => {
				delete search_as_any.alue;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
		<MenuSelect prefix="Palvelukieli: " values={language_options} aria_label="Valitse hoivakodin kieli" on_changed={(changed_object: any) => 
			{
				search_as_any.language = changed_object.value;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}} on_emptied={() => {
				delete search_as_any.language;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
		<MenuSelect prefix="Ara-kohde: " values={ara_options} aria_label="Valitse, näytetäänkö vain Ara-kohteet" on_changed={(changed_object: any) => 
			{
				search_as_any.ara = changed_object.value == "Kyllä" ? true : null;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}} on_emptied={() => {
				delete search_as_any.ara;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>

		<MenuSelect prefix="Lyhytaikainen asuminen: " values={[{text: "Lyhytaikainen asuminen LAH", type: "checkbox"}]} aria_label="Valitse, näytetäänkö vain lyhyen ajan asumisen kohteet." on_changed={(changed_object: any) => 
			{
				//search_as_any.alue = areas.findIndex((v) => v === changed_object.value);
				if (changed_object.checked)
					search_as_any.lah = true
				else
					search_as_any.lah = false
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}} on_emptied={() => {
				delete search_as_any.lah;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
	</>
	);

	const nursinghome_components: object[] = nursinghomes.filter((nursinghome: any) =>
	{
		if ((search as any).alue &&
			(search as any).alue.length > 0 &&
			!(search as any).alue.includes(nursinghome.location))
			return false;
		if ((search as any).language && nursinghome.language !== (search as any).language)
			return false;
		if ((search as any).ara && nursinghome.ara !== (search as any).ara)
			return false;
		if ((search as any).lah && nursinghome.lah !== (search as any).lah)
			return false;
		
		return true;
	})
	.map((nursinghome: any, index) => {
		const rating: any = (ratings as any)[nursinghome.id]
		return (
			<Link to={"/hoivakodit/" + nursinghome.id} style={{ textDecoration: 'none' }}>
				<NursingHomeSmall nursinghome={nursinghome} rating={rating} key={index} />
			</Link>
		)
	})

	const Map = ReactMapboxGl({
		accessToken:
			"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
		scrollZoom: false,
		minZoom: 11,
		maxZoom: 11
	})

	return (
		<div>
			<div className="filters">
				{nursinghomes.length && filters_dom}
			</div>
			<div className="card-list-and-map-container">
				<div className="card-list">
					<h2 className="results-summary">{Object.keys(nursinghome_components).length} hoivakotia</h2>
					{nursinghome_components}
				</div>
				<div id="map" className="map-container">
				<Map
					style="mapbox://styles/mapbox/streets-v9"
					center={[24.6559, 60.2055]}
					containerStyle={{
					height: '100vh',
					width: '100%',
					position: 'sticky',
					top: 0
					}}>
					<Layer type="symbol" id="marker" layout={{'icon-image': 'town-hall-15', 'icon-size': 1.5}}>
						<Feature coordinates={[24.6559, 60.2055]} />
						<Feature coordinates={[24.6, 60.2053]} />
						<Feature coordinates={[24.62, 60.2]} />
						<Feature coordinates={[24.7, 60.17]} />
					</Layer>
				</Map>
		</div>
			</div>
		</div>
	)
}

/*
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count + 1)}>
				Click me
			</button>
*/

export { NursingHomes }
