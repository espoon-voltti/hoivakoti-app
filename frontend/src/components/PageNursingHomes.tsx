import React, { useState, useEffect, FC } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/PageNursingHomes.scss";
import config from "./config";
import { Link as div } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import Map from "./Map";
import { useT } from "../translations";
import { NursingHome } from "./types";

type Language = string;

const calculateMapVisible = (width: number): boolean => width >= 1130;

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
	const [isMapVisible, setIsMapVisible] = useState(
		calculateMapVisible(window.innerWidth),
	);

	const history = useHistory();
	const { search } = useLocation();

	useEffect(() => {
		const listener = (): void => {
			setIsMapVisible(calculateMapVisible(window.innerWidth));
		};
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, []);

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

	const locationPickerLabel = useT("locationPickerLabel");

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		...areas.map<FilterOption>((value: string) => {
			const checked = searchFilters.alue
				? searchFilters.alue.includes(value)
				: false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
			};
		}),
	];

	const filterLabel = useT("filterLabel");
	const filterAraLabel = useT("filterAraLabel");
	const filterAraText = useT("filterAraText");
	const filterAraLabel2 = useT("filterAraLabel2");
	const filterAraText2 = useT("filterAraText2");
	const filterAraDesc = useT("filterAraDesc");

	const filterLAH = useT("filterLAH");
	const filterLAHLabel = useT("filterLAH");
	const filterLAHText = useT("filterLAHText");

	const serviceLanguage = useT("serviceLanguage");
	const serviceLanguageLabel = useT("serviceLanguageLabel");
	const filterFinnish = useT("filterFinnish");
	const filterSwedish = useT("filterSwedish");

	const filterYes = useT("filterYes");
	const filterNo = useT("filterNo");
	const filterLocation = useT("filterLocation");

	const summaryLabel = useT("summaryLabel");
	const loadingText = useT("loadingText");

	const filterSelections = useT("filterSelections");

	const optionsAra: FilterOption[] = [
		{
			name: "ARA-kohde",
			label: filterAraLabel,
			subLabel: filterAraText,
			type: "radio",
			checked: searchFilters.ara === true,
		},
		{
			name: "",
			label: filterAraLabel,
			subLabel: filterAraText2,
			type: "radio",
			checked: searchFilters.ara === false,
		},
		{
			text: filterAraDesc,
			type: "text",
		},
	];

	const optionsLanguage: FilterOption[] = [
		{ text: serviceLanguageLabel, type: "header" },
		{
			name: "Suomi",
			label: filterFinnish,
			type: "radio",
			checked: searchFilters.language === "Suomi",
		},
		{
			name: "Ruotsi",
			label: filterSwedish,
			type: "radio",
			checked: searchFilters.language === "Ruotsi",
		},
	];

	const isFilterDisabled = nursingHomes === null;

	const filterElements = (
		<>
			<FilterItem
				prefix={filterLocation}
				value={
					searchFilters.alue !== undefined
						? searchFilters.alue.length <= 2
							? searchFilters.alue.join(", ")
							: `(${searchFilters.alue.length} ${filterSelections})`
						: null
				}
				values={optionsArea}
				ariaLabel="Valitse hoivakodin alue"
				disabled={isFilterDisabled}
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
				prefix={serviceLanguage}
				value={searchFilters.language || null}
				values={optionsLanguage}
				ariaLabel="Valitse hoivakodin kieli"
				disabled={isFilterDisabled}
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
				prefix={filterAraLabel}
				value={
					searchFilters.ara !== undefined
						? searchFilters.ara
							? filterYes
							: filterNo
						: null
				}
				values={optionsAra}
				ariaLabel="Valitse, näytetäänkö vain Ara-kohteet"
				disabled={isFilterDisabled}
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
				prefix={filterLAH}
				value={
					searchFilters.lah !== undefined
						? searchFilters.lah
							? filterYes
							: filterNo
						: null
				}
				values={[
					{
						name: "lah",
						label: filterLAHLabel,
						subLabel: filterLAHText,
						type: "checkbox",
						checked: searchFilters.lah === true,
					},
				]}
				ariaLabel="Valitse, näytetäänkö vain lyhyen ajan asumisen kohteet."
				disabled={isFilterDisabled}
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

	const cards: JSX.Element[] | null =
		filteredNursingHomes &&
		filteredNursingHomes.map((nursingHome, index) => (
			<div key={index}>
				<div
					className={`card-list-item-borders ${
						index === filteredNursingHomes.length - 1
							? "card-list-item-borders-last"
							: ""
					}`}
					onMouseEnter={() =>
						setMapPopup({
							selectedNursingHome: nursingHome,
							isExpanded: false,
						})
					}
					onMouseLeave={() => setMapPopup(null)}
				>
					<CardNursingHome nursinghome={nursingHome} />
				</div>
			</div>
		));

	return (
		<div>
			<div className="filters">
				<div className="filters-text">{filterLabel}</div>
				{filterElements}
			</div>
			<div className="card-list-and-map-container">
				<div className="card-list">
					<h2 className="results-summary">
						{filteredNursingHomes
							? `${filteredNursingHomes.length} ${summaryLabel}`
							: loadingText}
					</h2>
					<div className="card-container">{cards}</div>
				</div>
				<div id="map" className="map-container">
					{isMapVisible && (
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
					)}
				</div>
			</div>
		</div>
	);
};

export default PageNursingHomes;
