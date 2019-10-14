import React, { useState, useEffect } from "react"
import { NurseryHomeSmall } from "./nurseryhome-small"
import { NurseryHomeLarge } from "./nurseryhome-large"
import { useHistory } from "react-router-dom";
const queryString = require('query-string');
const axios = require("axios").default

function NurseryHomes() {
	// Declare a new state variable, which we'll call "count"
	const [count, setCount] = useState(0)
	const [nurseryhomes, SetNurseryHomes] = useState([])
	const [ratings, SetRatings] = useState({})
	const [expanded, SetExpanded] = useState("")

	let history = useHistory();

	console.log("Search:");
	console.log(history.location.search);

	const parsed = queryString.parse(history.location.search);
	console.log(parsed);

	const areas = ["Espoon Keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	const OnExpanded = (id: string) => {
		SetExpanded(id)
	}

	useEffect(() => {
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

	let nurseryhome_components: object[] = nurseryhomes.filter((nurseryhome: any) =>
	{
		if (nurseryhome.location == areas[parsed.hk])
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

	return <div>{nurseryhome_components}</div>
}

/*
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count + 1)}>
				Click me
			</button>
*/

export { NurseryHomes }
