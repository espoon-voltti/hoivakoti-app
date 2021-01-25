import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageUpdate.scss";
import Radio from "./Radio";
import ImageUpload from "./ImageUpload";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
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
	buttons?: { value: string; label: string }[];
	required?: boolean;
	valid?: boolean;
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
	images: object[],
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		{
			// eslint-disable-next-line @typescript-eslint/camelcase
			has_vacancy: status,
		},
	);

	for (const image of images) {
		await axios.post(
			`${config.API_URL}/nursing-homes/${id}/update-image/${key}`,
			{
				image: image,
			},
		);
	}
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
	const labelSummary = useT("summary");
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
	const title = useT("pageUpdateTitle");
	const freeApartmentsStatus = useT("freeApartmentsStatus");
	const organizationLogo = useT("organizationLogo");
	const organizationPhotos = useT("organizationPhotos");
	const organizationPhotosGuide = useT("organizationPhotosGuide");
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
				valid: true,
			},
			{
				label: labelOwner,
				type: InputTypes.text,
				name: "owner",
				required: true,
				valid: true,
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
				valid: true,
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
				valid: true,
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
				valid: true,
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
				valid: true,
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
				valid: true,
			},
			{
				label: labelLanguageInfo,
				type: InputTypes.textarea,
				name: "language_info",
			},
			{
				label: labelLAHapartments,
				type: InputTypes.checkbox,
				name: "lah",
			},
		],
		contactFields: [
			{
				label: labelAddress,
				type: InputTypes.text,
				name: "address",
				required: true,
				valid: true,
			},
			{
				label: labelPostalCode,
				type: InputTypes.text,
				name: "postal_code",
				required: true,
				valid: true,
			},
			{
				label: labelCity,
				type: InputTypes.text,
				name: "city",
				required: true,
				valid: true,
			},
			{
				label: labelDistrict,
				type: InputTypes.text,
				name: "district",
			},
			{
				label: labelWebpage,
				type: InputTypes.url,
				name: "www",
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
				valid: true,
			},
			{
				label: labelFoodMoreInfo,
				type: InputTypes.textarea,
				name: "meals_info",
			},
			{
				label: labelLinkMenu,
				type: InputTypes.url,
				name: "menu_link",
			},
		],
		activitiesFields: [
			{
				label: labelActivies,
				type: InputTypes.textarea,
				name: "activities_info",
			},
			{
				label: labelLinkMoreInfoActivies,
				type: InputTypes.url,
				name: "activities_link",
			},
			{
				label: labelOutdoorActivies,
				type: InputTypes.textarea,
				name: "outdoors_possibilities_info",
			},
			{
				label: labelLinkMoreInfoOutdoor,
				type: InputTypes.url,
				name: "outdoors_possibilities_link",
			},
		],
		nursingHomeContactFields: [
			{
				label: labelVisitingInfo,
				type: InputTypes.textarea,
				name: "tour_info",
			},
			{
				label: labelContactName,
				type: InputTypes.text,
				name: "contact_name",
				required: true,
				valid: true,
			},
			{
				label: labelContactTitle,
				type: InputTypes.text,
				name: "contact_title",
				required: true,
				valid: true,
			},
			{
				label: labelContactPhone,
				type: InputTypes.tel,
				name: "contact_phone",
				required: true,
				valid: true,
			},
			{
				label: labelContactEmail,
				type: InputTypes.email,
				name: "email",
				required: true,
				valid: true,
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
			},
		],
	});

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

	const imageState = [
		{ name: "overview_outside", remove: false, value: "", text: "" },
		{ name: "apartment", remove: false, value: "", text: "" },
		{ name: "lounge", remove: false, value: "", text: "" },
		{ name: "dining_room", remove: false, value: "", text: "" },
		{ name: "outside", remove: false, value: "", text: "" },
		{ name: "entrance", remove: false, value: "", text: "" },
		{ name: "bathroom", remove: false, value: "", text: "" },
		{ name: "apartment_layout", remove: false, value: "", text: "" },
		{ name: "nursinghome_layout", remove: false, value: "", text: "" },
		{ name: "owner_logo", remove: false, value: "", text: "" },
	];

	const nursinghomeImageTypes = [
		"overview_outside",
		"apartment",
		"lounge",
		"dining_room",
		"outside",
		"entrance",
		"bathroom",
		"apartment_layout",
		"nursinghome_layout",
	];

	const removeImage = (id: string): void => {
		const index = imageState.findIndex(x => x.name === id);
		imageState[index].remove = true;
		imageState[index].value = "";
	};

	const updateImageState = (id: string, state: string): void => {
		const index = imageState.findIndex(x => x.name === id);
		imageState[index].value = state;
		imageState[index].remove = false;
	};

	const updateCaptionState = (id: string, state: string): void => {
		const index = imageState.findIndex(x => x.name === id);
		imageState[index].text = state;
	};

	const validForm = (): boolean => {
		let formIsValid = true;

		Object.keys(form).forEach(section => {
			const invalidFields =
				form[section].filter(field => {
					return field.valid === false;
				}).length > 0;

			if (invalidFields) {
				formIsValid = false;
			}
		});

		return formIsValid;
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			if (validForm()) {
				setPopupState("saving");

				await requestVacancyStatusUpdate(
					id,
					key,
					hasVacancy,
					imageState,
				);

				if (nursingHome) {
					let fields: InputField[] = [];

					Object.keys(form)
						.map(section => form[section])
						.forEach(section => {
							fields = [...fields, ...section];
						});

					const formData: any = {};

					fields.forEach(field => {
						formData[field.name] = nursingHome[field.name];
					});

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

	const validateField = (value: string | number): boolean => {
		return value !== null && value !== "";
	};

	const handleInputBlur = (
		field: InputField,
		section: string,
		value: string | number,
	): void => {
		const { name, required } = field;

		if (required) {
			const validField = validateField(value);
			const fields = [...form[section]];
			const index = fields.findIndex(input => input.name === name);

			fields[index] = { ...field, valid: validField };

			setForm({ ...form, [section]: fields });
		}
	};

	const handleInputChange = (
		field: InputField,
		value: string | number | boolean,
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
	};

	const getInputElement = (
		field: InputField,
		section: string,
		index: number,
	): JSX.Element | null => {
		if (nursingHome) {
			switch (field.type) {
				case "textarea":
					return (
						<div className="field" key={`${field.name}-${index}`}>
							<label className="label" htmlFor={field.name}>
								{field.label}
							</label>
							<div className="control">
								<textarea
									className={
										field.required && !field.valid
											? "input error"
											: "input"
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
								{field.required && !field.valid ? (
									<span className="icon"></span>
								) : null}
							</div>
							{field.required && !field.valid ? (
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
									handleInputChange(field, checked)
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
							<legend>{labelAra}</legend>
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
													handleInputChange(
														field,
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
								{field.label}
							</label>
							<div className="control">
								<input
									className={
										field.required && !field.valid
											? "input error"
											: "input"
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
									onBlur={event =>
										handleInputBlur(
											field,
											section,
											event.target.value,
										)
									}
								/>
								{field.required && !field.valid ? (
									<span className="icon"></span>
								) : null}
							</div>
							{field.required && !field.valid ? (
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
								<button type="submit" className="btn">
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
								<p className="page-update-intro">{intro}</p>

								<Radio
									id="update-vacancy-true"
									name="update-vacancy-true"
									isSelected={hasVacancy}
									onChange={isChecked => {
										if (isChecked) setHasVacancy(true);
									}}
								>
									{labelTrue}
								</Radio>
								<Radio
									id="update-vacancy-false"
									name="update-vacancy-false"
									isSelected={!hasVacancy}
									onChange={isChecked => {
										if (isChecked) setHasVacancy(false);
									}}
								>
									{labelFalse}
								</Radio>
							</div>
						</form>
						<div className="page-update-section nursinghome-logo-upload">
							<h3 className="page-update-minor-title">
								{organizationLogo}
							</h3>
							<ImageUpload
								nursingHome={nursingHome}
								imageName={"owner_logo" as NursingHomeImageName}
								useButton={true}
								textAreaClass="textarea-hidden"
								onRemove={() => {
									removeImage("owner_logo");
								}}
								onChange={file => {
									updateImageState("owner_logo", file);
								}}
							/>
						</div>
						<div className="page-update-section">
							<h3 className="page-update-minor-title">
								{organizationPhotos}
							</h3>
							<p>{organizationPhotosGuide}</p>
							<div className="flex-container">
								{nursinghomeImageTypes.map(
									(imageType, index) => (
										<ImageUpload
											key={`${imageType}_${index}`}
											nursingHome={nursingHome}
											imageName={
												imageType as NursingHomeImageName
											}
											useButton={false}
											textAreaClass="nursinghome-upload-caption"
											onRemove={() => {
												removeImage(imageType);
											}}
											onChange={file => {
												updateImageState(
													imageType,
													file,
												);
											}}
											onCaptionChange={text => {
												updateCaptionState(
													imageType,
													text,
												);
											}}
										/>
									),
								)}
							</div>
						</div>
						<div className="page-update-section">
							<h3>{labelBasicInformation}</h3>
							{form.basicFields.map((field, index) =>
								getInputElement(field, "basicFields", index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelContactInfo}</h3>
							{form.contactFields.map((field, index) =>
								getInputElement(field, "contactFields", index),
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
							<h3>{labelVisitingInfo}</h3>
							{form.nursingHomeContactFields.map((field, index) =>
								getInputElement(
									field,
									"nursingHomeContactFields",
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
								getInputElement(field, "staffFields", index),
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
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;
