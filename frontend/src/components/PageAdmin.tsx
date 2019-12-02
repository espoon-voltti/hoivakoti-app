import React, { FC, useState } from "react";
import axios from "axios";
import config from "./config";

const uploadNursingHomesCSV = async (
	password: string,
	csv: string,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/csv`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			csv: csv,
			adminPassword: password,
		},
	);
};

const uploadPicturesCSV = async (
	password: string,
	csv: string,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/upload-pics`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			csv: csv,
			adminPassword: password,
		},
	);
};

const PageAdmin: FC = () => {
	const [nursinghomesContent, setNursinghomesContent] = useState("");
	const [picturesContent, setPicturesContent] = useState("");
	const [key, setKey] = useState("");

	const handleSubmit = (event: any) => {
		console.log(key);
		console.log(nursinghomesContent.length);
		console.log(picturesContent.length);

		if (nursinghomesContent.length > 0) {
			uploadNursingHomesCSV(key, nursinghomesContent).then(
				(result: any) => console.log(result),
			);
		}
		if (picturesContent.length > 0) {
			uploadPicturesCSV(key, picturesContent).then((result: any) =>
				console.log(result),
			);
		}

		event.preventDefault();
	};

	const onNursinghomesCSVChange = (event: any) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = (event: any) => {
			setNursinghomesContent(event.target.result);
		};
		reader.onerror = (event: any) => {
			alert("Error: " + event.target.result);
		};
	};

	const onPicturesCSVChange = (event: any) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = (event: any) => {
			setPicturesContent(event.target.result);
		};
		reader.onerror = (event: any) => {
			alert("Error: " + event.target.result);
		};
	};

	return (
		<div className="page-admin">
			<form onSubmit={handleSubmit} noValidate>
				Salasana:
				<input
					id="key-set"
					type="password"
					onChange={(event: any) => setKey(event.target.value)}
				/>
				<br />
				<br />
				Hoivakotien tiedot:
				<input
					id="nursinghomes-csv-select"
					type="file"
					accept=".csv"
					onChange={onNursinghomesCSVChange}
				/>
				<br />
				<br />
				Hoivakotien kuvat:
				<input
					id="pictures-csv-select"
					type="file"
					accept=".csv"
					onChange={onPicturesCSVChange}
				/>
				<br />
				<br />
				<input type="submit" value="Lähetä" />
			</form>
		</div>
	);
};

export default PageAdmin;
