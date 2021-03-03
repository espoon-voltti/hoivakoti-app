import React, { FC, useEffect, useState, Fragment, useCallback } from "react";
import { useT } from "../i18n";
import "../styles/PageUpdate.scss";
import Radio from "./Radio";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./types";
import { NursingHome } from "./types";
import Checkbox from "./Checkbox";

import { Commune } from "./commune";

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
type InputFieldValue = string | number | boolean | Commune[] | null;

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

interface Translation {
	[key: string]: string;
}

interface InputField {
	label: string;
	type: InputTypes;
	name: NursingHomeKey;
	description?: string;
	buttons?: { value: string | boolean; label: string; checked?: boolean }[];
	required?: boolean;
	valid?: boolean;
	touched?: boolean;
	change?: (...arg: any) => InputFieldValue;
	maxlength?: number;
	value: InputFieldValue;
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

const requestCommunesUpdate = async (
	id: string,
	communes: Commune[],
): Promise<void> => {
	try {
		await axios.post(`${config.API_URL}/nursing-homes/${id}/communes`, {
			// eslint-disable-next-line @typescript-eslint/camelcase
			customer_commune: communes,
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const PageUpdate: FC = () => {
	const { id, key } = useParams<NursingHomeRouteParams>();

	if (!id || !key) throw new Error("Invalid URL!");

	const history = useHistory();
	const location = useLocation();

	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [vacancyStatus, setVacancyStatus] = useState<VacancyStatus | null>(
		null,
	);
	const [hasVacancy, setHasVacancy] = useState<boolean>(false);

	const [popupState, setPopupState] = useState<
		null | "saving" | "saved" | "invalid"
	>(null);

	const labelOwner = useT("ownerOrganisation");
	const labelAra = useT("filterAraLabel");
	const labelYearOfConst = useT("yearofConst");
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
	const labelLinkMoreActiviesInfo = useT("linkMoreInfoActivies");
	const labelOutdoorActivies = useT("outdoorActivies");
	const labelLinkMoreOutdoorInfo = useT("linkMoreInfoOutdoor");
	const labelVisitingInfo = useT("visitingInfo");
	const labelAccessibility = useT("accessibility");
	const labelAccessibilityInfo = useT("accessibilityInfo");
	const labelPersonnel = useT("personnel");
	const labelLinkMorePersonnelInfo = useT("linkMoreInfoPersonnel");
	const labelOtherServices = useT("otherServices");
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
	const labelArrivalPublicTransit = useT("arrivalPublicTransit");
	const labelArrivalCar = useT("arrivalCar");
	const labelContactName = useT("contactName");
	const labelContactTitle = useT("contactTitle");
	const labelContactPhone = useT("contactPhone");
	const labelContactEmail = useT("contactEmail");
	const labelContactPhoneInfo = useT("contactPhoneInfo");
	const labelContactDescription = useT("contactDescription");
	const labelNursingHomeName = useT("nursingHomeName");
	const labelSelectVancyStatus = useT("selectVancyStatus");
	const labelTrue = useT("vacancyTrue");
	const labelFalse = useT("vacancyFalse");
	const labelPartlyARADestination = useT("partlyARADestination");
	const labelFoodOwnKitchen = useT("foodOwnKitchen");
	const labelFoodDelivered = useT("foodDelivered");
	const labelActivitiesInfo = useT("activitiesInfo");
	const labelStaffInfo = useT("staffInfo");
	const labelNearbyServices = useT("labelNearbyServices");
	const labelAddImages = useT("labelAddImages");
	const labelCustomerCommune = useT("labelCustomerCommune");

	const helperSummary = useT("helperSummary");
	const helperBuildingInfo = useT("helperBuildingInfo");
	const helperApartmentCountInfo = useT("helperApartmentCountInfo");
	const helperApartmentSize = useT("helperApartmentSize");
	const helperRent = useT("helperRent");
	const helperRentInfo = useT("helperRentInfo");
	const helperLanguage = useT("helperLanguage");
	const helperActivitiesLink = useT("helperActivitiesLink");
	const helperOutdoorActivities = useT("helperOutdoorActivities");
	const helperAccessibilityInfo = useT("helperAccessibilityInfo");
	const helperStaffSatisfaction = useT("helperStaffSatisfaction");
	const helperOtherServices = useT("helperOtherServices");
	const helperUrl = useT("helperUrl");

	const title = useT("updateNursingHomeTitle");
	const freeApartmentsStatus = useT("freeApartmentsStatus");
	const loadingText = useT("loadingText");
	const lastUpdate = useT("lastUpdate");
	const noUpdate = useT("noUpdate");
	const btnSave = useT("btnSave");
	const cancel = useT("cancel");
	const textFieldIsRequired = useT("fieldIsRequired");
	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	const formIsInvalid = useT("formIsInvalid");
	const filterFinnish = useT("filterFinnish");
	const filterSwedish = useT("filterSwedish");
	const nearbyServices = useT("nearbyServices");
	const fieldsWithAsteriskAreMandatory = useT(
		"fieldsWithAsteriskAreMandatory",
	);

	const LUCommunes: Translation = {
		[Commune.EPO]: useT("espoo"),
		[Commune.HNK]: useT("hanko"),
		[Commune.INK]: useT("inkoo"),
		[Commune.KAU]: useT("kauniainen"),
		[Commune.PKA]: useT("karviainen"),
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.STO]: useT("siuntio"),
	};

	const [form, setForm] = useState<{ [key: string]: InputField[] }>({
		vacancyFields: [
			{
				label: labelNursingHomeName,
				type: InputTypes.text,
				name: "name",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelSelectVancyStatus,
				type: InputTypes.radio,
				buttons: [
					{ value: true, label: labelTrue },
					{ value: false, label: labelFalse },
				],
				name: "has_vacancy",
				required: true,
				valid: false,
				touched: false,
				value: null,
			},
			{
				label: labelHasLAHapartments,
				type: InputTypes.checkbox,
				name: "lah",
				value: null,
			},
		],
		contactFields: [
			{
				label: labelContactDescription,
				type: InputTypes.textarea,
				name: "tour_info",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelContactPhoneInfo,
				type: InputTypes.textarea,
				name: "contact_phone_info",
				maxlength: 200,
				value: "",
			},
		],
		contactColumnFields: [
			{
				label: labelContactName,
				type: InputTypes.text,
				name: "contact_name",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelContactTitle,
				type: InputTypes.text,
				name: "contact_title",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelContactPhone,
				type: InputTypes.tel,
				name: "contact_phone",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelContactEmail,
				type: InputTypes.email,
				name: "email",
				required: true,
				valid: false,
				touched: false,
				value: "",
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
				value: "",
			},
			{
				label: labelPostalCode,
				type: InputTypes.text,
				name: "postal_code",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelCity,
				type: InputTypes.text,
				name: "city",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelDistrict,
				type: InputTypes.text,
				name: "district",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
		],
		guideFields: [
			{
				label: labelWebpage,
				type: InputTypes.url,
				name: "www",
				description: helperUrl,
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelArrivalPublicTransit,
				type: InputTypes.textarea,
				name: "arrival_guide_public_transit",
				maxlength: 200,
				value: "",
			},
			{
				label: labelArrivalCar,
				type: InputTypes.textarea,
				name: "arrival_guide_car",
				maxlength: 200,
				value: "",
			},
		],
		infoFields: [
			{
				label: labelSummary,
				type: InputTypes.textarea,
				name: "summary",
				description: helperSummary,
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelOwner,
				type: InputTypes.text,
				name: "owner",
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelAra,
				type: InputTypes.radio,
				name: "ara",
				buttons: [
					{ value: labelYes, label: labelYes },
					{ value: labelNo, label: labelNo },
					{
						value: labelPartlyARADestination,
						label: labelPartlyARADestination,
					},
				],
				value: "",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelYearOfConst,
				type: InputTypes.number,
				name: "construction_year",
				required: true,
				valid: false,
				touched: false,
				value: null,
			},
			{
				label: labelBuildingInfo,
				type: InputTypes.textarea,
				name: "building_info",
				description: helperBuildingInfo,
				maxlength: 200,
				value: "",
			},
			{
				label: labelNumApartments,
				type: InputTypes.number,
				name: "apartment_count",
				required: true,
				valid: false,
				touched: false,
				value: null,
			},
			{
				label: labelApartmentCountInfo,
				type: InputTypes.textarea,
				name: "apartment_count_info",
				description: helperApartmentCountInfo,
				maxlength: 300,
				value: "",
			},
			{
				label: labelApartmentSize + " (m²)",
				type: InputTypes.text,
				name: "apartment_square_meters",
				description: helperApartmentSize,
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelApartmentsHaveBathroom,
				type: InputTypes.checkbox,
				name: "apartments_have_bathroom",
				value: false,
			},
			{
				label: labelRent + " (€ / kk)",
				type: InputTypes.text,
				name: "rent",
				description: helperRent,
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelRentInfo,
				type: InputTypes.textarea,
				name: "rent_info",
				description: helperRentInfo,
				maxlength: 200,
				value: "",
			},
			{
				label: labelServiceLanguage,
				type: InputTypes.checkbox,
				name: "language",
				buttons: [
					{
						label: filterFinnish,
						value: filterFinnish,
					},
					{
						label: filterSwedish,
						value: filterSwedish,
					},
				],
				value: "",
				change: (current: string, value: string) => {
					let languages: string[] = [];

					if (current) {
						languages = current
							.split("|")
							.filter((value: string) => value !== "");
					}

					if (languages.includes(value)) {
						const index = languages.indexOf(value);

						languages.splice(index, 1);
					} else {
						languages.push(value);
					}

					const sortLanguages = languages.sort((a, b) => {
						return a.localeCompare(b);
					});

					if (sortLanguages.length > 1) {
						return sortLanguages.join("|");
					} else if (sortLanguages.length === 1) {
						return sortLanguages[0];
					} else {
						return "";
					}
				},
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelLanguageInfo,
				type: InputTypes.textarea,
				name: "language_info",
				description: helperLanguage,
				maxlength: 200,
				value: "",
			},
		],
		communesFields: [
			{
				label: labelCustomerCommune,
				type: InputTypes.checkbox,
				name: "customer_commune",
				buttons: [
					...Object.keys(LUCommunes).map(key => {
						return {
							label: LUCommunes[key],
							value: key,
						};
					}),
				],
				value: null,
				change: (current: Commune[], value: string) => {
					let newList: Commune[];

					if (!current) {
						newList = [];
					} else {
						newList = [...current];
					}

					const commune = value as Commune;

					if (newList.includes(commune)) {
						const index = newList.indexOf(commune);

						newList.splice(index, 1);
					} else {
						newList.push(commune);
					}

					return newList;
				},
			},
		],
		foodFields: [
			{
				label: labelLinkMenu,
				type: InputTypes.url,
				name: "menu_link",
				description: helperUrl,
				value: "",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelCookingMethod,
				type: InputTypes.radio,
				name: "meals_preparation",
				buttons: [
					{
						value: labelFoodOwnKitchen,
						label: labelFoodOwnKitchen,
					},
					{
						value: labelFoodDelivered,
						label: labelFoodDelivered,
					},
				],
				value: "",
				required: true,
				valid: false,
				touched: false,
			},
			{
				label: labelFoodMoreInfo,
				type: InputTypes.textarea,
				name: "meals_info",
				maxlength: 200,
				value: "",
			},
		],
		activitiesFields: [
			{
				label: labelActivitiesInfo,
				type: InputTypes.textarea,
				name: "activities_info",
				maxlength: 400,
				required: true,
				valid: false,
				touched: false,
				value: "",
			},
			{
				label: labelLinkMoreActiviesInfo,
				type: InputTypes.url,
				name: "activities_link",
				description: `${helperActivitiesLink} ${helperUrl}`,
				value: "",
			},
			{
				label: labelOutdoorActivies,
				type: InputTypes.textarea,
				name: "outdoors_possibilities_info",
				description: helperOutdoorActivities,
				maxlength: 200,
				value: "",
			},
			{
				label: labelLinkMoreOutdoorInfo,
				type: InputTypes.url,
				name: "outdoors_possibilities_link",
				description: helperUrl,
				value: "",
			},
		],
		accessibilityFields: [
			{
				label: labelAccessibilityInfo,
				type: InputTypes.textarea,
				name: "accessibility_info",
				description: helperAccessibilityInfo,
				maxlength: 200,
				value: "",
			},
		],

		staffFields: [
			{
				label: labelStaffInfo,
				type: InputTypes.textarea,
				name: "staff_info",
				maxlength: 400,
				value: "",
			},
			{
				label: labelLinkMorePersonnelInfo,
				type: InputTypes.url,
				name: "staff_satisfaction_info",
				description: `${helperStaffSatisfaction} ${helperUrl}`,
				value: "",
			},
		],
		otherServicesFields: [
			{
				label: labelOtherServices,
				type: InputTypes.textarea,
				name: "other_services",
				description: helperOtherServices,
				maxlength: 200,
				value: "",
			},
		],
		nearbyServicesFields: [
			{
				label: labelNearbyServices,
				type: InputTypes.textarea,
				name: "nearby_services",
				maxlength: 200,
				value: "",
			},
		],
	});

	const [formIsValid, setFormIsValid] = useState(false);
	const [formLoading, setFormLoading] = useState(true);

	const prepopulateFields = useCallback((data: any): void => {
		setFormLoading(true);
		const prepopulatedForm = { ...form };

		for (const section in prepopulatedForm) {
			const modifiedSection = [...prepopulatedForm[section]].map(
				field => {
					if (field.name in data) {
						const value = data[field.name];

						if (value !== "" && value !== null) {
							if (field.buttons) {
								if (field.type === InputTypes.checkbox) {
									const preSelected = field.buttons.map(
										button => {
											return {
												...button,
												checked: (value as string).includes(
													button.value as string,
												),
											};
										},
									);

									return {
										...field,
										buttons: preSelected,
										value: value,
									};
								} else {
									const preSelected = field.buttons.map(
										button => {
											return {
												...button,
												checked: value === button.value,
											};
										},
									);

									return {
										...field,
										buttons: preSelected,
										value: value,
									};
								}
							} else {
								return {
									...field,
									value: value,
								};
							}
						}
					}

					return field;
				},
			);

			prepopulatedForm[section] = modifiedSection;
		}

		setForm(prepopulatedForm);
		setFormLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
	}, [id, filterFinnish]);

	useEffect(() => {
		if (!vacancyStatus) {
			axios
				.get(
					`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
				)
				.then((response: { data: VacancyStatus }) => {
					const data = response.data;

					setVacancyStatus(data);
					setHasVacancy(data.has_vacancy);

					if (popupState) setTimeout(() => setPopupState(null), 3000);
				})
				.catch(e => {
					console.error(e);
					throw e;
				});
		}
	}, [id, key, popupState, vacancyStatus]);

	useEffect(() => {
		prepopulateFields({
			...nursingHome,
			// eslint-disable-next-line @typescript-eslint/camelcase
			has_vacancy: hasVacancy,
		});
	}, [nursingHome, prepopulateFields, hasVacancy]);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			if (formIsValid) {
				setPopupState("saving");

				let fields: InputField[] = [];

				const sections = Object.keys(form).map(
					section => form[section],
				);

				for (const section of sections) {
					fields = [...fields, ...section];
				}

				const vacancyField = fields.find(
					field => field.name === "has_vacancy",
				);

				const communesField = fields.find(
					field => field.name === "customer_commune",
				);
				if (vacancyField) {
					await requestVacancyStatusUpdate(
						id,
						key,
						vacancyField.value as boolean,
					);
				}

				if (communesField) {
					await requestCommunesUpdate(
						id,
						communesField.value as Commune[],
					);
				}

				const formData: any = {};

				for (const field of fields) {
					if (
						field.name !== "has_vacancy" &&
						field.name !== "customer_commune"
					) {
						formData[field.name] = field.value;
					}
				}

				const updateFormData: NursingHomeUpdateData = formData;

				await requestNursingHomeUpdate(id, key, updateFormData);

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

		history.push({ pathname: `${location.pathname}/peruuta` });
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
		let validForm = true;

		const validatedForm = { ...form };

		for (const section in validatedForm) {
			const fields = validatedForm[section];
			const validatedFields = [];

			for (const field of fields) {
				if (field.required) {
					const validField = validateField(field.value);

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

		if (!validForm) {
			setPopupState("invalid");
		} else {
			setPopupState(null);
		}
	};

	const handleInputChange = (
		field: InputField,
		section: string,
		value: InputFieldValue,
	): void => {
		const { name, type } = field;

		const shouldValidate = "touched" in field && "required" in field;

		const newField = { ...field };

		if (
			field.type === InputTypes.checkbox ||
			field.type === InputTypes.radio
		) {
			if (newField.buttons) {
				const newButtons = [];

				for (const button of newField.buttons) {
					let checked;

					if (typeof button.value === "string") {
						checked = (value as string).includes(
							button.value as string,
						);
					} else {
						checked = value === button.value;
					}

					newButtons.push({
						...button,
						checked: checked,
					});
				}

				newField.buttons = newButtons;
			}
		}

		if (shouldValidate) {
			const validField = validateField(value);

			newField.touched = true;
			newField.valid = validField;
		}

		newField.value =
			type === "number" && typeof value === "string"
				? parseInt(value)
				: value;

		const fields = [...form[section]];
		const index = fields.findIndex(input => input.name === name);

		fields[index] = newField;

		setForm({ ...form, [section]: fields });
	};

	const getInputElement = (
		field: InputField,
		section: string,
		index: number,
	): JSX.Element | null => {
		const fieldInvalid = field.required && field.touched && !field.valid;
		const key = `${field.name}-${index}`;

		switch (field.type) {
			case "textarea":
				return (
					<div className="field" key={key}>
						<label
							id={`${field.name}-label`}
							className="label"
							htmlFor={field.name}
						>
							{field.label}
							{field.required ? (
								<span className="asterisk" aria-hidden="true">
									{" "}
									*
								</span>
							) : null}
						</label>
						{field.description ? (
							<span
								id={`${field.name}-description`}
								className="input-description"
							>
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
								value={(field.value as string) || ""}
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
								aria-required={field.required}
								onBlur={validateForm}
								aria-labelledby={
									field.description
										? `${field.name}-label ${field.name}-description`
										: undefined
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
					<Fragment key={key}>
						{field.buttons ? (
							<fieldset className="field">
								<legend>
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
								</legend>
								{field.description ? (
									<span
										id={`${field.name}-description`}
										className="input-description"
									>
										{field.description}
									</span>
								) : null}
								<div className="control">
									{field.buttons.map(button => {
										return (
											<Checkbox
												key={`${field.name}-${button.value}`}
												id={`${field.name}-${button.value}`}
												name={field.name}
												onChange={() => {
													let newValue = button.value as InputFieldValue;

													if (field.change) {
														newValue = field.change(
															field.value,
															button.value as string,
														);
													}

													handleInputChange(
														field,
														section,
														newValue,
													);
												}}
												onBlur={validateForm}
												isChecked={
													button.checked || false
												}
											>
												{button.label}
											</Checkbox>
										);
									})}
									{fieldInvalid ? (
										<span className="icon"></span>
									) : null}
								</div>
								{fieldInvalid ? (
									<p className="help">
										{textFieldIsRequired}
									</p>
								) : null}
							</fieldset>
						) : (
							<div className="field">
								<Checkbox
									name={field.name}
									id={field.name}
									onChange={checked =>
										handleInputChange(
											field,
											section,
											checked,
										)
									}
									onBlur={validateForm}
									isChecked={
										(field.value as boolean) || false
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
						<legend>
							{field.label}
							{field.required ? (
								<span className="asterisk" aria-hidden="true">
									{" "}
									*
								</span>
							) : null}
						</legend>
						{field.buttons ? (
							<Fragment>
								<div className="control">
									{field.buttons.map(button => {
										return (
											<Radio
												key={`${field.name}-${button.value}`}
												id={`${field.name}-${button.value}`}
												name={field.name}
												isSelected={
													button.checked || false
												}
												value={
													(button.value as string) ||
													""
												}
												onChange={() => {
													let newValue = button.value as InputFieldValue;

													if (field.change) {
														newValue = field.change(
															field.value,
															button.value as string,
														);
													}

													handleInputChange(
														field,
														section,
														newValue,
													);
												}}
												onBlur={validateForm}
											>
												{button.label}
											</Radio>
										);
									})}
									{fieldInvalid ? (
										<span className="icon"></span>
									) : null}
								</div>
								{fieldInvalid ? (
									<p className="help">
										{textFieldIsRequired}
									</p>
								) : null}
							</Fragment>
						) : null}
					</fieldset>
				);
			default:
				return (
					<div className="field" key={key}>
						<label
							id={`${field.name}-label`}
							className="label"
							htmlFor={field.name}
						>
							{field.label}
							{field.required ? (
								<span className="asterisk" aria-hidden="true">
									{" "}
									*
								</span>
							) : null}
						</label>
						{field.description ? (
							<span
								id={`${field.name}-description`}
								className="input-description"
							>
								{field.description}
							</span>
						) : null}
						<div className="control">
							<input
								className={
									fieldInvalid ? "input error" : "input"
								}
								value={(field.value as string) || ""}
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
								onBlur={validateForm}
								required={field.required}
								aria-required={field.required}
								aria-labelledby={
									field.description
										? `${field.name}-label ${field.name}-description`
										: undefined
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
				{!form && formLoading ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
						<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
							<div className="nav-save">
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
							</div>
							<h1 className="page-update-title">{title}</h1>
							<p className="page-update-info" aria-hidden="true">
								{fieldsWithAsteriskAreMandatory}
							</p>
							<div className="page-update-section">
								<h3>{freeApartmentsStatus}</h3>
								{form.vacancyFields.map((field, index) =>
									getInputElement(
										field,
										"vacancyFields",
										index,
									),
								)}

								<Link
									className="btn update-images-button"
									to={{
										pathname: `/hoivakodit/${id}/paivita/${key}/kuvat`,
									}}
								>
									{labelAddImages}
								</Link>
							</div>
							<div className="page-update-section">
								<h3>{labelVisitingInfo}</h3>
								{getInputElement(
									form.contactFields[0],
									"contactFields",
									0,
								)}
								<div className="page-update-columns">
									{form.contactColumnFields.map(
										(field, index) =>
											getInputElement(
												field,
												"contactColumnFields",
												index,
											),
									)}
								</div>
								{getInputElement(
									form.contactFields[1],
									"contactFields",
									1,
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
								{form.guideFields.map((field, index) =>
									getInputElement(
										field,
										"guideFields",
										index,
									),
								)}
							</div>
							<div className="page-update-section">
								<h3>{labelBasicInformation}</h3>
								{form.infoFields.map((field, index) =>
									getInputElement(field, "infoFields", index),
								)}
								<div className="checkbox-columns">
									{form.communesFields.map((field, index) =>
										getInputElement(
											field,
											"communesFields",
											index,
										),
									)}
								</div>
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
							<div className="page-update-section page-update-section-last">
								<h3>{nearbyServices}</h3>
								{form.nearbyServicesFields.map((field, index) =>
									getInputElement(
										field,
										"nearbyServicesFields",
										index,
									),
								)}
							</div>
							<div className="nav-save">
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
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;
