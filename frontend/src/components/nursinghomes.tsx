import React, { useState, useEffect, FC } from "react";
import { NursingHomeSmall } from "./nursinghome-small";
import FilterItem from "./FilterItem";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/nursinghomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import * as config from "./config";
import { Link } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

type Language = string;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
}

const NursingHomes: FC = () => {
	const [nursingHomes, setNursingHomes] = useState<any[] | null>(null);

	const history = useHistory();
	const { search } = useLocation();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes")
			.then(function(response: any) {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => console.warn(error.message));
	}, []);

	const parsed = queryString.parse(search);
	const alue = parsed.alue ? (!Array.isArray(parsed.alue) ? [parsed.alue] : parsed.alue) : undefined;
	const ara = parsed.ara !== undefined ? parsed.ara === "true" : undefined;
	const lah = parsed.lah !== undefined ? parsed.lah === "true" : undefined;
	const searchFilters: SearchFilters = {
		alue,
		ara,
		lah,
		language: parsed.language as Language,
	};

	const optionsArea = [
		{ text: "Valitse alueet joilta etsit hoivakotia", type: "header" },
		...areas.map((value: string) => {
			const checked = searchFilters.alue ? searchFilters.alue.includes(value) : false;
			return { text: value, type: "checkbox", checked: checked };
		}),
		{ type: "separator" },
	];

	const optionsAra = [
		{ text: "ARA-kohde", type: "radio", checked: searchFilters.ara === true },
		{ text: "Ei ARA-kohde", type: "radio", checked: searchFilters.ara === false },
		{ type: "separator" },
		{
			text:
				"ARA-kohteet on rahoitettu valtion tuella, ja asukkaiden valintaperusteina ovat hakijan palvelutaloasunnon tarve sekä varallisuus.",
			type: "text",
		},
	];

	const optionsLanguage = [
		{ text: "Hoivakodin palvelukieli", type: "header" },
		{ text: "Suomi", type: "radio", checked: searchFilters.language === "Suomi" },
		{ text: "Ruotsi", type: "radio", checked: searchFilters.language === "Ruotsi" },
		{ type: "separator" },
	];

	const filterElements = (
		<>
			<FilterItem
				prefix="Sijainti"
				value={
					searchFilters.alue !== undefined
						? searchFilters.alue.length <= 2
							? searchFilters.alue.join(", ")
							: `(${searchFilters.alue.length} valintaa)`
						: null
				}
				values={optionsArea}
				ariaLabel="Valitse hoivakodin alue"
				onChange={({ newValue, name }) => {
					const newSearchFilters = { ...searchFilters };
					if (!newSearchFilters.alue) newSearchFilters.alue = [];
					if (!newValue)
						newSearchFilters.alue = newSearchFilters.alue.filter((value: string) => {
							return value !== name;
						});
					else if (!newSearchFilters.alue.includes(name)) newSearchFilters.alue.push(name);
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = { ...searchFilters, alue: undefined };
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Palvelukieli"
				value={searchFilters.language || null}
				values={optionsLanguage}
				ariaLabel="Valitse hoivakodin kieli"
				onChange={(newValue: any): void => {
					const newSearchFilters = { ...searchFilters, language: newValue };
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const stringfield = queryString.stringify({ ...searchFilters, language: undefined });
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Ara-kohde"
				value={searchFilters.ara !== undefined ? (searchFilters.ara ? "Kyllä" : "Ei") : null}
				values={optionsAra}
				ariaLabel="Valitse, näytetäänkö vain Ara-kohteet"
				onChange={(newValue: any) => {
					const newSearchFilters = {
						...searchFilters,
						ara: newValue === "ARA-kohde" ? true : false,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = { ...searchFilters, ara: undefined };
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>

			<FilterItem
				prefix="Lyhytaikainen asuminen"
				value={searchFilters.lah !== undefined ? (searchFilters.lah ? "Kyllä" : "Ei") : null}
				values={[{ text: "Lyhytaikainen asuminen LAH", type: "checkbox", checked: searchFilters.lah === true }]}
				ariaLabel="Valitse, näytetäänkö vain lyhyen ajan asumisen kohteet."
				onChange={({ newValue }): void => {
					const newSearchFilters = { ...searchFilters, lah: newValue === true ? true : undefined };
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = { ...searchFilters, lah: undefined };
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
		</>
	);

	const nursinghomeComponents: object[] | null =
		nursingHomes &&
		nursingHomes
			.filter((nursinghome: any) => {
				if (
					searchFilters.alue &&
					searchFilters.alue.length > 0 &&
					!searchFilters.alue.includes(nursinghome.location)
				)
					return false;
				if (searchFilters.language && nursinghome.language !== searchFilters.language) return false;
				if (searchFilters.ara !== undefined && nursinghome.ara !== searchFilters.ara) return false;
				if (searchFilters.lah && nursinghome.lah !== searchFilters.lah) return false;

				return true;
			})
			.map((nursinghome: any, index) => (
				<Link key={index} to={"/hoivakodit/" + nursinghome.id} style={{ textDecoration: "none" }}>
					<NursingHomeSmall nursinghome={nursinghome} key={index} />
				</Link>
			));

	const Map = ReactMapboxGl({
		accessToken:
			"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
		scrollZoom: false,
		minZoom: 11,
		maxZoom: 11,
	});

	return (
		<div>
			<div className="filters">
				<div className="filters-text">Rajaa tuloksia:</div>
				{nursingHomes && filterElements}
			</div>
			{!nursingHomes ? (
				"Ladataan..."
			) : (
				<div className="card-list-and-map-container">
					<div className="card-list">
						<h2 className="results-summary">
							{Object.keys(nursinghomeComponents || {}).length} hoivakotia
						</h2>
						{nursinghomeComponents}
					</div>
					<div id="map" className="map-container">
						<Map
							style="mapbox://styles/mapbox/streets-v9"
							center={[24.6559, 60.2055]}
							containerStyle={{
								height: "100vh",
								width: "100%",
								position: "sticky",
								top: 0,
							}}
						>
							<Layer
								type="symbol"
								id="marker"
								layout={{ "icon-image": "town-hall-15", "icon-size": 1.5 }}
							>
								<Feature coordinates={[24.6559, 60.2055]} />
								<Feature coordinates={[24.6, 60.2053]} />
								<Feature coordinates={[24.62, 60.2]} />
								<Feature coordinates={[24.7, 60.17]} />
							</Layer>
						</Map>
					</div>
				</div>
			)}
		</div>
	);
};

export { NursingHomes };
