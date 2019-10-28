import React, { useState, useEffect } from "react"
import { NursingHomeSmall } from "./nursinghome-small"
import { MenuSelect } from "./menu-select"
import { useHistory } from "react-router-dom";
import "../styles/nursinghomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import * as config from "./config";
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

	const selected_area_text = "Sijainti: " + ((search as any).hk ? areas[(search as any).hk] : areas[0]);

	const filters_dom = (
	
	<>
		<MenuSelect prefix="Sijainti: " values={areas} aria_label="Valitse hoivakodin alue" on_changed={(value: any) => 
			{
				search_as_any.hk = areas.findIndex((v) => v === value);
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
		<MenuSelect prefix="Palvelukieli: " values={["Suomi", "Ruotsi", "Ei väliä"]} aria_label="Valitse hoivakodin kieli" on_changed={(value: any) => 
			{
				search_as_any.language = value;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
		<MenuSelect prefix="Ara-kohde: " values={["Kyllä", "Ei väliä"]} aria_label="Valitse, näytetäänkö vain Ara-kohteet" on_changed={(value: any) => 
			{
				search_as_any.ara = value == "Kyllä" ? true : null;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
	</>
	);
	console.log("here");
	console.log(nursinghomes);
	const nursinghome_components: object[] = nursinghomes.filter((nursinghome: any) =>
	{
		if (areas[(search as any).hk] && nursinghome.location !== areas[(search as any).hk])
			return false;
		if ((search as any).language && nursinghome.language !== (search as any).language)
			return false;
		if ((search as any).ara && nursinghome.ara !== (search as any).ara)
			return false;
		
		return true;
	})
	.map((nursinghome: any, index) => {
		const rating: any = (ratings as any)[nursinghome.id]
		return <NursingHomeSmall nursinghome={nursinghome} rating={rating} key={index} />
	})

	const Map = ReactMapboxGl({
		accessToken:
			"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg"
	})

	return (
		<div>
			<div className="filters">
				{filters_dom}
			</div>
			<div className="card-list-and-map-container">
				<div className="card-list">
					<h2 className="results-summary">x hoivakotia</h2>
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
