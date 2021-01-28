import React, { FC, useEffect, useState, Fragment } from "react";
import { useT } from "../i18n";
import "../styles/PageUpdate.scss";
import Radio from "./Radio";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome } from "./types";
import Checkbox from "./Checkbox";

enum InputTypes {
	text = "text",
	textarea = "textarea",
	number = "number",
	checkbox = "checkbox",
	email = "email",
	url = "url",
	tel = "tel",
	radio = "radio",
}

type NursingHomeKey = keyof NursingHome;
type InputFieldValue = string | number | boolean;

type NursingHomeUpdateData = Omit<
	NursingHome,
	| "id"
	| "pic_digests"
	| "pics"
	| "pic_captions"
	| "report_status"
	| "rating"
	| "geolocation"
	| "has_vacancy"
	| "basic_update_key"
>;

interface VacancyStatus {
	has_vacancy: boolean;
	vacancy_last_updated_at: string | null;
}

interface NursingHomeRouteParams {
	id: string;
	key: string;
}

interface InputField {
	label: string;
	type: InputTypes;
	name: NursingHomeKey;
	description?: string;
	buttons?: { value: string | boolean; label: string }[];
	required?: boolean;
	valid?: boolean;
	touched?: boolean;
	change?: (...arg: any) => InputFieldValue;
	maxlength?: number;
}

const formatDate = (dateString: string | null): string => {
	if (!dateString) return "";
	const date = new Date(dateString);
	const YYYY = String(date.getUTCFullYear());
	const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
	const DD = String(date.getUTCDate()).padStart(2, "0");
	const hh = String(date.getHours()).padStart(2, "0");
	const mm = String(date.getMinutes()).padStart(2, "0");
	return `${YYYY}-${MM}-${DD} (${hh}:${mm})`;
};

const requestVacancyStatusUpdate = async (
	id: string,
	key: string,
	status: boolean,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		{
			// eslint-disable-next-line @typescript-eslint/camelcase
			has_vacancy: status,
		},
	);
};

const requestNursingHomeUpdate = async (
	id: string,
	key: string,
	nursingHomeUpdateData: NursingHomeUpdateData,
): Promise<void> => {
	try {
		await axios.post(
			`${config.API_URL}/nursing-homes/${id}/update/${key}`,
			{
				...nursingHomeUpdateData,
			},
		);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const PageUpdate: FC = () => {
	const { id, key } = useParams<NursingHomeRouteParams>();

	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [vacancyStatus, setVacancyStatus] = useState<VacancyStatus | null>(
		null,
	);
	const [popupState, setPopupState] = useState<
		null | "saving" | "saved" | "invalid"
	>(null);
	const [hasVacancy, setHasVacancy] = useState<boolean>(false);

	const labelOwner = useT("ownerOrganisation");
	const labelAra = useT("filterAraLabel");
	const labelYearofConst = useT("yearofConst");
	const labelNumApartments = useT("numTotalApartments");
	const labelApartmentSize = useT("apartmentSize");
	const labelRent = useT("rent");
	const labelServiceLanguage = useT("serviceLanguage");
	const labelHasLAHapartments = useT("hasLAHapartments");
	const labelWebpage = useT("webpage");
	const labelCookingMethod = useT("cookingMethod");
	const labelFoodMoreInfo = useT("foodMoreInfo");
	const labelLinkMenu = useT("linkMenu");
	const labelActivies = useT("activies");
	const labelLinkMoreInfoActivies = useT("linkMoreInfoActivies");
	const labelOutdoorActivies = useT("outdoorActivies");
	const labelLinkMoreInfoOutdoor = useT("linkMoreInfoOutdoor");
	const labelVisitingInfo = useT("visitingInfo");
	const labelAccessibility = useT("accessibility");
	const labelAccessibilityInfo = useT("accessibilityInfo");
	const labelPersonnel = useT("personnel");
	const labelLinkMoreInfoPersonnel = useT("linkMoreInfoPersonnel");
	const labelOtherServices = useT("otherServices");
	const labelNearbyServices = useT("nearbyServices");
	const labelBasicInformation = useT("basicInformation");
	const labelContactInfo = useT("contactInfo");
	const labelFoodHeader = useT("foodHeader");
	const labelYes = useT("filterYes");
	const labelNo = useT("filterNo");
	const labelSummary = useT("nursingHomeSummary");
	const labelBuildingInfo = useT("buildingInfo");
	const labelApartmentCountInfo = useT("apartmentCountInfo");
	const labelApartmentsHaveBathroom = useT("apartmentsHaveBathroom");
	const labelRentInfo = useT("rentInfo");
	const labelLanguageInfo = useT("languageInfo");
	const labelAddress = useT("address");
	const labelPostalCode = useT("postalCode");
	const labelCity = useT("city");
	const labelDistrict = useT("district");
	const labelArrivalGuidePublicTransit = useT("arrivalGuidePublicTransit");
	const labelArrivalGuideCar = useT("arrivalGuideCar");
	const labelContactName = useT("contactName");
	const labelContactTitle = useT("contactTitle");
	const labelContactPhone = useT("contactPhone");
	const labelContactEmail = useT("contactEmail");
	const labelContactPhoneInfo = useT("contactPhoneInfo");
	const labelContactDescription = useT("contactDescription");
	const labelNursingHomeName = useT("nursingHomeName");
	const labelSelectVancyStatus = useT("selectVancyStatus");
	const title = useT("updateNursingHomeTitle");
	const freeApartmentsStatus = useT("freeApartmentsStatus");
	const labelTrue = useT("vacancyTrue");
	const labelFalse = useT("vacancyFalse");
	const loadingText = useT("loadingText");
	const lastUpdate = useT("lastUpdate");
	const noUpdate = useT("noUpdate");
	const btnSave = useT("btnSave");
	const cancel = useT("cancel");
	const textFieldIsRequired = useT("fieldIsRequired");
	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	const formIsInvalid = useT("formIsInvalid");

	if (!id || !key) throw new Error("Invalid URL!");

	useEffect(() => {
		axios
			.get(`${config.API_URL}/nursing-homes/${id}`)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	useEffect(() => {
		if (!vacancyStatus) {
			axios
				.get(
					`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
				)
				.then((response: { data: VacancyStatus }) => {
					setVacancyStatus(response.data);
					setHasVacancy(response.data.has_vacancy);

					if (popupState) setTimeout(() => setPopupState(null), 3000);
				})
				.catch(e => {
					console.error(e);
					throw e;
				});
		}
	}, [id, key, popupState, vacancyStatus]);

	const [form, setForm] = useState<{ [key: string]: InputField[] }>({
		basicFields: [
			{
				label: labelSummary,
				type: InputTypes.textarea,
				name: "summary",
				description: "Hoivakodin palvelulupaus",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelOwner,
				type: InputTypes.text,
				name: "owner",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelAra,
				type: InputTypes.radio,
				name: "ara",
				buttons: [
					{ value: labelYes, label: labelYes },
					{ value: labelNo, label: labelNo },
					{
						value: "Osa paikoista ARA-talossa",
						label: "Osa paikoista ARA-talossa",
					},
				],
			},
			{
				label: labelYearofConst,
				type: InputTypes.number,
				name: "construction_year",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelBuildingInfo,
				type: InputTypes.textarea,
				name: "building_info",
				description:
					"Tässä voit kertoa mahdollisista tehdyistä tai tulossa olevista peruskorjauksista, laajennuksista jne.",
				maxlength: 200,
			},
			{
				label: labelNumApartments,
				type: InputTypes.number,
				name: "apartment_count",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelApartmentCountInfo,
				type: InputTypes.textarea,
				name: "apartment_count_info",
				description:
					"Tässä voit kertoa esim. minkä kokoisiin ryhmäkoteihin hoivakoti jakaantuu ja kuinka monta asuntoa on per kerros.",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelApartmentSize + " (m²)",
				type: InputTypes.text,
				name: "apartment_square_meters",
				description: "Esim. 18-25",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelApartmentsHaveBathroom,
				type: InputTypes.checkbox,
				name: "apartments_have_bathroom",
			},
			{
				label: labelRent + " (€ / kk)",
				type: InputTypes.text,
				name: "rent",
				description: "Esim. 700-800",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelRentInfo,
				type: InputTypes.textarea,
				name: "rent_info",
				description: "Mitä yhteisiä tiloja asiakkaan vuokraan sisältyy",
			},
			{
				label: labelServiceLanguage,
				type: InputTypes.checkbox,
				name: "language",
				buttons: [
					{ label: "Suomi", value: "Suomi" },
					{ label: "Ruotsi", value: "Ruotsi" },
				],
				change: (currentValue: any, buttonValue: string) => {
					const valArray: Array<string> = currentValue
						.split("|")
						.filter((value: string) => value !== "");

					let newValue;

					if (valArray.includes(buttonValue)) {
						const itemIndex = valArray.indexOf(buttonValue);

						valArray.splice(itemIndex, 1);
					} else {
						valArray.push(buttonValue);
					}

					const sortArray = valArray.sort((a, b) => {
						return a.localeCompare(b);
					});

					if (sortArray.length > 1) {
						newValue = sortArray.join("|");
					} else if (sortArray.length === 1) {
						newValue = sortArray[0];
					} else {
						newValue = "";
					}

					console.log(newValue);

					return newValue;
				},
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelLanguageInfo,
				type: InputTypes.textarea,
				name: "language_info",
				description:
					"Esim. lisätietoa henkilökunnan muusta kielitaidosta.",
				maxlength: 200,
			},
		],
		addressFields: [
			{
				label: labelAddress,
				type: InputTypes.text,
				name: "address",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelPostalCode,
				type: InputTypes.text,
				name: "postal_code",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelCity,
				type: InputTypes.text,
				name: "city",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelDistrict,
				type: InputTypes.text,
				name: "district",
				required: true,
				valid: false,
				touched: false,
			},
		],
		contactFields: [
			{
				label: labelWebpage,
				type: InputTypes.url,
				name: "www",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelArrivalGuidePublicTransit,
				type: InputTypes.textarea,
				name: "arrival_guide_public_transit",
				maxlength: 200,
			},
			{
				label: labelArrivalGuideCar,
				type: InputTypes.textarea,
				name: "arrival_guide_car",
				maxlength: 200,
			},
		],
		foodFields: [
			{
				label: labelLinkMenu,
				type: InputTypes.url,
				name: "menu_link",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelCookingMethod,
				type: InputTypes.text,
				name: "meals_preparation",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelFoodMoreInfo,
				type: InputTypes.textarea,
				name: "meals_info",
				maxlength: 200,
				description:
					"Tässä voi halutessasi antaa lisätietoja ruuan valmistukseen ja ruokailuun liittyen.",
			},
		],
		activitiesFields: [
			{
				label: labelActivies,
				type: InputTypes.textarea,
				name: "activities_info",
				required: true,
				valid: false,
				touched: false,
				description:
					"Kuvaus hoivakodissa järjestettävästä toiminnasta.",
				maxlength: 400,
			},
			{
				label: labelLinkMoreInfoActivies,
				type: InputTypes.url,
				name: "activities_link",
				description:
					"Jos hoivakodin sivuilla on esim. ulkoilukalenteri, laita sen linkki tähän.",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelOutdoorActivies,
				type: InputTypes.textarea,
				name: "outdoors_possibilities_info",
				description:
					"Kuvaa hoivakodin ulkoilumahdollisuuksia. Kuvaile esim. miten ulkoilua järjestetään ja miten asiakkaat ulkoilevat.",
				maxlength: 200,
			},
			{
				label: labelLinkMoreInfoOutdoor,
				type: InputTypes.url,
				name: "outdoors_possibilities_link",
				description:
					"Jos hoivakodin sivuilla on esim. ulkoilukalenteri, laita se tähän.",
				required: true,
				valid: false,
				touched: false,
			},
		],
		nursingHomeContactFields: [
			{
				label: labelContactDescription,
				type: InputTypes.textarea,
				name: "tour_info",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelContactName,
				type: InputTypes.text,
				name: "contact_name",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelContactTitle,
				type: InputTypes.text,
				name: "contact_title",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelContactPhone,
				type: InputTypes.tel,
				name: "contact_phone",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelContactEmail,
				type: InputTypes.email,
				name: "email",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelContactPhoneInfo,
				type: InputTypes.textarea,
				name: "contact_phone_info",
				maxlength: 200,
			},
		],
		accessibilityFields: [
			{
				label: labelAccessibilityInfo,
				type: InputTypes.textarea,
				name: "accessibility_info",
				description:
					"Tähän voit tarvittaessa kirjoittaa esteettömyyttä koskevia lisätietoja.",
				maxlength: 200,
			},
		],
		staffFields: [
			{
				label: labelPersonnel,
				type: InputTypes.textarea,
				name: "staff_info",
				description:
					"Kerro halutessasi henkilöstöstä, sen rakenteesta ja erityisosaamisesta",
				maxlength: 400,
			},
			{
				label: labelLinkMoreInfoPersonnel,
				type: InputTypes.url,
				name: "staff_satisfaction_info",
				description:
					"Lisää linkki jos hoivakodin sivuilla on tietoa henkilöstön tyytyväisyydestä (kyselyn tulokset tms.).",
			},
		],
		otherServicesFields: [
			{
				label: labelOtherServices,
				type: InputTypes.textarea,
				name: "other_services",
				description:
					"Kuvaa tähän mitä muita palvelukonseptiin kuulumattomia palveluita on saatavilla. Kerro myös mistä niiden hinnat löytyvät.",
				maxlength: 200,
			},
		],
		nearbyServicesFields: [
			{
				label: labelNearbyServices,
				type: InputTypes.textarea,
				name: "nearby_services",
				description:
					"Mitä palveluita löytyy hoivakodin läheltä esim. kauppa, kirjasto, ravintola jne.",
				maxlength: 200,
			},
		],
		vacancyFields: [
			{
				label: labelNursingHomeName,
				type: InputTypes.text,
				name: "name",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelSelectVancyStatus,
				type: InputTypes.radio,
				buttons: [
					{ value: true, label: labelTrue },
					{ value: false, label: labelFalse },
				],
				name: "has_vacancy",
				change: (selected: InputFieldValue) => {
					setHasVacancy(selected as boolean);

					return selected;
				},
			},
			{
				label: labelHasLAHapartments,
				type: InputTypes.checkbox,
				name: "lah",
			},
		],
	});

	const [formIsValid, setFormIsValid] = useState(false);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			if (formIsValid) {
				setPopupState("saving");

				await requestVacancyStatusUpdate(id, key, hasVacancy);

				if (nursingHome) {
					let fields: InputField[] = [];

					const sections = Object.keys(form).map(
						section => form[section],
					);

					for (const section of sections) {
						fields = [...fields, ...section];
					}

					const formData: any = {};

					for (const field of fields) {
						if (field.name !== "has_vacancy") {
							formData[field.name] = nursingHome[field.name];
						}
					}

					const updateNursingHomeData: NursingHomeUpdateData = formData;

					await requestNursingHomeUpdate(
						id,
						key,
						updateNursingHomeData,
					);
				}

				setPopupState("saved");
				setVacancyStatus(null);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		window.location.href = window.location.pathname + "/peruuta";
	};

	const validateField = <T extends NursingHome, K extends keyof T>(
		value: T[K],
	): boolean => {
		if (typeof value === "string") {
			return value.trim() !== "";
		}

		return value !== null;
	};

	const validateForm = (): void => {
		if (nursingHome) {
			let validForm = true;

			const validatedForm = { ...form };

			for (const section in validatedForm) {
				const fields = validatedForm[section];
				const validatedFields = [];

				for (const field of fields) {
					if (field.required) {
						const validField = validateField(
							nursingHome[field.name],
						);

						if (!validField) {
							validForm = false;
						}

						validatedFields.push({
							...field,
							touched: true,
							valid: validField,
						});
					} else {
						validatedFields.push(field);
					}
				}

				validatedForm[section] = validatedFields;
			}

			setForm(validatedForm);

			if (!validForm) {
				setPopupState("invalid");
			} else {
				setPopupState(null);
			}

			setFormIsValid(validForm);
		}
	};

	const handleInputChange = (
		field: InputField,
		value: InputFieldValue,
	): void => {
		if (nursingHome) {
			const { name, type } = field;

			setNursingHome({
				...nursingHome,
				[name]:
					type === "number" && typeof value === "string"
						? parseInt(value)
						: value,
			});
		}

		validateForm();
	};

	const getInputElement = (
		field: InputField,
		index: number,
	): JSX.Element | null => {
		if (nursingHome) {
			const fieldInvalid =
				field.required && field.touched && !field.valid;
			const key = `${field.name}-${index}`;

			switch (field.type) {
				case "textarea":
					return (
						<div className="field" key={key}>
							<label className="label" htmlFor={field.name}>
								{field.label}
								{field.required ? (
									<span
										className="asterisk"
										aria-hidden="true"
									>
										{" "}
										*
									</span>
								) : null}
							</label>
							{field.description ? (
								<span className="input-description">
									{field.description}
								</span>
							) : null}
							<div className="control">
								<textarea
									className={
										fieldInvalid ? "input error" : "input"
									}
									rows={5}
									maxLength={field.maxlength}
									value={nursingHome[field.name] as string}
									name={field.name}
									id={field.name}
									onChange={event =>
										handleInputChange(
											field,
											event.target.value,
										)
									}
									required={field.required}
									aria-required={field.required}
									onBlur={validateForm}
								></textarea>
								{fieldInvalid ? (
									<span className="icon"></span>
								) : null}
							</div>
							{fieldInvalid ? (
								<p className="help">{textFieldIsRequired}</p>
							) : null}
						</div>
					);
				case "checkbox":
					return (
						<Fragment key={key}>
							{field.buttons ? (
								<fieldset className="field">
									<legend>{field.label}</legend>
									{field.buttons.map(button => {
										return (
											<Checkbox
												key={`${field.name}-${button.value}`}
												id={`${field.name}-${button.value}`}
												name={field.name}
												onChange={() => {
													if (field.change) {
														const transformValue = field.change(
															nursingHome[
																field.name
															],
															button.value,
														);

														handleInputChange(
															field,
															transformValue,
														);
													} else {
														handleInputChange(
															field,
															button.value,
														);
													}
												}}
												isChecked={(
													(nursingHome[
														field.name
													] as string) || ""
												).includes(
													button.value as string,
												)}
											>
												{button.value}
											</Checkbox>
										);
									})}
								</fieldset>
							) : (
								<div className="field">
									<Checkbox
										name={field.name}
										id={field.name}
										onChange={checked =>
											handleInputChange(field, checked)
										}
										isChecked={
											(nursingHome[
												field.name
											] as boolean) || false
										}
									>
										{field.label}
									</Checkbox>
								</div>
							)}
						</Fragment>
					);
				case "radio":
					return (
						<fieldset className="field" key={key}>
							<legend>{field.label}</legend>
							{field.buttons
								? field.buttons.map(button => {
										return (
											<Radio
												key={`${field.name}-${button.value}`}
												id={`${field.name}-${button.value}`}
												name={field.name}
												isSelected={
													(nursingHome[
														field.name
													] as string) ===
													button.value
												}
												value={button.value}
												onChange={() => {
													if (field.change) {
														const transformValue = field.change(
															button.value,
														);

														handleInputChange(
															field,
															transformValue,
														);
													} else {
														handleInputChange(
															field,
															button.value,
														);
													}
												}}
											>
												{button.label}
											</Radio>
										);
								  })
								: null}
						</fieldset>
					);
				default:
					return (
						<div className="field" key={key}>
							<label className="label" htmlFor={field.name}>
								{field.label}
								{field.required ? (
									<span
										className="asterisk"
										aria-hidden="true"
									>
										{" "}
										*
									</span>
								) : null}
							</label>
							{field.description ? (
								<span className="input-description">
									{field.description}
								</span>
							) : null}
							<div className="control">
								<input
									className={
										fieldInvalid ? "input error" : "input"
									}
									value={nursingHome[field.name] as string}
									name={field.name}
									id={field.name}
									type={field.type}
									onChange={event =>
										handleInputChange(
											field,
											event.target.value,
										)
									}
									onBlur={validateForm}
									required={field.required}
									aria-required={field.required}
								/>
								{fieldInvalid ? (
									<span className="icon"></span>
								) : null}
							</div>
							{fieldInvalid ? (
								<p className="help">{textFieldIsRequired}</p>
							) : null}
						</div>
					);
			}
		}

		return null;
	};

	return (
		<div className="page-update">
			<p className="page-update-status">
				<strong>{lastUpdate}: </strong>
				{vacancyStatus
					? formatDate(vacancyStatus.vacancy_last_updated_at) ||
					  noUpdate
					: loadingText}
			</p>
			<div className="page-update-content">
				{!nursingHome ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
						<h1 className="page-update-title">{title}</h1>
						<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
							<div className="nav-save">
								<button
									className="page-update-cancel"
									onClick={cancelEdit}
								>
									{cancel}
								</button>
								<button
									type="submit"
									className="btn page-update-submit"
									disabled={!formIsValid}
								>
									{btnSave}
								</button>

								{popupState && (
									<span
										className={
											popupState === "invalid"
												? "page-update-popup error"
												: "page-update-popup"
										}
									>
										{popupState === "saving"
											? updatePopupSaving
											: popupState === "invalid"
											? formIsInvalid
											: updatePopupSaved}
									</span>
								)}
							</div>
							<div className="page-update-section">
								<h3>{freeApartmentsStatus}</h3>
								{form.vacancyFields.map((field, index) =>
									getInputElement(field, index),
								)}

								<Link
									className="btn update-images-button"
									to={`/hoivakodit/${id}/paivita/${key}/kuvat`}
								>
									Lisää kuvia
								</Link>
							</div>
							<div className="page-update-section">
								<h3>{labelVisitingInfo}</h3>
								{form.nursingHomeContactFields.map(
									(field, index) =>
										getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelContactInfo}</h3>
								<div className="page-update-columns">
									{form.addressFields.map((field, index) =>
										getInputElement(field, index),
									)}
								</div>
								{form.contactFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelBasicInformation}</h3>
								{form.basicFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelFoodHeader}</h3>
								{form.foodFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelActivies}</h3>
								{form.activitiesFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelAccessibility}</h3>
								{form.accessibilityFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelPersonnel}</h3>
								{form.staffFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelOtherServices}</h3>
								{form.otherServicesFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelNearbyServices}</h3>
								{form.nearbyServicesFields.map((field, index) =>
									getInputElement(field, index),
								)}
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;
