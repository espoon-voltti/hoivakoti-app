import React, { FC, useEffect, useState } from "react";
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
	buttons?: { value: string | boolean; label: string }[];
	required?: boolean;
	valid?: boolean;
	touched?: boolean;
	change?: (arg: InputFieldValue) => void;
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

	const labelOwner = useT("owner");
	const labelAra = useT("filterAraLabel");
	const labelYearofConst = useT("yearofConst");
	const labelNumApartments = useT("numApartments");
	const labelApartmentSize = useT("apartmentSize");
	const labelRent = useT("rent");
	const labelServiceLanguage = useT("serviceLanguage");
	const labelLAHapartments = useT("LAHapartments");
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
	const title = useT("pageUpdateTitle");
	const freeApartmentsStatus = useT("freeApartmentsStatus");

	const intro = useT("pageUpdateIntro");
	const labelTrue = useT("vacancyTrue");
	const labelFalse = useT("vacancyFalse");
	const loadingText = useT("loadingText");
	const nursingHomeName = useT("nursingHome");
	const status = useT("status");
	const lastUpdate = useT("lastUpdate");
	const noUpdate = useT("noUpdate");
	const btnSave = useT("btnSave");
	const cancel = useT("cancel");
	const textFieldIsRequired = useT("fieldIsRequired");
	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	const formIsInvalid = useT("formIsInvalid");

	const [form, setForm] = useState<{ [key: string]: InputField[] }>({
		basicFields: [
			{
				label: labelSummary,
				type: InputTypes.textarea,
				name: "summary",
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
			},
			{
				label: labelApartmentSize + " (m²)",
				type: InputTypes.text,
				name: "apartment_square_meters",
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
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelRentInfo,
				type: InputTypes.textarea,
				name: "rent_info",
			},
			{
				label: labelServiceLanguage,
				type: InputTypes.text,
				name: "language",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelLanguageInfo,
				type: InputTypes.textarea,
				name: "language_info",
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
			},
			{
				label: labelArrivalGuideCar,
				type: InputTypes.textarea,
				name: "arrival_guide_car",
			},
		],
		foodFields: [
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
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelLinkMenu,
				type: InputTypes.url,
				name: "menu_link",
				required: true,
				valid: false,
				touched: false,
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
			},
			{
				label: labelLinkMoreInfoActivies,
				type: InputTypes.url,
				name: "activities_link",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelOutdoorActivies,
				type: InputTypes.textarea,
				name: "outdoors_possibilities_info",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelLinkMoreInfoOutdoor,
				type: InputTypes.url,
				name: "outdoors_possibilities_link",
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
			},
		],
		accessibilityFields: [
			{
				label: labelAccessibility,
				type: InputTypes.textarea,
				name: "accessibility_info",
				required: true,
				valid: false,
				touched: false,
			},
		],
		staffFields: [
			{
				label: labelPersonnel,
				type: InputTypes.textarea,
				name: "staff_info",
			},
			{
				label: labelLinkMoreInfoPersonnel,
				type: InputTypes.url,
				name: "staff_satisfaction_info",
			},
		],
		otherServicesFields: [
			{
				label: labelOtherServices,
				type: InputTypes.textarea,
				name: "other_services",
			},
		],
		nearbyServicesFields: [
			{
				label: labelNearbyServices,
				type: InputTypes.textarea,
				name: "nearby_services",
				required: true,
				valid: false,
				touched: false,
			},
		],
		vacancyFields: [
			{
				label: intro,
				type: InputTypes.radio,
				buttons: [
					{ value: true, label: labelTrue },
					{ value: false, label: labelFalse },
				],
				name: "has_vacancy",
				change: (selected: InputFieldValue) => {
					setHasVacancy(selected as boolean);
				},
			},
			{
				label: labelLAHapartments,
				type: InputTypes.checkbox,
				name: "lah",
			},
		],
	});

	const [formIsValid, setFormIsValid] = useState(false);

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

	const validateField = (value: any): boolean => {
		return value !== null && value !== "";
	};

	const getAllFields = (): InputField[] => {
		let fields: InputField[] = [];

		const sections = Object.keys(form).map(section => form[section]);

		for (const section of sections) {
			fields = [...fields, ...section];
		}

		return fields;
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			if (formIsValid) {
				setPopupState("saving");

				await requestVacancyStatusUpdate(id, key, hasVacancy);

				if (nursingHome) {
					const fields = getAllFields();

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
			} else {
				setPopupState("invalid");
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
			setFormIsValid(validForm);
		}
	};

	const handleInputBlur = (
		field: InputField,
		section: string,
		value: InputFieldValue,
	): void => {
		const { name, required } = field;

		if (required) {
			const validField = validateField(value);

			const fields = [...form[section]];
			const index = fields.findIndex(input => input.name === name);

			fields[index] = { ...field, touched: true, valid: validField };

			setForm({ ...form, [section]: fields });
		}

		validateForm();
	};

	const handleInputChange = (
		field: InputField,
		section: string,
		value: InputFieldValue,
	): void => {
		if (nursingHome) {
			const { name, type, touched } = field;

			if (!touched) {
				const fields = [...form[section]];
				const index = fields.findIndex(input => input.name === name);

				fields[index] = { ...field, touched: true };

				setForm({ ...form, [section]: fields });
			}

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
		section: string,
		index: number,
	): JSX.Element | null => {
		if (nursingHome) {
			const fieldInvalid =
				field.required && field.touched && !field.valid;

			switch (field.type) {
				case "textarea":
					return (
						<div className="field" key={`${field.name}-${index}`}>
							<label className="label" htmlFor={field.name}>
								{field.label} {field.required ? "*" : ""}
							</label>
							<div className="control">
								<textarea
									className={
										fieldInvalid ? "input error" : "input"
									}
									rows={5}
									value={
										(nursingHome[field.name] as string) ||
										""
									}
									name={field.name}
									id={field.name}
									onChange={event =>
										handleInputChange(
											field,
											section,
											event.target.value,
										)
									}
									required={field.required}
									onBlur={event =>
										handleInputBlur(
											field,
											section,
											event.target.value,
										)
									}
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
						<div className="field" key={`${field.name}-${index}`}>
							<Checkbox
								name={field.name}
								id={field.name}
								onChange={checked =>
									handleInputChange(field, section, checked)
								}
								isChecked={
									(nursingHome[field.name] as boolean) ||
									false
								}
							>
								{field.label}
							</Checkbox>
						</div>
					);
				case "radio":
					return (
						<fieldset
							className="field"
							key={`${field.name}-${index}`}
						>
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
														field.change(
															button.value,
														);
													}

													handleInputChange(
														field,
														section,
														button.value,
													);
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
						<div className="field" key={`${field.name}-${index}`}>
							<label className="label" htmlFor={field.name}>
								{field.label} {field.required ? "*" : ""}
							</label>
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
											section,
											event.target.value,
										)
									}
									onBlur={event =>
										handleInputBlur(
											field,
											section,
											event.target.value,
										)
									}
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
								<h3 className="page-update-minor-title">
									{freeApartmentsStatus}
								</h3>
								<p className="page-update-data">
									<strong>{nursingHomeName}: </strong>
									{nursingHome.name}
								</p>
								<p className="page-update-data">
									<strong>{status}: </strong>
									{vacancyStatus
										? vacancyStatus.has_vacancy
											? labelTrue
											: labelFalse
										: loadingText}
								</p>
								<p className="page-update-data">
									<strong>{lastUpdate}: </strong>
									{vacancyStatus
										? formatDate(
												vacancyStatus.vacancy_last_updated_at,
										  ) || noUpdate
										: loadingText}
								</p>

								<div className="page-update-data">
									{form.vacancyFields.map((field, index) =>
										getInputElement(
											field,
											"vacancyFields",
											index,
										),
									)}
								</div>
								<div className="page-update-data">
									<Link
										className="btn update-images-button"
										to={`/hoivakodit/${id}/paivita/${key}/kuvat`}
									>
										Lisää kuvia
									</Link>
								</div>
							</div>
							<div className="page-update-section">
								<h3>{labelVisitingInfo}</h3>
								{form.nursingHomeContactFields.map(
									(field, index) =>
										getInputElement(
											field,
											"nursingHomeContactFields",
											index,
										),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelContactInfo}</h3>
								<div className="page-update-columns">
									{form.addressFields.map((field, index) =>
										getInputElement(
											field,
											"addressFields",
											index,
										),
									)}
								</div>
								{form.contactFields.map((field, index) =>
									getInputElement(
										field,
										"contactFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelBasicInformation}</h3>
								{form.basicFields.map((field, index) =>
									getInputElement(
										field,
										"basicFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelNearbyServices}</h3>
								{form.nearbyServicesFields.map((field, index) =>
									getInputElement(
										field,
										"nearbyServicesFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelFoodHeader}</h3>
								{form.foodFields.map((field, index) =>
									getInputElement(field, "foodFields", index),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelActivies}</h3>
								{form.activitiesFields.map((field, index) =>
									getInputElement(
										field,
										"activitiesFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelAccessibility}</h3>
								{form.accessibilityFields.map((field, index) =>
									getInputElement(
										field,
										"accessibilityFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelPersonnel}</h3>
								{form.staffFields.map((field, index) =>
									getInputElement(
										field,
										"staffFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelOtherServices}</h3>
								{form.otherServicesFields.map((field, index) =>
									getInputElement(
										field,
										"otherServicesFields",
										index,
									),
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
