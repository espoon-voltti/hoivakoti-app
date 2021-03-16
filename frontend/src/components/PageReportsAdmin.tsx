import React, { useState, useEffect, FC, useContext } from "react";
import { CardNursingHome } from "./CardNursingHome";
import FilterItem, { FilterOption } from "./FilterItem";
import { useHistory, useLocation } from "react-router-dom";
import "../styles/PageReportsAdmin.scss";
import config from "./config";
import queryString from "query-string";
import axios from "axios";
import { useCurrentLanguage, useT } from "../i18n";
import { NursingHome } from "./types";
import { AuthContext } from "./auth-context";
import City, { cityTranslations } from "../shared/types/city";

type Language = string;

interface SearchFilters {
	readonly alue?: string[];
	readonly language?: Language;
	readonly ara?: boolean;
	readonly lah?: boolean;
	readonly name?: string;
}

const PageReportsAdmin: FC = () => {
	const { userRoles } = useContext(AuthContext);
	const currentLanguage = useCurrentLanguage();

	const [nursingHomes, setNursingHomes] = useState<NursingHome[] | null>(
		null,
	);

	const [searchField, setSearchField] = useState<string>();

	const [preselected, setPreselected] = useState<Array<string>>([]);

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
			.then((response: { data: NursingHome[] }) => {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => {
				console.error(error.message);
				throw error;
			});

		if (userRoles) {
			const preselected = Object.keys(City)
				.filter(city => {
					return userRoles.some(roleName => {
						return roleName.includes(city);
					});
				})
				.map(key => {
					return cityTranslations[key][currentLanguage];
				});

			setPreselected(preselected);
		}
	}, [currentLanguage, userRoles]);

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

	const espooChecked = preselected ? preselected.includes("Espoo") : false;

	const espooCheckboxItem: FilterOption = {
		name: espoo,
		label: espoo,
		type: "checkbox",
		checked: espooChecked,
		bold: true,
		readonly: true,
	};

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		espooCheckboxItem,
		...espooAreas.map<FilterOption>((value: string) => {
			const checked = preselected ? preselected.includes(value) : false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				withMargin: true,
				readonly: true,
			};
		}),
		...otherCities.map<FilterOption>((value: string) => {
			const checked = preselected ? preselected.includes(value) : false;

			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				bold: true,
				alignment: "right",
				readonly: true,
			};
		}),
	];

	useEffect(() => {
		const filteredNHs: NursingHome[] | null =
			nursingHomes &&
			nursingHomes.filter(nursinghome => {
				if (
					preselected &&
					preselected.length > 0 &&
					(!preselected.includes(nursinghome.district) &&
						!preselected.includes(nursinghome.city)) &&
					!preselected.includes(
						(citiesAndDistrictsToFinnish as any)[nursinghome.city],
					) &&
					!preselected.includes(
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
					preselected !== undefined
						? preselected.length <= 2
							? preselected.join(", ")
							: `(${preselected.length} ${filterSelections})`
						: null
				}
				values={optionsArea}
				ariaLabel="Valitse hoivakodin alue"
				disabled={isFilterDisabled}
				onChange={() => {}}
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
			<div className="filters">
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
								history.push("/valvonta?" + stringfield);
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
		</div>
	);
};

export default PageReportsAdmin;
