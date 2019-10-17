import React, { useState, useEffect } from "react"
import { NurseryHomeSmall } from "./nurseryhome-small"
import { NurseryHomeLarge } from "./nurseryhome-large"
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
import "./nurseryhomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
const queryString = require('query-string');
const axios = require("axios").default

function NurseryHomes() {

	const [nurseryhomes, SetNurseryHomes] = useState([])
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

		console.log("http://" + window.location.hostname + ":3000/nursing-homes");
		axios
			.get("http://" + window.location.hostname + ":3000/nursing-homes")
			.then(function(response: any) {
				// handle success
				SetNurseryHomes(response.data)
			})
			.catch((error: any) => console.warn(error.message))
		axios
			.get("http://" + window.location.hostname + ":3000/ratings")
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

	const nurseryhome_components: object[] = nurseryhomes.filter((nurseryhome: any) =>
	{
		if (!areas[(search as any).hk])
			return true;
		else if (nurseryhome.location == areas[(search as any).hk])
			return true;
		else
			return false;
	})
	.map((nurseryhome: any, index) => {
		const rating: any = (ratings as any)[nurseryhome.id]
		if (nurseryhome.id === expanded)
			return <NurseryHomeLarge nurseryhome={nurseryhome} rating={rating} expand_callback={OnExpanded} />
		else return <NurseryHomeSmall nurseryhome={nurseryhome} rating={rating} key={index} expand_callback={OnExpanded} />
	})

	const Map = ReactMapboxGl({
		accessToken:
			"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg"
	})

	return (
		<div>
			{filters_dom}
			<div id="nurseryhomes-list-and-map">
				<div id="nurseryhomes">
					{nurseryhome_components}
				</div>
				<div id="map">
				<Map
					style="mapbox://styles/mapbox/streets-v9"
					containerStyle={{
					height: '100vh',
					width: '50vw',
					position: 'sticky',
					top: 0
					}}>
					<Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
						<Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
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

export { NurseryHomes }
