import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { NursingHomeConsumer } from "./nursinghomes-context";

const uploadNursingHomesCSV = async (
	password: string,
	csv: string,
): Promise<void> => {
	return await axios.post(
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
	return await axios.post(
		`${config.API_URL}/nursing-homes/upload-pics`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			csv: csv,
			adminPassword: password,
		},
	);
};

const getNursingHomeSecrets = async (password: string): Promise<void> => {
	return await axios.post(
		`${config.API_URL}/admin/reveal-secrets`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			adminPassword: password,
		},
	);
};

const addSurveyKeys = async (password: string, amount: number): Promise<void> => {
	return await axios.post(
		`${config.API_URL}/admin/add-keys`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			adminPassword: password,
			amount: amount
		},
	);
};

const deleteNursingHome = async (
	id: string,
	password: string,
): Promise<void> => {
	return await axios.delete(
		`${config.API_URL}/nursing-homes/${id}`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			data: { adminPassword: password },
		},
	);
};

const dropAndRecreateTables = async (password: string): Promise<void> => {
	return await axios.post(
		`${config.API_URL}/nursing-homes/drop-table`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{
			adminPassword: password,
		},
	);
};

const PageAdmin: FC = () => {
	const [nursinghomesContent, setNursinghomesContent] = useState("");
	const [picturesContent, setPicturesContent] = useState("");
	const [key, setKey] = useState("");
	const [uploadingInfo, setUploadingInfo] = useState(false);
	const [uploadingPics, setUploadingPics] = useState(false);
	const [amountSurveyKeys, setAmountSurveyKeys] = useState(0);
	const [uploadingInfoResult, setUploadingInfoResult] = useState("");
	const [uploadingPicsResult, setUploadingPicsResult] = useState("");
	const [linksToVacancySetting, setLinksToVacancySetting] = useState([]);
	const [createdKeys, showCreatedKeys] = useState([]);
	
	const [nursingHomes, setNursingHomes] = useState<any[] | null>([]);


	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes")
			.then(function(response: { data: any[] }) {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => {
				console.error(error.message);
				throw error;
			});
	}, []);

	const handleSubmit = (event: any) => {
		console.log(key);
		console.log(nursinghomesContent.length);
		console.log(picturesContent.length);

		if (nursinghomesContent.length > 0) {
			setUploadingInfo(true);
			uploadNursingHomesCSV(key, nursinghomesContent).then(
				(result: any) => {
					console.log(result);
					setUploadingInfo(false);
					setUploadingInfoResult(result.data);
				},
			);
		}
		if (picturesContent.length > 0) {
			setUploadingPics(true);
			uploadPicturesCSV(key, picturesContent).then((result: any) => {
				console.log(result);
				setUploadingPics(false);
				setUploadingPicsResult(result.data);
			});
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

	const ShowVacancyModificationLinks = (event: any) => {
		if (key)
			getNursingHomeSecrets(key).then((response: any) => {
				console.log(response.data.secrets.basicUpdateKeys);
				const linksArray = response.data.secrets.basicUpdateKeys.map(
					(secret: any) =>
						`${window.location.hostname}/fi-FI/hoivakodit/${secret.id}/paivita/${secret.basic_update_key} - ${secret.name}`,
				);
				setLinksToVacancySetting(linksArray);
			});
	};

	const CreateSurveyKeys = (event: any) => {
		if (key && amountSurveyKeys)
			addSurveyKeys(key, amountSurveyKeys).then((response: any) => {
				const keyString = response.data.map(
					(key: any) =>
						`${key.key}`,
				);
				showCreatedKeys(keyString);
			});
	}

	const onRecreateButtonClicked = (event: any) => {
		if (key)
			dropAndRecreateTables(key).then((response: any) => {
				console.log("Done");
			});
	};

	const handleDelete = (id: string) => {
		if (key)
			deleteNursingHome(id, key).then((response: any) => {
				window.location.reload();
			});
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
				{uploadingInfo || uploadingPics ? (
					<img
						src={config.PUBLIC_FILES_URL + "/icons/loading.gif"}
						alt="Waiting for an admin task"
						className=""
					/>
				) : (
					<input type="submit" value="Lähetä" />
				)}
				<br />
				{uploadingInfoResult}
				<br />
				{uploadingPicsResult}
			</form>
			
			Omaiskyselyn avainten luonti (kpl):

			<input
					id="create-keys-amount"
					type="number"
					onChange={(event: any) => setAmountSurveyKeys(event.target.value)}
				/>
			
			<button onClick={CreateSurveyKeys}>
				Luo avaimet
			</button>
			<br />

			{createdKeys.map((row: string) => (
				<div key={row}>
					{row}
					<br />
				</div>
			))}

			<br />
			<button onClick={ShowVacancyModificationLinks}>
				Näytä linkit vapaiden paikkojen muutoksiin
			</button>

			{linksToVacancySetting.map((link: string) => (
				<div key={link}>
					<br />
					{link}
					<br />
				</div>
			))}

			{nursingHomes &&
				nursingHomes.map((nursingHome: any) => (
					<div key={nursingHome.id}>
						<br />
						{nursingHome.name} - {nursingHome.postal_code}
						<button onClick={() => handleDelete(nursingHome.id)}>
							Poista
						</button>
						<br />
					</div>
				))}

			<br></br>
			<br></br>
			<br></br>
			<br></br>

			<button onClick={onRecreateButtonClicked}>
				Uudelleenluo tietokanat
			</button>
		</div>
	);
};

export default PageAdmin;
