import React, { useState, useEffect } from "react"
import { HappinessSelection } from "./happiness-selection"

//const axios = require("axios").default

function Feedback() {
	const [text, SetText] = useState("")

	useEffect(() => {}, [])

	const handleSubmit = (event: any) => {
		console.log("Submitting")
		event.preventDefault()
	}
	const handleChange = (event: any) => {
		SetText(event.target.value)
	}

	const happiness_ratings = {
		cleanliness: HappinessSelection("Siisteys"),
		staff: HappinessSelection("Henkilökunta"),
		food: HappinessSelection("Ruoka"),
		atmosphere: HappinessSelection("Tunnelma")
	}

	const ratings_dom = Object.values(happiness_ratings)

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					<input type="text" value={text} onChange={handleChange} />
				</label>
				<input type="submit" value="Submit" />

				{ratings_dom}
			</form>
		</div>
	)
}

/*
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count + 1)}>
				Click me
			</button>
*/

export { Feedback }
