import React, { useState, useEffect } from "react"
import { NurseryHomeSmall } from "./nurseryhome-small"
import { NurseryHomeLarge } from "./nurseryhome-large"
import { useHistory } from "react-router-dom";
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuSeparator,
  MenuItemCheckbox
} from "reakit/Menu";
const queryString = require('query-string');
const axios = require("axios").default

function NurseryHomes() {
	// Declare a new state variable, which we'll call "count"
	const [count, setCount] = useState(0)
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

	const area_select_dom: object[] = areas.map((area, index) => {
		const name = "valitse " + area;
		return	(
			<MenuItem {...area_select_menu} name={name} value={index} onClick={(event: any) => {
					console.log(event.target.value);

					const search_as_any:any = search as any;
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

	const filters_dom = (
	<>
		<MenuDisclosure {...area_select_menu}>{selected_area_text}</MenuDisclosure>
		<Menu {...area_select_menu} aria-label="Valitse alue">
			{area_select_dom}
		</Menu>

		<MenuDisclosure {...language_select_menu}>Palvelukieli: Ei väliä</MenuDisclosure>
		<Menu {...language_select_menu} aria-label="Palvelukieli">
			<MenuItem {...language_select_menu} name="Suomi" value="suomi" onClick={(event: any) => {
					language_select_menu.hide();
				}
			}>
				Suomi
			</MenuItem>
			<MenuItem {...language_select_menu} name="Ruotsi" value="ruotsi" onClick={(event: any) => {
					language_select_menu.hide();
				}
			}>
				Ruotsi
			</MenuItem>
			<MenuItem {...language_select_menu} name="Ei väliä" value="either" onClick={(event: any) => {
					language_select_menu.hide();
				}
			}>
				Ei väliä
			</MenuItem>
		</Menu>

		<MenuDisclosure {...ara_home_menu}>Ara-Kohde</MenuDisclosure>
		<Menu {...ara_home_menu} aria-label="Palvelukieli">
			<MenuItem {...ara_home_menu} name="Ara" value="ara-yes" onClick={(event: any) => {
					ara_home_menu.hide();
				}
			}>
				Ara-Kohde
			</MenuItem>
			<MenuItem {...ara_home_menu} name="Ei väliä" value="either" onClick={(event: any) => {
					ara_home_menu.hide();
				}
			}>
				Ei väliä
			</MenuItem>
		</Menu>
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
	.map((nurseryhome: any) => {
		const rating: any = (ratings as any)[nurseryhome.id]
		if (nurseryhome.id === expanded)
			return <NurseryHomeLarge nurseryhome={nurseryhome} rating={rating} expand_callback={OnExpanded} />
		else return <NurseryHomeSmall nurseryhome={nurseryhome} rating={rating} expand_callback={OnExpanded} />
	})

	return (
		<div>
			{filters_dom}
			{nurseryhome_components}
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
