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
import i18next, { TranslationKey, useT } from "../i18n";
import { NursingHome } from "./types";
import { Commune } from "./commune";

type Language = string;

const getTranslationByLanguage = (
	language: Language,
	key: TranslationKey,
): string => {
	return i18next.getResource(language, "defaultNameSpace", key);
};

const calculateMapVisible = (width: number): boolean => width >= 1130;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
	readonly commune?: string[];
}

interface Translation {
	[key: string]: string;
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

	const citiesFI: Translation = {
		[Commune.EPK]: getTranslationByLanguage("fi-FI", "espoon keskus"),
		[Commune.EPL]: getTranslationByLanguage("fi-FI", "espoonlahti"),
		[Commune.LPV]: getTranslationByLanguage("fi-FI", "leppävaara"),
		[Commune.MKL]: getTranslationByLanguage("fi-FI", "matinkylä"),
		[Commune.TAP]: getTranslationByLanguage("fi-FI", "tapiola"),
		[Commune.HEL]: getTranslationByLanguage("fi-FI", "helsinki"),
		[Commune.HVK]: getTranslationByLanguage("fi-FI", "hyvinkää"),
		[Commune.JVP]: getTranslationByLanguage("fi-FI", "järvenpää"),
		[Commune.KAR]: getTranslationByLanguage("fi-FI", "karjaa"),
		[Commune.HNK]: getTranslationByLanguage("fi-FI", "hanko"),
		[Commune.KER]: getTranslationByLanguage("fi-FI", "kerava"),
		[Commune.KRN]: getTranslationByLanguage("fi-FI", "kirkkonummi"),
		[Commune.LHJ]: getTranslationByLanguage("fi-FI", "lohja"),
		[Commune.NRJ]: getTranslationByLanguage("fi-FI", "nurmijärvi"),
		[Commune.RPO]: getTranslationByLanguage("fi-FI", "raasepori"),
		[Commune.STO]: getTranslationByLanguage("fi-FI", "sipoo"),
		[Commune.MKL]: getTranslationByLanguage("fi-FI", "siuntio"),
		[Commune.TSL]: getTranslationByLanguage("fi-FI", "tuusula"),
		[Commune.VTA]: getTranslationByLanguage("fi-FI", "vantaa"),
		[Commune.VTI]: getTranslationByLanguage("fi-FI", "vihti"),
	};

	const districtsSV: Translation = {
		[Commune.EPK]: getTranslationByLanguage("fi-FI", "espoon keskus"),
		[Commune.EPL]: getTranslationByLanguage("fi-FI", "espoonlahti"),
		[Commune.LPV]: getTranslationByLanguage("fi-FI", "leppävaara"),
		[Commune.MKL]: getTranslationByLanguage("fi-FI", "matinkylä"),
		[Commune.TAP]: getTranslationByLanguage("fi-FI", "tapiola"),
	};

	const espooAreaTranslations: Translation = {
		[Commune.EPK]: useT("espoon keskus"),
		[Commune.EPL]: useT("espoonlahti"),
		[Commune.LPV]: useT("leppävaara"),
		[Commune.MKL]: useT("matinkylä"),
		[Commune.TAP]: useT("tapiola"),
	};
	const espooTranslation: Translation = {
		[Commune.EPO]: useT("espoo"),
	};
	const otherCitiesTranslations: Translation = {
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

	const citiesTranslationsAll = {
		...espooTranslation,
		...espooAreaTranslations,
		...otherCitiesTranslations,
	};

	useEffect(() => {
		if (nursingHomes) {
			const filteredNursingHomes:
				| NursingHome[]
				| null = nursingHomes.filter(nursinghome => {
				if (searchFilters.alue && searchFilters.alue.length > 0) {
					const notCorrectArea =
						!searchFilters.alue.includes(nursinghome.district) &&
						!searchFilters.alue.includes(nursinghome.city);

					const cityKeyFI = Object.keys(citiesFI).filter(
						translation => {
							return citiesFI[translation] === nursinghome.city;
						},
					)[0];

					const districtKeySV = Object.keys(districtsSV).filter(
						translation => {
							return (
								districtsSV[translation] ===
								nursinghome.district
							);
						},
					)[0];

					const notCorrectAreaTranslation =
						!searchFilters.alue.includes(citiesFI[cityKeyFI]) &&
						!searchFilters.alue.includes(
							districtsSV[districtKeySV],
						);

					if (notCorrectArea && notCorrectAreaTranslation) {
						return false;
					}
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
						citiesTranslationsAll,
					).filter(commune => {
						const key = commune as Commune;
						if (
							searchFilters.commune &&
							searchFilters.commune.includes(
								citiesTranslationsAll[key],
							)
						) {
							return key;
						}
					});

					const correctCommune = filtersToKeys.some(commune => {
						return (
							nursinghome.communes &&
							nursinghome.communes.includes(commune as Commune)
						);
					});

					if (!correctCommune) {
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

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		...Object.keys(espooTranslation).map<FilterOption>(key => {
			return {
				name: espooTranslation[key],
				label: espooTranslation[key],
				type: "checkbox",
				checked: espooChecked,
				bold: true,
			};
		}),
		...Object.keys(espooAreaTranslations).map<FilterOption>(key => {
			const value = espooAreaTranslations[key];

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
		...Object.keys(otherCitiesTranslations).map<FilterOption>(key => {
			const value = otherCitiesTranslations[key];

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

	const optionsCommune: FilterOption[] = [
		...Object.keys(espooTranslation).map<FilterOption>(key => {
			return {
				name: espooTranslation[key],
				label: espooTranslation[key],
				type: "checkbox",
				checked: searchFilters.commune
					? searchFilters.commune.includes(espooTranslation[key])
					: false,
				bold: true,
			};
		}),
		...Object.keys(espooAreaTranslations).map<FilterOption>(key => {
			const value = espooAreaTranslations[key];

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: searchFilters.commune
					? searchFilters.commune.includes(espooAreaTranslations[key])
					: false,
				withMargin: true,
			};
		}),
		...Object.keys(otherCitiesTranslations).map<FilterOption>(key => {
			const value = otherCitiesTranslations[key];

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: searchFilters.commune
					? searchFilters.commune.includes(
							otherCitiesTranslations[key],
					  )
					: false,
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
				values={optionsCommune}
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
