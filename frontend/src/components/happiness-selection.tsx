import React, { useState, useEffect, FC, ChangeEvent } from "react";

interface Props {
	label: string;
}

const HappinessSelection: FC<Props> = ({ label }) => {
	const [selection, SetSelection] = useState("");

	useEffect(() => {}, []);

	const handleRadiochange = (event: ChangeEvent<HTMLInputElement>): void => {
		SetSelection(event.target.value);
	};

	return (
		<div>
			<form>
				<label>{label}</label>
				<label>
					<input
						type="radio"
						value="0"
						checked={selection === "0"}
						onChange={handleRadiochange}
					/>
					Iloinen
				</label>

				<label>
					<input
						type="radio"
						value="1"
						checked={selection === "1"}
						onChange={handleRadiochange}
					/>
					Surullinen
				</label>

				<label>
					<input
						type="radio"
						value="2"
						checked={selection === "2"}
						onChange={handleRadiochange}
					/>
					Surullinen
				</label>

				<label>
					<input
						type="radio"
						value="3"
						checked={selection === "3"}
						onChange={handleRadiochange}
					/>
					Surullinen
				</label>

				<label>
					<input
						type="radio"
						value="4"
						checked={selection === "4"}
						onChange={handleRadiochange}
					/>
					Surullinen
				</label>
			</form>
		</div>
	);
};

export { HappinessSelection };
