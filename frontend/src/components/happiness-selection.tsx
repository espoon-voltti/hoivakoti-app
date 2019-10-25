import React, { useState, useEffect } from "react"
//const axios = require("axios").default

function HappinessSelection(label: string) {
	const [selection, SetSelection] = useState("")

	useEffect(() => {}, [])

	const handleRadiochange = (event: any) => {
		SetSelection(event.target.value)
	}

	return (
		<div>
			<form>
				<label>{label}</label>
				<label>
					<input type="radio" value="0" checked={selection === "0"} onChange={handleRadiochange} />
					Iloinen
				</label>

				<label>
					<input type="radio" value="1" checked={selection === "1"} onChange={handleRadiochange} />
					Surullinen
				</label>

				<label>
					<input type="radio" value="2" checked={selection === "2"} onChange={handleRadiochange} />
					Surullinen
				</label>

				<label>
					<input type="radio" value="3" checked={selection === "3"} onChange={handleRadiochange} />
					Surullinen
				</label>

				<label>
					<input type="radio" value="4" checked={selection === "4"} onChange={handleRadiochange} />
					Surullinen
				</label>
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

export { HappinessSelection }
