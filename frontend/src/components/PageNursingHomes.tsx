import React, { useState, useEffect, FC } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation, Link } from "react-router-dom";
import "../styles/PageNursingHomes.scss";
import config from "./config";
import { Link as div } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import Map from "./Map";
import { useT } from "../i18n";
import { NursingHome } from "./types";
import { Commune } from "./commune";

type Language = string;

const calculateMapVisible = (width: number): boolean => width >= 1130;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
	readonly commune?: string[];
}

const PageNursingHomes: FC = () => {
	const history = useHistory();
	const { search } = useLocation();

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
	const [filteredNursingHomes, setFilteredNursingHomes] = useState<
		NursingHome[] | null
	>(null);

	useEffect(() => {
		const listener = (): void => {
			setIsMapVisible(calculateMapVisible(window.innerWidth));
		};
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, []);

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

	const hasFilters = search !== "";
	const isFilterDisabled = nursingHomes === null;

	const parsed = queryString.parse(search);

	const area = parsed.alue
		? !Array.isArray(parsed.alue)
			? [parsed.alue]
			: parsed.alue
		: undefined;

	const ara = parsed.ara !== undefined ? parsed.ara === "true" : undefined;
	const lah = parsed.lah !== undefined ? parsed.lah === "true" : undefined;

	const commune = parsed.commune
		? !Array.isArray(parsed.commune)
			? [parsed.commune]
			: parsed.commune
		: undefined;

	const searchFilters: SearchFilters = {
		alue: area,
		ara,
		lah,
		language: parsed.language as Language,
		commune,
	};

	const citiesAndDistrictsToFinnish = {
		"Esbo centrum": "Espoon keskus",
		Esboviken: "Espoonlahti",
		Alberga: "Leppävaara",
		Mattby: "Matinkylä",
		Hagalund: "Tapiola",
		Helsingfors: "Helsinki",
		Hyvinge: "Hyvinkää",
		Träskända: "Järvenpää",
		Karis: "Karjaa",
		Hangö: "Hanko",
		Högfors: "Karkkila",
		Kervo: "Kerava",
		Kyrkslätt: "Kirkkonummi",
		Lojo: "Lohja",
		Nurmijärvi: "Nurmijärvi",
		Raseborg: "Raasepori",
		Sibbo: "Sipoo",
		Sjundeå: "Siuntio",
		Ekenäs: "Tammisaari",
		Tusby: "Tuusula",
		Vanda: "Vantaa",
		Vichtis: "Vihti",
	};

	const citiesAndDistrictsToSwedish = {
		"Espoon keskus": "Esbo centrum",
		Espoonlahti: "Esboviken",
		Leppävaara: "Alberga",
		Matinkylä: "Mattby",
		Tapiola: "Hagalund",
	};

	const communeTranslations = {
		[Commune.EPO]: useT("espoo"),
		[Commune.EPK]: useT("espoon keskus"),
		[Commune.EPL]: useT("espoonlahti"),
		[Commune.LPV]: useT("leppävaara"),
		[Commune.MKL]: useT("matinkylä"),
		[Commune.TAP]: useT("tapiola"),
		[Commune.HNK]: useT("hanko"),
		[Commune.HEL]: useT("helsinki"),
		[Commune.HVK]: useT("hyvinkää"),
		[Commune.JVP]: useT("järvenpää"),
		[Commune.KAR]: useT("karjaa"),
		[Commune.KER]: useT("kerava"),
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.NRJ]: useT("nurmijärvi"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.SPO]: useT("sipoo"),
		[Commune.STO]: useT("siuntio"),
		[Commune.TSL]: useT("tuusula"),
		[Commune.VTA]: useT("vantaa"),
		[Commune.VTI]: useT("vihti"),
	};

	useEffect(() => {
		if (nursingHomes) {
			const filteredNursingHomes:
				| NursingHome[]
				| null = nursingHomes.filter(nursinghome => {
				const notCorrectArea =
					searchFilters.alue &&
					searchFilters.alue.length > 0 &&
					(!searchFilters.alue.includes(nursinghome.district) &&
						!searchFilters.alue.includes(nursinghome.city)) &&
					!searchFilters.alue.includes(
						(citiesAndDistrictsToFinnish as any)[nursinghome.city],
					) &&
					!searchFilters.alue.includes(
						(citiesAndDistrictsToSwedish as any)[
							nursinghome.district
						],
					);

				if (notCorrectArea) {
					return false;
				}

				const notCorrecLanguage =
					searchFilters.language &&
					nursinghome.language &&
					!nursinghome.language.includes(searchFilters.language);

				if (notCorrecLanguage) {
					return false;
				}

				const notARADestination =
					searchFilters.ara !== undefined &&
					((nursinghome.ara === "Kyllä" && !searchFilters.ara) ||
						(nursinghome.ara === "Ei" && searchFilters.ara));

				if (notARADestination) {
					return false;
				}

				const notLahDestination =
					searchFilters.lah && nursinghome.lah !== searchFilters.lah;

				if (notLahDestination) {
					return false;
				}

				if (searchFilters.commune) {
					const filtersToKeys = Object.keys(
						communeTranslations,
					).filter(commune => {
						const key = commune as Commune;
						if (
							searchFilters.commune &&
							searchFilters.commune.includes(
								communeTranslations[key],
							)
						) {
							return key;
						}
					});

					const correctcommune = filtersToKeys.some(commune => {
						return (
							nursinghome.communes &&
							nursinghome.communes.includes(commune as Commune)
						);
					});

					if (!correctcommune) {
						return false;
					}
				}

				return true;
			});

			setFilteredNursingHomes(filteredNursingHomes);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, history, nursingHomes]);

	const locationPickerLabel = useT("locationPickerLabel");

	const espooAreas = [
		useT("espoon keskus"),
		useT("espoonlahti"),
		useT("leppävaara"),
		useT("matinkylä"),
		useT("tapiola"),
	];
	const espoo = useT("espoo");
	const otherCities = [
		useT("hanko"),
		useT("helsinki"),
		useT("hyvinkää"),
		useT("järvenpää"),
		useT("karkkila"),
		useT("kerava"),
		useT("kirkkonummi"),
		useT("lohja"),
		useT("nurmijärvi"),
		useT("raasepori"),
		useT("sipoo"),
		useT("siuntio"),
		useT("tuusula"),
		useT("vantaa"),
		useT("vihti"),
	];

	const filterLabel = useT("filterLabel");
	const filterAraLabel = useT("filterAraLabel");
	const filterAraText = useT("filterAraText");
	const filterAraLabel2 = useT("filterAraLabel2");
	const filterAraText2 = useT("filterAraText2");
	const filterAraDesc1 = useT("filterAraDesc1");
	const filterAraDesc2 = useT("filterAraDesc2");

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
	const clearFilters = useT("clearFilters");
	const filterSelections = useT("filterSelections");

	const espooChecked = searchFilters.alue
		? searchFilters.alue.includes("Espoo")
		: false;

	const espooCheckboxItem: FilterOption = {
		name: "Espoo",
		label: espoo,
		type: "checkbox",
		checked: espooChecked,
		bold: true,
	};

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		espooCheckboxItem,
		...espooAreas.map<FilterOption>((value: string) => {
			const checked = searchFilters.alue
				? searchFilters.alue.includes(value)
				: false;

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				withMargin: true,
			};
		}),
		...otherCities.map<FilterOption>((value: string) => {
			const checked = searchFilters.alue
				? searchFilters.alue.includes(value)
				: false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				bold: true,
				alignment: "right",
			};
		}),
	];

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
			label: filterAraLabel2,
			subLabel: filterAraText2,
			type: "radio",
			checked: searchFilters.ara === false,
		},
		{
			text: filterAraDesc1,
			type: "text",
		},
		{
			text: filterAraDesc2,
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

	const optionscommune: FilterOption[] = [
		...Object.values(Commune).map<FilterOption>(commune => {
			const name = communeTranslations[commune];

			return {
				name: name,
				label: name,
				type: "checkbox",
				checked: searchFilters.commune
					? searchFilters.commune.includes(name)
					: false,
			};
		}),
	];

	const handleCityInputChange = (
		checked: boolean,
		name: string,
		filterGroup: "alue" | "commune",
	): void => {
		const newSearchFilters = { ...searchFilters };
		let groupFilters = newSearchFilters[filterGroup];

		if (!groupFilters) {
			groupFilters = [];
		}
		// If the district/city was unchecked
		if (!checked) {
			// Normal flow: Remove district/city to search filters if
			// present

			groupFilters = groupFilters.filter((value: string) => {
				return value !== name;
			});

			// Weird flow to accommodate the Espoo special selection
			if (name === "Espoo") {
				groupFilters = groupFilters.filter((value: string) => {
					return !espooAreas.includes(value);
				});
			} else if (espooAreas.includes(name)) {
				groupFilters = groupFilters.filter((value: string) => {
					return value !== "Espoo";
				});
			}
			// If the district/city was checked
		} else {
			// Normal flow: Add district/city to search filters if
			// not already added
			if (!groupFilters.includes(name)) {
				groupFilters.push(name);
			}

			// Weird flow to accommodate the Espoo special selection
			if (name === "Espoo") {
				for (const district of espooAreas) {
					if (!groupFilters.includes(district)) {
						groupFilters.push(district);
					}
				}
			} else if (espooAreas.includes(name)) {
				const included = espooAreas.filter(disctrict => {
					return groupFilters && groupFilters.includes(disctrict);
				}).length;

				if (included === espooAreas.length) {
					groupFilters.push("Espoo");
				}
			}
		}

		newSearchFilters[filterGroup] = groupFilters;

		const stringfield = queryString.stringify(newSearchFilters);
		history.push("/hoivakodit?" + stringfield);
	};

	const filterElements: JSX.Element | null = (
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
				onChange={({ newValue, name }) =>
					handleCityInputChange(newValue, name, "alue")
				}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						area: undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix="Kotikunta"
				value={
					searchFilters.commune !== undefined
						? searchFilters.commune.length <= 2
							? searchFilters.commune.join(", ")
							: `(${searchFilters.commune.length} ${filterSelections})`
						: null
				}
				values={optionscommune}
				ariaLabel="Valitse kotikunta"
				disabled={isFilterDisabled}
				onChange={({ newValue, name }) =>
					handleCityInputChange(newValue, name, "commune")
				}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						commune: undefined,
					};

					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				prefix={serviceLanguage}
				value={
					searchFilters.language === "Suomi"
						? filterFinnish
						: searchFilters.language === "Ruotsi"
						? filterSwedish
						: null
				}
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
						{filteredNursingHomes ? (
							<>
								<span className="results-summary-text">
									{filteredNursingHomes.length} {summaryLabel}
								</span>
								{hasFilters && (
									<Link
										to="/hoivakodit"
										className="btn--clear-filters"
									>
										{clearFilters}
									</Link>
								)}
							</>
						) : (
							loadingText
						)}
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
