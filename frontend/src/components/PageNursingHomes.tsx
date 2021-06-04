import React, { useState, useEffect, FC, useContext } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation, Link } from "react-router-dom";
import "../styles/PageNursingHomes.scss";
import config from "./config";
import queryString from "query-string";
import axios from "axios";
import Map from "./Map";
import i18next, { TranslationKey, useCurrentLanguage, useT } from "../i18n";
import { NursingHome } from "./types";
import Commune from "../shared/types/commune";
import { Translation } from "../shared/types/translation";
import { HeaderContext, HeaderStyle } from "./header-context";

type Language = string;

const getTranslationByLanguage = (
	language: Language,
	key: TranslationKey,
): string => {
	return i18next.getResource(language, "defaultNamespace", key);
};

const calculateMapVisible = (width: number): boolean => width >= 1130;

const reverseObjectKeyValues = (obj: Translation): Translation => {
	const reversedObject: Translation = {};

	for (const key in obj) {
		const value = obj[key];

		reversedObject[value] = key;
	}

	return reversedObject;
};

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
	readonly kotikunta?: string;
}

const PageNursingHomes: FC = () => {
	const history = useHistory();
	const { search } = useLocation();
	const currentLanguage = useCurrentLanguage();

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

	const { setHeaderStyle } = useContext(HeaderContext);

	useEffect(() => {
		setHeaderStyle(HeaderStyle.GREEN);

		return () => {
			setHeaderStyle(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				setNursingHomes(response.data);
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
		[Commune.PKA]: `${useT("karviainen")} (${useT("karkkila")}, ${useT(
			"vihti",
		)})`,
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.STO]: useT("siuntio"),
	};

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
		useT("inkoo"),
		useT("järvenpää"),
		useT("karkkila"),
		useT("kauniainen"),
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

	const karviainen = useT("karviainen");

	//City or district can appear in Finnish or Swedish regardless of the current language.
	const citiesAndDistrictsMapFI: Translation = {
		[getTranslationByLanguage(
			"sv-FI",
			"espoon keskus",
		)]: getTranslationByLanguage("fi-FI", "espoon keskus"),
		[getTranslationByLanguage(
			"sv-FI",
			"espoonlahti",
		)]: getTranslationByLanguage("fi-FI", "espoonlahti"),
		[getTranslationByLanguage(
			"sv-FI",
			"leppävaara",
		)]: getTranslationByLanguage("fi-FI", "leppävaara"),
		[getTranslationByLanguage(
			"sv-FI",
			"matinkylä",
		)]: getTranslationByLanguage("fi-FI", "matinkylä"),
		[getTranslationByLanguage(
			"sv-FI",
			"tapiola",
		)]: getTranslationByLanguage("fi-FI", "tapiola"),
		[getTranslationByLanguage(
			"sv-FI",
			"helsinki",
		)]: getTranslationByLanguage("fi-FI", "helsinki"),
		[getTranslationByLanguage(
			"sv-FI",
			"hyvinkää",
		)]: getTranslationByLanguage("fi-FI", "hyvinkää"),
		[getTranslationByLanguage("sv-FI", "inkoo")]: getTranslationByLanguage(
			"fi-FI",
			"inkoo",
		),
		[getTranslationByLanguage(
			"sv-FI",
			"järvenpää",
		)]: getTranslationByLanguage("fi-FI", "järvenpää"),
		[getTranslationByLanguage("sv-FI", "karjaa")]: getTranslationByLanguage(
			"fi-FI",
			"karjaa",
		),
		[getTranslationByLanguage("sv-FI", "hanko")]: getTranslationByLanguage(
			"fi-FI",
			"hanko",
		),
		[getTranslationByLanguage(
			"sv-FI",
			"karkkila",
		)]: getTranslationByLanguage("fi-FI", "karkkila"),
		[getTranslationByLanguage(
			"sv-FI",
			"kauniainen",
		)]: getTranslationByLanguage("fi-FI", "kauniainen"),
		[getTranslationByLanguage("sv-FI", "kerava")]: getTranslationByLanguage(
			"fi-FI",
			"kerava",
		),
		[getTranslationByLanguage(
			"sv-FI",
			"kirkkonummi",
		)]: getTranslationByLanguage("fi-FI", "kirkkonummi"),
		[getTranslationByLanguage("sv-FI", "lohja")]: getTranslationByLanguage(
			"fi-FI",
			"lohja",
		),
		[getTranslationByLanguage(
			"sv-FI",
			"nurmijärvi",
		)]: getTranslationByLanguage("fi-FI", "nurmijärvi"),
		[getTranslationByLanguage(
			"sv-FI",
			"raasepori",
		)]: getTranslationByLanguage("fi-FI", "raasepori"),
		[getTranslationByLanguage("sv-FI", "sipoo")]: getTranslationByLanguage(
			"fi-FI",
			"sipoo",
		),
		[getTranslationByLanguage(
			"sv-FI",
			"siuntio",
		)]: getTranslationByLanguage("fi-FI", "siuntio"),
		[getTranslationByLanguage(
			"sv-FI",
			"tammisaari",
		)]: getTranslationByLanguage("fi-FI", "tammisaari"),
		[getTranslationByLanguage(
			"sv-FI",
			"tuusula",
		)]: getTranslationByLanguage("fi-FI", "tuusula"),
		[getTranslationByLanguage("sv-FI", "vantaa")]: getTranslationByLanguage(
			"fi-FI",
			"vantaa",
		),
		[getTranslationByLanguage("sv-FI", "vihti")]: getTranslationByLanguage(
			"fi-FI",
			"vihti",
		),
	};

	const citiesAndDistrictsMapSV: Translation = reverseObjectKeyValues(
		citiesAndDistrictsMapFI,
	);

	const languageMapFI: Translation = {
		[getTranslationByLanguage(
			"sv-FI",
			"filterFinnish",
		)]: getTranslationByLanguage("fi-FI", "filterFinnish"),
		[getTranslationByLanguage(
			"sv-FI",
			"filterSwedish",
		)]: getTranslationByLanguage("fi-FI", "filterSwedish"),
	};

	const araMapFI: Translation = {
		[getTranslationByLanguage(
			"sv-FI",
			"filterYes",
		)]: getTranslationByLanguage("fi-FI", "filterYes"),
		[getTranslationByLanguage(
			"sv-FI",
			"filterNo",
		)]: getTranslationByLanguage("fi-FI", "filterNo"),
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

	const commune = parsed.kotikunta ? (parsed.kotikunta as string) : undefined;

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
				if (searchFilters.alue) {
					let nursingHomeInCorrectArea;

					if (currentLanguage === "sv-FI") {
						nursingHomeInCorrectArea =
							searchFilters.alue.includes(nursinghome.city) ||
							searchFilters.alue.includes(nursinghome.district) ||
							searchFilters.alue.includes(
								citiesAndDistrictsMapFI[nursinghome.city],
							) ||
							searchFilters.alue.includes(
								citiesAndDistrictsMapFI[nursinghome.district],
							);
					} else {
						nursingHomeInCorrectArea =
							searchFilters.alue.includes(nursinghome.city) ||
							searchFilters.alue.includes(nursinghome.district) ||
							searchFilters.alue.includes(
								citiesAndDistrictsMapSV[nursinghome.city],
							) ||
							searchFilters.alue.includes(
								citiesAndDistrictsMapSV[nursinghome.district],
							);
					}

					return nursingHomeInCorrectArea;
				}

				if (searchFilters.kotikunta) {
					const filtersToKeys = Object.keys(LUCommunes).filter(
						commune => {
							const key = commune as Commune;

							if (
								searchFilters.kotikunta &&
								(searchFilters.kotikunta.includes(
									LUCommunes[key],
								) ||
									LUCommunes[key].indexOf(
										searchFilters.kotikunta,
									) !== -1)
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

					return inCorrectCommune;
				}

				if (searchFilters.language) {
					let nursingHomeHasCorrectLanguage;

					if (currentLanguage === "sv-FI") {
						nursingHomeHasCorrectLanguage =
							nursinghome.language &&
							nursinghome.language.includes(
								languageMapFI[searchFilters.language],
							);
					} else {
						nursingHomeHasCorrectLanguage =
							nursinghome.language &&
							nursinghome.language.includes(
								searchFilters.language,
							);
					}

					return nursingHomeHasCorrectLanguage;
				}

				if (searchFilters.ara !== undefined) {
					let nursingHomeIsARADestination;

					if (currentLanguage === "sv-FI") {
						nursingHomeIsARADestination =
							nursinghome.ara !== null &&
							searchFilters.ara === true &&
							nursinghome.ara === araMapFI[filterYes];
					} else {
						nursingHomeIsARADestination =
							nursinghome.ara !== null &&
							searchFilters.ara === true &&
							nursinghome.ara === filterYes;
					}

					return nursingHomeIsARADestination;
				}

				if (searchFilters.lah !== undefined) {
					const nursingHomeHasLAH =
						nursinghome.lah !== null &&
						searchFilters.lah === nursinghome.lah;

					return nursingHomeHasLAH;
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
		...Object.keys(LUCommunes).map<FilterOption>(key => {
			const value = LUCommunes[key];

			const checked = searchFilters.kotikunta
				? searchFilters.kotikunta.includes(value) ||
				  value.indexOf(searchFilters.kotikunta) !== -1
				: false;

			let name = value;

			if (key === Commune.PKA) {
				name = karviainen;
			}

			return {
				name: name,
				label: value,
				type: "radio",
				checked: checked,
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
				label={filterLocation}
				prefix="area"
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
				label={labelCustomerCommune}
				prefix="commune"
				value={
					searchFilters.kotikunta && searchFilters.kotikunta !== ""
						? searchFilters.kotikunta
						: null
				}
				values={optionsCustomerCommune}
				ariaLabel={filterCommune}
				disabled={isFilterDisabled}
				onChange={({ name }) => {
					const newSearchFilters = {
						...searchFilters,
						kotikunta: name,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						kotikunta: undefined,
					};

					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/hoivakodit?" + stringfield);
				}}
			/>
			<FilterItem
				label={serviceLanguage}
				prefix="language"
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
				label={filterAraLabel}
				prefix="ara"
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
				prefix="lah"
				label={filterLAH}
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
