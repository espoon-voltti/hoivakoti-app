import React, { useState, useEffect, FC } from "react";
import { NursingHomeSmall } from "./NursingHomeSmall";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/nursinghomes.scss";
import config from "./config";
import { Link } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import Map from "./Map";
import { NursingHome } from "./types";

type Language = string;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
}

const PageNursingHomes: FC = () => {
	const [nursingHomes, setNursingHomes] = useState<NursingHome[] | null>(
		null,
	);
	const [mapPopup, setMapPopup] = useState<{
		selectedNursingHome: NursingHome;
		isExpanded: boolean;
	} | null>(null);

	const history = useHistory();
	const { search } = useLocation();

	const areas = [
		"Espoon keskus",
		"Espoonlahti",
		"Leppävaara",
		"Matinkylä",
		"Tapiola",
	];

	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes")
			.then(function(response: { data: NursingHome[] }) {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => {
				console.error(error.message);
				throw error;
			});
	}, []);

	const parsed = queryString.parse(search);
	const alue = parsed.alue
		? !Array.isArray(parsed.alue)
			? [parsed.alue]
			: parsed.alue
		: undefined;
	const ara = parsed.ara !== undefined ? parsed.ara === "true" : undefined;
	const lah = parsed.lah !== undefined ? parsed.lah === "true" : undefined;
	const searchFilters: SearchFilters = {
		alue,
		ara,
		lah,
		language: parsed.language as Language,
	};

	const optionsArea: FilterOption[] = [
		{ text: "Miltä alueelta etsit hoivakotia?", type: "header" },
		...areas.map<FilterOption>((value: string) => {
			const checked = searchFilters.alue
				? searchFilters.alue.includes(value)
				: false;
			return { text: value, type: "checkbox", checked: checked };
		}),
	];

	const optionsAra: FilterOption[] = [
		{
			text: "ARA-kohde",
			subText: "Näytä vain ARA-kohteet",
			type: "radio",
			checked: searchFilters.ara === true,
		},
		{
			text: "Ei ARA-kohde",
			subText: "Piilota ARA-kohteet",
			type: "radio",
			checked: searchFilters.ara === false,
		},
		{
			text:
				"ARA-kohteet on rahoitettu valtion tuella, ja asukkaiden valintaperusteina ovat palvelutarve sekä varallisuus.",
			type: "text",
		},
	];

	const optionsLanguage: FilterOption[] = [
		{ text: "Hoivakodin palvelukieli", type: "header" },
		{
			text: "Suomi",
			type: "radio",
			checked: searchFilters.language === "Suomi",
		},
		{
			text: "Ruotsi",
			type: "radio",
			checked: searchFilters.language === "Ruotsi",
		},
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
						newSearchFilters.alue = newSearchFilters.alue.filter(
							(value: string) => {
								return value !== name;
							},
						);
					else if (!newSearchFilters.alue.includes(name))
						newSearchFilters.alue.push(name);
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						alue: undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Palvelukieli"
				value={searchFilters.language || null}
				values={optionsLanguage}
				ariaLabel="Valitse hoivakodin kieli"
				onChange={({ name }): void => {
					const newSearchFilters = {
						...searchFilters,
						language: name,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const stringfield = queryString.stringify({
						...searchFilters,
						language: undefined,
					});
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Ara-kohde"
				value={
					searchFilters.ara !== undefined
						? searchFilters.ara
							? "Kyllä"
							: "Ei"
						: null
				}
				values={optionsAra}
				ariaLabel="Valitse, näytetäänkö vain Ara-kohteet"
				onChange={({ name }) => {
					const newSearchFilters = {
						...searchFilters,
						ara: name === "ARA-kohde" ? true : false,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						ara: undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>

			<FilterItem
				prefix="Lyhytaikainen asuminen"
				value={
					searchFilters.lah !== undefined
						? searchFilters.lah
							? "Kyllä"
							: "Ei"
						: null
				}
				values={[
					{
						text: "Lyhytaikainen asuminen LAH",
						subText:
							"Näytä vain lyhytaikaista asumista tarjoavat paikat.",
						type: "checkbox",
						checked: searchFilters.lah === true,
					},
				]}
				ariaLabel="Valitse, näytetäänkö vain lyhyen ajan asumisen kohteet."
				onChange={({ newValue }): void => {
					const newSearchFilters = {
						...searchFilters,
						lah: newValue === true ? true : undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						lah: undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
		</>
	);

	const filteredNursingHomes: NursingHome[] | null =
		nursingHomes &&
		nursingHomes.filter(nursinghome => {
			if (
				searchFilters.alue &&
				searchFilters.alue.length > 0 &&
				!searchFilters.alue.includes(nursinghome.district)
			)
				return false;
			if (
				searchFilters.language &&
				nursinghome.language !== searchFilters.language
			)
				return false;
			if (
				searchFilters.ara !== undefined &&
				nursinghome.ara !== searchFilters.ara
			)
				return false;
			if (searchFilters.lah && nursinghome.lah !== searchFilters.lah)
				return false;

			return true;
		});

	const nursingHomeComponents: JSX.Element[] | null =
		filteredNursingHomes &&
		filteredNursingHomes.map((nursingHome, index) => (
			<React.Fragment key={index}>
				<Link
					to={"/hoivakodit/" + nursingHome.id}
					style={{ textDecoration: "none" }}
					className="card-list-item-borders card-desktop"
					onMouseEnter={() =>
						setMapPopup({
							selectedNursingHome: nursingHome,
							isExpanded: false,
						})
					}
					onMouseLeave={() => setMapPopup(null)}
				>
					<NursingHomeSmall
						nursinghome={nursingHome}
						isNarrow={false}
					/>
				</Link>
				<div className="card-list-item-borders card-mobile">
					<NursingHomeSmall
						nursinghome={nursingHome}
						isNarrow={true}
					/>
				</div>
			</React.Fragment>
		));

	return (
		<div>
			<div className="filters">
				<div className="filters-text">Rajaa tuloksia:</div>
				{nursingHomes && filterElements}
			</div>
			{!nursingHomes || !filteredNursingHomes ? (
				"Ladataan..."
			) : (
				<div className="card-list-and-map-container">
					<div className="card-list">
						<h2 className="results-summary">
							{Object.keys(nursingHomeComponents || {}).length}{" "}
							hoivakotia
						</h2>
						{nursingHomeComponents}
					</div>
					<div id="map" className="map-container">
						<Map
							nursingHomes={filteredNursingHomes}
							popup={mapPopup}
							onSelectNursingHome={selectedNursingHome =>
								setMapPopup(
									selectedNursingHome && {
										selectedNursingHome,
										isExpanded: true,
									},
								)
							}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default PageNursingHomes;
