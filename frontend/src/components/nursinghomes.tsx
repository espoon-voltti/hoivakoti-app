import React, { useState, useEffect } from "react"
import { NursingHomeSmall } from "./nursinghome-small"
import { NursingHomeLarge } from "./nursinghome-large"
import { MenuSelect, MenuSelectProps } from "./menu-select"
import { useHistory } from "react-router-dom";
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuSeparator,
  MenuItemCheckbox
} from "reakit/Menu";
import "../styles/nursinghomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import * as config from "./config";
const queryString = require('query-string');
const axios = require("axios").default

function NursingHomes() {

	const [nursinghomes, SetNursingHomes] = useState([])
	const [ratings, SetRatings] = useState({})
	const [expanded, SetExpanded] = useState("")
	const [search, SetSearch] = useState({})

	let history = useHistory();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	const OnExpanded = (id: string) => {
		SetExpanded(id)
	}

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

	const area_select_menu = useMenuState();
	const language_select_menu = useMenuState();
	const ara_home_menu = useMenuState();

	const search_as_any:any = search as any;

	const area_select_dom: object[] = areas.map((area, index) => {
		const name = "valitse " + area;
		return	(
			<MenuItem {...area_select_menu} name={name} value={index} onClick={(event: any) => {
					console.log(event.target.value);

					search_as_any.hk = index;
					SetSearch(search_as_any);

					area_select_menu.hide();
				}
			}>
				{area}
			</MenuItem>
		)
	});

	/*
	onClick={() => {
		menu.hide();
		console.log("clicked on button");
	}}


	*/

	const selected_area_text = "Sijainti: " + ((search as any).hk ? areas[(search as any).hk] : areas[0]);


	/*
		<MenuDisclosure {...area_select_menu}>{selected_area_text}</MenuDisclosure>
		<Menu {...area_select_menu} aria-label="Valitse alue">
			{area_select_dom}
		</Menu>
	*/

	const filters_dom = (
	
	<>
		<MenuSelect prefix="Sijainti: " values={areas} aria_label="Valitse hoivakodin alue" on_changed={(value: any) => 
			{
				search_as_any.hk = areas.findIndex((v) => v == value);
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
				search_as_any.ara = value;
				const stringfield = queryString.stringify(search_as_any);
				history.push("/hoivakodit?" + stringfield);
			}}/>
	</>
	);
	console.log("here");
	console.log(nursinghomes);
	const nursinghome_components: object[] = nursinghomes.filter((nursinghome: any) =>
	{
		if (!areas[(search as any).hk])
			return true;
		else if (nursinghome.location == areas[(search as any).hk])
			return true;
		else
			return false;
	})
	.map((nursinghome: any, index) => {
		const rating: any = (ratings as any)[nursinghome.id]
		if (nursinghome.id === expanded)
			return <NursingHomeLarge nursinghome={nursinghome} rating={rating} expand_callback={OnExpanded} />
		else return <NursingHomeSmall nursinghome={nursinghome} rating={rating} key={index} expand_callback={OnExpanded} />
	})

	const Map = ReactMapboxGl({
		accessToken:
			"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg"
	})

	return (
		<div>
			<div id="filters">
				{filters_dom}
			</div>
			<div id="nursinghomes-list-and-map">
				<div id="nursinghomes">
					{nursinghome_components}
				</div>
				<div id="map">
				<Map
					style="mapbox://styles/mapbox/streets-v9"
					center={[24.6559, 60.2055]}
					containerStyle={{
					height: '100vh',
					width: '50vw',
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
