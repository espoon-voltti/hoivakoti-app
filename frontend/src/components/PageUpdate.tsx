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
	type: string;
	name: string;
	value: string | number | boolean | undefined;
}

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
	images: any,
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

const PageUpdate: FC = () => {
	const { id, key } = useParams<NursingHomeRouteParams>();

	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [vacancyStatus, setVacancyStatus] = useState<VacancyStatus | null>(
		null,
	);
	const [popupState, setPopupState] = useState<null | "saving" | "saved">(
		null,
	);
	const [formState, setFormState] = useState<boolean>(false);

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
					setFormState(response.data.has_vacancy);
					if (popupState) setTimeout(() => setPopupState(null), 3000);
				})
				.catch(e => {
					console.error(e);
					throw e;
				});
		}
	}, [id, key, popupState, vacancyStatus]);

	useEffect(() => {
		console.log(nursingHome);
	}, [nursingHome]);

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

	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");

	let basicFields: InputField[] = [];
	let contactFields: InputField[] = [];
	let foodFields: InputField[] = [];
	let activitiesFields: InputField[] = [];
	let nursingHomeContactFields: InputField[] = [];
	let accessibilityFields: InputField[] = [];
	let staffFields: InputField[] = [];
	let otherServicesFields: InputField[] = [];
	let nearbyServicesFields: InputField[] = [];

	if (nursingHome) {
		basicFields = [
			{
				label: "Yhteenveto",
				type: InputTypes.textarea,
				name: "summary",
				value: nursingHome.summary,
			},
			{
				label: labelOwner,
				type: InputTypes.text,
				name: "owner",
				value: nursingHome.owner,
			},
			{
				label: labelAra,
				type: InputTypes.radio,
				name: "ara",
				value: nursingHome.ara,
			},
			{
				label: labelYearofConst,
				type: InputTypes.number,
				name: "construction_year",
				value: nursingHome.construction_year,
			},
			{
				label: "Lisätietoja rakennuksesta",
				type: InputTypes.textarea,
				name: "building_info",
				value: nursingHome.building_info,
			},
			{
				label: labelNumApartments,
				type: InputTypes.number,
				name: "apartment_count",
				value: nursingHome.apartment_count,
			},
			{
				label: "Lisätietoja asuntojen määrästä",
				type: InputTypes.textarea,
				name: "apartment_count_info",
				value: nursingHome.apartment_count_info,
			},
			{
				label: labelApartmentSize,
				type: InputTypes.text,
				name: "apartment_square_meters",
				value: nursingHome.apartment_square_meters,
			},
			{
				label: "Asunnoissa oma kylpyhuone",
				type: InputTypes.checkbox,
				name: "apartments_have_bathroom",
				value: nursingHome.apartments_have_bathroom,
			},
			{
				label: labelRent,
				type: InputTypes.text,
				name: "rent",
				value: nursingHome.rent,
			},
			{
				label: "Lisätietoja vuokrasta",
				type: InputTypes.textarea,
				name: "rent_info",
				value: nursingHome.rent_info,
			},
			{
				label: labelServiceLanguage,
				type: InputTypes.text,
				name: "language",
				value: nursingHome.language,
			},
			{
				label: "Lisätietoja palvelukielestä",
				type: InputTypes.textarea,
				name: "language_info",
				value: nursingHome.language_info,
			},
			{
				label: labelLAHapartments,
				type: InputTypes.checkbox,
				name: "lah",
				value: nursingHome.lah,
			},
		];

		contactFields = [
			{
				label: "Katuosoite",
				type: InputTypes.text,
				name: "address",
				value: nursingHome.address,
			},
			{
				label: "Postinumero",
				type: InputTypes.text,
				name: "postal_code",
				value: nursingHome.postal_code,
			},
			{
				label: "Kaupunki",
				type: InputTypes.text,
				name: "city",
				value: nursingHome.city,
			},
			{
				label: "Kaupunginosa",
				type: InputTypes.text,
				name: "district",
				value: nursingHome.district,
			},
			{
				label: labelWebpage,
				type: InputTypes.url,
				name: "www",
				value: nursingHome.www,
			},
			{
				label: "Saapuminen julkisilla kulkuyhteyksillä",
				type: InputTypes.textarea,
				name: "arrival_guide_public_transit",
				value: nursingHome.arrival_guide_public_transit,
			},
			{
				label: "Saapuminen autolla",
				type: InputTypes.textarea,
				name: "arrival_guide_car",
				value: nursingHome.arrival_guide_car,
			},
		];

		foodFields = [
			{
				label: labelCookingMethod,
				type: InputTypes.text,
				name: "meals_preparation",
				value: nursingHome.meals_preparation,
			},
			{
				label: labelFoodMoreInfo,
				type: InputTypes.textarea,
				name: "meals_info",
				value: nursingHome.meals_info,
			},
			{
				label: labelLinkMenu,
				type: InputTypes.url,
				name: "menu_link",
				value: nursingHome.menu_link,
			},
		];

		activitiesFields = [
			{
				label: labelActivies,
				type: InputTypes.textarea,
				name: "activities_info",
				value: nursingHome.activities_info,
			},
			{
				label: labelLinkMoreInfoActivies,
				type: InputTypes.url,
				name: "activities_link",
				value: nursingHome.activities_link,
			},
			{
				label: labelOutdoorActivies,
				type: InputTypes.textarea,
				name: "outdoors_possibilities_info",
				value: nursingHome.outdoors_possibilities_info,
			},
			{
				label: labelLinkMoreInfoOutdoor,
				type: InputTypes.url,
				name: "outdoors_possibilities_link",
				value: nursingHome.outdoors_possibilities_link,
			},
		];

		nursingHomeContactFields = [
			{
				label: labelVisitingInfo,
				type: InputTypes.textarea,
				name: "tour_info",
				value: nursingHome.tour_info,
			},
			{
				label: "Yhteyshenkilön nimi",
				type: InputTypes.text,
				name: "contact_name",
				value: nursingHome.contact_name,
			},
			{
				label: "Yhteyshenkilön titteli",
				type: InputTypes.text,
				name: "contact_title",
				value: nursingHome.contact_title,
			},
			{
				label: "Yhteyshenkilön puhelinnumero",
				type: InputTypes.tel,
				name: "contact_phone",
				value: nursingHome.contact_phone,
			},
			{
				label: "Yhteyshenkilön sähköposti",
				type: InputTypes.email,
				name: "email",
				value: nursingHome.email,
			},
			{
				label: "Lisätietoja yhteyshenkilön puhelinnumerosta",
				type: InputTypes.textarea,
				name: "contact_phone_info",
				value: nursingHome.contact_phone_info,
			},
		];

		accessibilityFields = [
			{
				label: labelAccessibility,
				type: InputTypes.textarea,
				name: "accessibility_info",
				value: nursingHome.accessibility_info,
			},
		];

		staffFields = [
			{
				label: labelPersonnel,
				type: InputTypes.textarea,
				name: "staff_info",
				value: nursingHome.staff_info,
			},
			{
				label: labelLinkMoreInfoPersonnel,
				type: InputTypes.url,
				name: "staff_satisfaction_info",
				value: nursingHome.staff_satisfaction_info,
			},
		];

		otherServicesFields = [
			{
				label: labelOtherServices,
				type: InputTypes.textarea,
				name: "other_services",
				value: nursingHome.other_services,
			},
		];

		nearbyServicesFields = [
			{
				label: labelNearbyServices,
				type: InputTypes.textarea,
				name: "nearby_services",
				value: nursingHome.nearby_services,
			},
		];
	}

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

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setPopupState("saving");
		await requestVacancyStatusUpdate(id, key, formState, imageState);
		setPopupState("saved");
		setVacancyStatus(null);
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		window.location.href = window.location.pathname + "/peruuta";
	};

	const handleInputChange = (
		key: string,
		type: string,
		value: string | number | boolean,
	): void => {
		if (nursingHome) {
			setNursingHome({
				...nursingHome,
				[key]:
					type === "number" && typeof value === "string"
						? parseInt(value)
						: value,
			});
		}
	};

	const getInputElement = (field: InputField, index: number): JSX.Element => {
		if (field.type === "textarea") {
			return (
				<div
					className="page-update-input"
					key={`${field.name}_${index}`}
				>
					<label htmlFor={field.name}>{field.label}</label>
					<textarea
						value={(field.value as string) || ""}
						name={field.name}
						id={field.name}
						onChange={event =>
							handleInputChange(
								field.name,
								field.type,
								event.target.value,
							)
						}
					></textarea>
				</div>
			);
		} else if (field.type === "checkbox") {
			return (
				<div
					className="page-update-input"
					key={`${field.name}_${index}`}
				>
					<Checkbox
						name={field.name}
						id={field.name}
						onChange={checked =>
							handleInputChange(field.name, field.type, checked)
						}
						isChecked={(field.value as boolean) || false}
					>
						{field.label}
					</Checkbox>
				</div>
			);
		} else if (field.type === "radio") {
			return (
				<div
					className="page-update-input"
					key={`${field.name}_${index}`}
				>
					<Radio
						id={`${field.name}-true`}
						name={field.name}
						isSelected={field.value === labelYes}
						value={labelYes}
						onChange={isChecked => {
							if (isChecked) {
								handleInputChange(
									field.name,
									field.type,
									labelYes,
								);
							}
						}}
					>
						{labelAra}
					</Radio>
					<Radio
						id={`${field.name}-false`}
						name={field.name}
						isSelected={field.value !== labelYes}
						value={labelNo}
						onChange={isChecked => {
							if (isChecked) {
								handleInputChange(
									field.name,
									field.type,
									labelNo,
								);
							}
						}}
					>
						Ei {labelAra}
					</Radio>
				</div>
			);
		} else {
			return (
				<div
					className="page-update-input"
					key={`${field.name}_${index}`}
				>
					<label htmlFor={field.name}>{field.label}</label>
					<input
						value={(field.value as string | number) || ""}
						name={field.name}
						id={field.name}
						type={field.type}
						onChange={event =>
							handleInputChange(
								field.name,
								field.type,
								event.target.value,
							)
						}
					/>
				</div>
			);
		}
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
									<span className="page-update-popup">
										{popupState === "saving"
											? updatePopupSaving
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
									isSelected={formState}
									onChange={isChecked => {
										if (isChecked) setFormState(true);
									}}
								>
									{labelTrue}
								</Radio>
								<Radio
									id="update-vacancy-false"
									name="update-vacancy-false"
									isSelected={!formState}
									onChange={isChecked => {
										if (isChecked) setFormState(false);
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
							{basicFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelContactInfo}</h3>
							{contactFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelFoodHeader}</h3>
							{foodFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelActivies}</h3>
							{activitiesFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelVisitingInfo}</h3>
							{nursingHomeContactFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelAccessibility}</h3>
							{accessibilityFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelPersonnel}</h3>
							{staffFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelOtherServices}</h3>
							{otherServicesFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
						<div className="page-update-section">
							<h3>{labelNearbyServices}</h3>
							{nearbyServicesFields.map((field, index) =>
								getInputElement(field, index),
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;
