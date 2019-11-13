import React, { useState, useEffect, FC, FormEvent, ChangeEvent } from "react";
import { HappinessSelection } from "./happiness-selection";

const Feedback: FC = () => {
	const [text, SetText] = useState("");

	useEffect(() => {}, []);

	const handleSubmit = (event: FormEvent): void => {
		console.log("Submitting");
		event.preventDefault();
	};
	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		SetText(event.target.value);
	};

	const happinessRatings = {
		cleanliness: <HappinessSelection label="Siisteys" />,
		staff: <HappinessSelection label="Henkilökunta" />,
		food: <HappinessSelection label="Ruoka" />,
		atmosphere: <HappinessSelection label="Tunnelma" />,
	};

	const ratingsDom = Object.values(happinessRatings);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					<input type="text" value={text} onChange={handleChange} />
				</label>
				<input type="submit" value="Submit" />

				{ratingsDom}
			</form>
		</div>
	);
};

export { Feedback };
