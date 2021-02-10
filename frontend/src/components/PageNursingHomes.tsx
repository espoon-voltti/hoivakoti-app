import React, { useState, useEffect, FC } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation, Link } from "react-router-dom";
import "../styles/PageNursingHomes.scss";
import config from "./config";
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
	readonly kotikunta?: string[];
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
			.then(async (response: { data: NursingHome[] }) => {
				const nursingHomesTempData: NursingHome[] = [];

				for (const item of response.data) {
					const communesRequest = await axios.get(
						`${config.API_URL}/nursing-homes/${item.id}/communes`,
					);

					const updateNursingHome = { ...item };
					updateNursingHome["customer_commune"] =
						communesRequest.data;

					nursingHomesTempData.push(updateNursingHome);
				}

				setNursingHomes(nursingHomesTempData);
			})
			.catch((error: Error) => {
				console.error(error.message);
				throw error;
			});
	}, []);

	const LUCommunes: Translation = {
		[Commune.EPO]: useT("espoo"),
		[Commune.HNK]: useT("hanko"),
		[Commune.INK]: useT("inkoo"),
		[Commune.KAU]: useT("kauniainen"),
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.PKA]: useT("karviainen"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.STO]: useT("siuntio"),
	};

	const communesKeysList: string[] = Object.keys(LUCommunes);

	const communesIntoThirds = communesKeysList.map(_ =>
		communesKeysList.splice(0, 3),
	);

	const locationPickerLabel = useT("locationPickerLabel");
	const selectCommuneLabel = useT("selectCommuneLabel");

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
	const filterNursingHomeArea = useT("filterNursingHomeArea");
	const labelCustomerCommune = useT("customerCommune");
	const filterCommune = useT("filterCommune");
	const filterLanguage = useT("filterLanguage");
	const filterShowARA = useT("filterShowARA");
	const filterShowLah = useT("filterShowLah");

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

	//City or district can appear in Finnish or Swedish regardless of the current language.
	const citiesAndDistrictsMapFI: Translation = {
		[getTranslationByLanguage(
			"fi-SV",
			"espoon keskus",
		)]: getTranslationByLanguage("fi-FI", "espoon keskus"),
		[getTranslationByLanguage(
			"fi-SV",
			"espoonlahti",
		)]: getTranslationByLanguage("fi-FI", "espoonlahti"),
		[getTranslationByLanguage(
			"fi-SV",
			"leppävaara",
		)]: getTranslationByLanguage("fi-FI", "leppävaara"),
		[getTranslationByLanguage(
			"fi-SV",
			"matinkylä",
		)]: getTranslationByLanguage("fi-FI", "matinkylä"),
		[getTranslationByLanguage(
			"fi-SV",
			"tapiola",
		)]: getTranslationByLanguage("fi-FI", "tapiola"),
		[getTranslationByLanguage(
			"fi-SV",
			"helsinki",
		)]: getTranslationByLanguage("fi-FI", "helsinki"),
		[getTranslationByLanguage(
			"fi-SV",
			"hyvinkää",
		)]: getTranslationByLanguage("fi-FI", "hyvinkää"),
		[getTranslationByLanguage(
			"fi-SV",
			"järvenpää",
		)]: getTranslationByLanguage("fi-FI", "järvenpää"),
		[getTranslationByLanguage("fi-SV", "karjaa")]: getTranslationByLanguage(
			"fi-FI",
			"karjaa",
		),
		[getTranslationByLanguage("fi-SV", "hanko")]: getTranslationByLanguage(
			"fi-FI",
			"hanko",
		),
		[getTranslationByLanguage(
			"fi-SV",
			"karkkila",
		)]: getTranslationByLanguage("fi-FI", "karkkila"),
		[getTranslationByLanguage("fi-SV", "kerava")]: getTranslationByLanguage(
			"fi-FI",
			"kerava",
		),
		[getTranslationByLanguage(
			"fi-SV",
			"kirkkonummi",
		)]: getTranslationByLanguage("fi-FI", "kirkkonummi"),
		[getTranslationByLanguage("fi-SV", "lohja")]: getTranslationByLanguage(
			"fi-FI",
			"lohja",
		),
		[getTranslationByLanguage(
			"fi-SV",
			"nurmijärvi",
		)]: getTranslationByLanguage("fi-FI", "nurmijärvi"),
		[getTranslationByLanguage(
			"fi-SV",
			"raasepori",
		)]: getTranslationByLanguage("fi-FI", "raasepori"),
		[getTranslationByLanguage("fi-SV", "sipoo")]: getTranslationByLanguage(
			"fi-FI",
			"sipoo",
		),
		[getTranslationByLanguage(
			"fi-SV",
			"siuntio",
		)]: getTranslationByLanguage("fi-FI", "siuntio"),
		[getTranslationByLanguage(
			"fi-SV",
			"tammisaari",
		)]: getTranslationByLanguage("fi-FI", "tammisaari"),
		[getTranslationByLanguage(
			"fi-SV",
			"tuusula",
		)]: getTranslationByLanguage("fi-FI", "tuusula"),
		[getTranslationByLanguage("fi-SV", "vantaa")]: getTranslationByLanguage(
			"fi-FI",
			"vantaa",
		),
		[getTranslationByLanguage("fi-SV", "vihti")]: getTranslationByLanguage(
			"fi-FI",
			"vihti",
		),
	};

	const citiesAndDistrictsMapSV: Translation = {
		[getTranslationByLanguage(
			"fi-FI",
			"espoon keskus",
		)]: getTranslationByLanguage("fi-SV", "espoon keskus"),
		[getTranslationByLanguage(
			"fi-FI",
			"espoonlahti",
		)]: getTranslationByLanguage("fi-SV", "espoonlahti"),
		[getTranslationByLanguage(
			"fi-FI",
			"leppävaara",
		)]: getTranslationByLanguage("fi-SV", "leppävaara"),
		[getTranslationByLanguage(
			"fi-FI",
			"matinkylä",
		)]: getTranslationByLanguage("fi-SV", "matinkylä"),
		[getTranslationByLanguage(
			"fi-FI",
			"tapiola",
		)]: getTranslationByLanguage("fi-SV", "tapiola"),
	};

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

	const commune = parsed.kotikunta
		? !Array.isArray(parsed.kotikunta)
			? [parsed.kotikunta]
			: parsed.kotikunta
		: undefined;

	const searchFilters: SearchFilters = {
		alue: area,
		ara,
		lah,
		language: parsed.language as Language,
		kotikunta: commune,
	};

	useEffect(() => {
		if (nursingHomes) {
			const filteredNursingHomes:
				| NursingHome[]
				| null = nursingHomes.filter(nursinghome => {
				if (searchFilters.alue && searchFilters.alue.length > 0) {
					const notInCorrectArea =
						!searchFilters.alue.includes(nursinghome.district) &&
						!searchFilters.alue.includes(nursinghome.city);

					const cityKeyFI = Object.keys(
						citiesAndDistrictsMapFI,
					).filter(translation => {
						return (
							citiesAndDistrictsMapFI[translation] ===
							nursinghome.city
						);
					})[0];

					const districtKeySV = Object.keys(
						citiesAndDistrictsMapSV,
					).filter(translation => {
						return (
							citiesAndDistrictsMapSV[translation] ===
							nursinghome.district
						);
					})[0];

					const notInCorrectAreaTranslation =
						!searchFilters.alue.includes(
							citiesAndDistrictsMapFI[cityKeyFI],
						) &&
						!searchFilters.alue.includes(
							citiesAndDistrictsMapSV[districtKeySV],
						);

					if (notInCorrectArea && notInCorrectAreaTranslation) {
						return false;
					}
				}

				const notCorrectLanguage =
					searchFilters.language &&
					nursinghome.language &&
					!nursinghome.language.includes(searchFilters.language);

				if (notCorrectLanguage) {
					return false;
				}

				const notARADestination =
					searchFilters.ara !== undefined &&
					((nursinghome.ara === filterYes && !searchFilters.ara) ||
						(nursinghome.ara === filterNo && searchFilters.ara));

				if (notARADestination) {
					return false;
				}

				const notLahDestination =
					searchFilters.lah && nursinghome.lah !== searchFilters.lah;

				if (notLahDestination) {
					return false;
				}

				if (searchFilters.kotikunta) {
					const filtersToKeys = Object.keys(LUCommunes).filter(
						commune => {
							const key = commune as Commune;
							if (
								searchFilters.kotikunta &&
								searchFilters.kotikunta.includes(
									LUCommunes[key],
								)
							) {
								return key;
							}
						},
					);

					const inCorrectCommune = filtersToKeys.some(commune => {
						return (
							nursinghome["customer_commune"] &&
							nursinghome["customer_commune"].includes(
								commune as Commune,
							)
						);
					});

					if (!inCorrectCommune) {
						return false;
					}
				}

				return true;
			});

			setFilteredNursingHomes(filteredNursingHomes);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, history, nursingHomes]);

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		{
			name: espoo,
			label: espoo,
			type: "checkbox",
			checked: searchFilters.alue
				? searchFilters.alue.includes(espoo)
				: false,
			bold: true,
		},
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

	const optionsCustomerCommune: FilterOption[] = [
		{ text: selectCommuneLabel, type: "header" },
		...communesIntoThirds[0].map<FilterOption>(key => {
			const value = LUCommunes[key];

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: searchFilters.kotikunta
					? searchFilters.kotikunta.includes(LUCommunes[key])
					: false,
				bold: true,
			};
		}),
		...communesIntoThirds[1].map<FilterOption>(key => {
			const value = LUCommunes[key];

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: searchFilters.kotikunta
					? searchFilters.kotikunta.includes(LUCommunes[key])
					: false,
				bold: true,
			};
		}),
		...communesIntoThirds[2].map<FilterOption>(key => {
			const value = LUCommunes[key];

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: searchFilters.kotikunta
					? searchFilters.kotikunta.includes(LUCommunes[key])
					: false,
				bold: true,
				alignment: "right",
			};
		}),
	];

	const optionsAra: FilterOption[] = [
		{
			name: filterAraLabel,
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
			name: filterFinnish,
			label: filterFinnish,
			type: "radio",
			checked: searchFilters.language === filterFinnish,
		},
		{
			name: filterSwedish,
			label: filterSwedish,
			type: "radio",
			checked: searchFilters.language === filterSwedish,
		},
	];

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
				ariaLabel={filterNursingHomeArea}
				disabled={isFilterDisabled}
				onChange={({ newValue, name }) => {
					const newSearchFilters = { ...searchFilters };
					let groupFilters = newSearchFilters["alue"];

					if (!groupFilters) {
						groupFilters = [];
					}
					// If the district/city was unchecked
					if (!newValue) {
						// Normal flow: Remove district/city to search filters if
						// present

						groupFilters = groupFilters.filter((value: string) => {
							return value !== name;
						});

						// Weird flow to accommodate the Espoo special selection
						if (name === espoo) {
							groupFilters = groupFilters.filter(
								(value: string) => {
									return !espooAreas.includes(value);
								},
							);
						} else if (espooAreas.includes(name)) {
							groupFilters = groupFilters.filter(
								(value: string) => {
									return value !== espoo;
								},
							);
						}
						// If the district/city was checked
					} else {
						// Normal flow: Add district/city to search filters if
						// not already added
						if (!groupFilters.includes(name)) {
							groupFilters.push(name);
						}

						// Weird flow to accommodate the Espoo special selection
						if (name === espoo) {
							for (const district of espooAreas) {
								if (!groupFilters.includes(district)) {
									groupFilters.push(district);
								}
							}
						} else if (espooAreas.includes(name)) {
							const included = espooAreas.filter(disctrict => {
								return (
									groupFilters &&
									groupFilters.includes(disctrict)
								);
							}).length;

							if (included === espooAreas.length) {
								groupFilters.push(espoo);
							}
						}
					}

					newSearchFilters["alue"] = groupFilters;

					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
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
				prefix={labelCustomerCommune}
				value={
					searchFilters.kotikunta !== undefined
						? searchFilters.kotikunta.length <= 2
							? searchFilters.kotikunta.join(", ")
							: `(${searchFilters.kotikunta.length} ${filterSelections})`
						: null
				}
				values={optionsCustomerCommune}
				ariaLabel={filterCommune}
				disabled={isFilterDisabled}
				onChange={({ newValue, name }) => {
					const newSearchFilters = { ...searchFilters };
					let groupFilters = newSearchFilters["kotikunta"];

					if (!groupFilters) {
						groupFilters = [];
					}

					if (!newValue) {
						groupFilters = groupFilters.filter((value: string) => {
							return value !== name;
						});
					} else {
						if (!groupFilters.includes(name)) {
							groupFilters.push(name);
						}
					}

					newSearchFilters["kotikunta"] = groupFilters;

					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
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
					searchFilters.language === filterFinnish
						? filterFinnish
						: searchFilters.language === filterSwedish
						? filterSwedish
						: null
				}
				values={optionsLanguage}
				ariaLabel={filterLanguage}
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
				ariaLabel={filterShowARA}
				disabled={isFilterDisabled}
				onChange={({ name }) => {
					const newSearchFilters = {
						...searchFilters,
						ara: name === filterAraLabel ? true : false,
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
				ariaLabel={filterShowLah}
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
