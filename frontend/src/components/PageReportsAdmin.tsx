import React, { useState, useEffect, FC, useContext, Fragment } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation, Link } from "react-router-dom";
import "../styles/PageReportsAdmin.scss";
import config from "./config";
import queryString from "query-string";
import axios from "axios";
import { useT } from "../i18n";
import { NursingHome } from "./types";
import Cookies from "universal-cookie";
import withAuthentication from "../hoc/withAuthentication";

type Language = string;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
	readonly name?: string;
}

interface Props {
	isAuthenticated: boolean;
}

const PageReportsAdmin: FC<Props> = ({ isAuthenticated }) => {
	const [sessionCookies] = useState<Cookies>(new Cookies());

	const [nursingHomes, setNursingHomes] = useState<NursingHome[] | null>(
		null,
	);

	const [searchField, setSearchField] = useState<string>();

	const history = useHistory();
	const { search } = useLocation();
	const [filteredNursingHomes, setFilteredNursingHomes] = useState<
		NursingHome[] | null
	>(null);

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
	}, [sessionCookies]);

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
		name: parsed.name as string,
	};

	const locationPickerLabel = useT("locationPickerLabel");

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

	//const filtersCityTranslatedInclude = nursinghome.language.includes(useTFI(searchFilters.language));
	useEffect(() => {
		const filteredNHs: NursingHome[] | null =
			nursingHomes &&
			nursingHomes.filter(nursinghome => {
				if (
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
					)
				) {
					return false;
				}

				if (
					searchFilters.name &&
					searchFilters.name.length > 0 &&
					!nursinghome.name
						.toLocaleLowerCase()
						.includes(searchFilters.name) &&
					!nursinghome.owner
						.toLocaleLowerCase()
						.includes(searchFilters.name)
				) {
					return false;
				}
				if (
					searchFilters.language &&
					nursinghome.language &&
					!nursinghome.language.includes(searchFilters.language)
				)
					return false;
				if (
					searchFilters.ara !== undefined &&
					((nursinghome.ara === "Kyllä" && !searchFilters.ara) ||
						(nursinghome.ara === "Ei" && searchFilters.ara))
				)
					return false;
				if (searchFilters.lah && nursinghome.lah !== searchFilters.lah)
					return false;

				return true;
			});
		setFilteredNursingHomes(filteredNHs);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, history, nursingHomes]);

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

	const isFilterDisabled = nursingHomes === null;

	const filterElements = (
		<>
			<FilterItem
				label={filterLocation}
				prefix="location"
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
					// If the district/city was unchecked
					if (!newValue) {
						// Normal flow: Remove district/city to search filters if
						// present
						newSearchFilters.alue = newSearchFilters.alue.filter(
							(value: string) => {
								return value !== name;
							},
						);

						// Weird flow to accommodate the Espoo special selection
						if (name === "Espoo")
							newSearchFilters.alue = newSearchFilters.alue.filter(
								(value: string) => {
									if (espooAreas.includes(value))
										return false;
									return true;
								},
							);
						else if (espooAreas.includes(name))
							newSearchFilters.alue = newSearchFilters.alue.filter(
								(value: string) => {
									return value !== "Espoo";
								},
							);
						// If the district/city was checked
					} else {
						// Normal flow: Add district/city to search filters if
						// not already added
						if (!newSearchFilters.alue.includes(name))
							newSearchFilters.alue.push(name);

						// Weird flow to accommodate the Espoo special selection
						if (name === "Espoo")
							for (let i = 0; i < espooAreas.length; i++) {
								const district = espooAreas[i];
								if (!newSearchFilters.alue.includes(district))
									newSearchFilters.alue.push(district);
							}
						else if (espooAreas.includes(name)) {
							let included = 0;
							for (let i = 0; i < espooAreas.length; i++) {
								const district = espooAreas[i];
								if (newSearchFilters.alue.includes(district))
									included++;
							}
							if (included === espooAreas.length) {
								newSearchFilters.alue.push("Espoo");
							}
						}
					}
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/valvonta?" + stringfield);
				}}
				onReset={(): void => {
					const newSearchFilters = {
						...searchFilters,
						alue: undefined,
					};
					const stringfield = queryString.stringify(newSearchFilters);
					history.push("/valvonta?" + stringfield);
				}}
			/>
			<FilterItem
				label={serviceLanguage}
				prefix="language"
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
				label={filterLAH}
				prefix="lah"
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
				>
					<CardNursingHome nursinghome={nursingHome} type={"admin"} />
				</div>
			</div>
		));

	const clearSearchfield = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setSearchField("");
		const newSearchFilters = {
			...searchFilters,
			name: undefined,
		};
		const stringfield = queryString.stringify(newSearchFilters);
		history.push("/valvonta?" + stringfield);
	};

	return (
		<div>
			{isAuthenticated ? (
				<Fragment>
					<div className="filters filters-admin">
						<div className="filters-text">{filterLabel}</div>
						{filterElements}
					</div>
					<div className="card-list-container">
						<div className="card-list">
							<div className="card-list-searchfield-container">
								<input
									className="card-list-searchfield"
									value={searchField}
									type="text"
									placeholder="Etsi hoivakotia nimellä..."
									onChange={e => {
										setSearchField(e.target.value);
										const newSearchFilters = {
											...searchFilters,
											name:
												e.target.value != ""
													? e.target.value
													: undefined,
										};
										const stringfield = queryString.stringify(
											newSearchFilters,
										);
										history.push(
											"/valvonta?" + stringfield,
										);
									}}
								></input>
								<button
									className="card-list-searchfield-btn"
									onClick={clearSearchfield}
								></button>
							</div>
							<div className="card-container">{cards}</div>
						</div>
					</div>
				</Fragment>
			) : (
				<div className="login-container">
					<h2>Ladataan...</h2>
				</div>
			)}
		</div>
	);
};

export default withAuthentication(PageReportsAdmin);
