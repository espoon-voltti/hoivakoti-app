import React, { useState, useEffect, FC } from "react";
import { NursingHomeSmall } from "./nursinghome-small";
import FilterItem from "./FilterItem";
import { useHistory } from "react-router-dom";
import "../styles/nursinghomes.scss";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import * as config from "./config";
import { Link } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

type Language = string;

interface SearchFilters {
	alue?: string[];
	language?: Language;
	ara?: boolean;
	lah?: boolean;
}

const NursingHomes: FC = () => {
	const [nursingHomes, setNursingHomes] = useState<any[] | null>(null);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

	const history = useHistory();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes")
			.then(function(response: any) {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => console.warn(error.message));
	}, []);

	useEffect(() => {
		const parsed = queryString.parse(history.location.search);
		const alue = parsed.alue ? (!Array.isArray(parsed.alue) ? [parsed.alue] : parsed.alue) : undefined;
		const ara = parsed.ara !== undefined ? parsed.ara === "true" : undefined;
		const lah = parsed.lah !== undefined ? parsed.lah === "true" : undefined;
		const newSearchFilters: SearchFilters = {
			alue,
			ara,
			lah,
			language: parsed.language as Language,
		};
		setSearchFilters(newSearchFilters);
	}, [history.location.search]);

	const search_as_any: any = searchFilters as any;

	const area_options = [
		{ text: "Valitse alueet joilta etsit hoivakotia", type: "header" },
		...areas.map((value: string) => {
			const checked = search_as_any.alue ? search_as_any.alue.includes(value) : false;
			return { text: value, type: "checkbox", checked: checked };
		}),
		{ type: "separator" },
	];

	const ara_options = [
		{ text: "ARA-kohde", type: "radio", checked: search_as_any.ara === true ? true : false },
		{ text: "Ei ARA-kohde", type: "radio", checked: search_as_any.ara === false ? true : false },
		{ type: "separator" },
		{
			text:
				"ARA-kohteet on rahoitettu valtion tuella, ja asukkaiden valintaperusteina ovat hakijan palvelutaloasunnon tarve sekä varallisuus.",
			type: "text",
		},
	];

	const language_options = [
		{ text: "Hoivakodin palvelukieli", type: "header" },
		{ text: "Suomi", type: "radio", checked: search_as_any.language === "Suomi" },
		{ text: "Ruotsi", type: "radio", checked: search_as_any.language === "Ruotsi" },
		{ type: "separator" },
	];

	const filters_dom = (
		<>
			<FilterItem
				prefix="Sijainti"
				value={searchFilters.alue !== undefined ? searchFilters.alue.join(", ") : null}
				values={area_options}
				ariaLabel="Valitse hoivakodin alue"
				onChange={(changed_object: any) => {
					//search_as_any.alue = areas.findIndex((v) => v === changed_object.value);
					if (!search_as_any.alue) search_as_any.alue = [];
					if (!changed_object.checked)
						search_as_any.alue = search_as_any.alue.filter((value: string) => {
							return value !== changed_object.value;
						});
					else if (!search_as_any.alue.includes(changed_object.value))
						search_as_any.alue.push(changed_object.value);
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					delete search_as_any.alue;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Palvelukieli"
				value={searchFilters.language || null}
				values={language_options}
				ariaLabel="Valitse hoivakodin kieli"
				onChange={(changed_object: any): void => {
					search_as_any.language = changed_object.value;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					delete search_as_any.language;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Ara-kohde"
				value={searchFilters.ara !== undefined ? (searchFilters.ara ? "Kyllä" : "Ei") : null}
				values={ara_options}
				ariaLabel="Valitse, näytetäänkö vain Ara-kohteet"
				onChange={(changed_object: any) => {
					search_as_any.ara = changed_object.value === "ARA-kohde" ? true : false;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					delete search_as_any.ara;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>

			<FilterItem
				prefix="Lyhytaikainen asuminen"
				value={searchFilters.lah !== undefined ? (searchFilters.lah ? "Kyllä" : "Ei") : null}
				values={[{ text: "Lyhytaikainen asuminen LAH", type: "checkbox", checked: search_as_any.lah === true }]}
				ariaLabel="Valitse, näytetäänkö vain lyhyen ajan asumisen kohteet."
				onChange={(changed_object: any): void => {
					//search_as_any.alue = areas.findIndex((v) => v === changed_object.value);
					if (changed_object.checked) search_as_any.lah = true;
					else search_as_any.lah = undefined;
					const stringfield = queryString.stringify(search_as_any);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					delete search_as_any.lah;
					const stringfield = queryString.stringify(search_as_any);
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
					(searchFilters as any).alue &&
					(searchFilters as any).alue.length > 0 &&
					!(searchFilters as any).alue.includes(nursinghome.location)
				)
					return false;
				if ((searchFilters as any).language && nursinghome.language !== (searchFilters as any).language)
					return false;
				if ((searchFilters as any).ara !== undefined && nursinghome.ara !== (searchFilters as any).ara)
					return false;
				if ((searchFilters as any).lah && nursinghome.lah !== (searchFilters as any).lah) return false;

				return true;
			})
			.map((nursinghome: any, index) => {
				// const rating: any = (ratings as any)[nursinghome.id];
				return (
					<Link key={index} to={"/hoivakodit/" + nursinghome.id} style={{ textDecoration: "none" }}>
						<NursingHomeSmall nursinghome={nursinghome} key={index} />
					</Link>
				);
			});

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
				{nursingHomes && filters_dom}
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
