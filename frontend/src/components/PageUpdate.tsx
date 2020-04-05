import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageUpdate.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
import { stringify } from "querystring";

interface VacancyStatus {
	has_vacancy: boolean;
	vacancy_last_updated_at: string | null;
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
	images:any,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{ 
			has_vacancy: status
		}
	);

	for (const image of images) {
		await axios.post(
			`${config.API_URL}/nursing-homes/${id}/update-image/${key}`,
			// eslint-disable-next-line @typescript-eslint/camelcase
			{ 
				image: image
			}
		)
	}
};

const PageUpdate: FC = () => {
	const { id, key } = useParams();
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [vacancyStatus, setVacancyStatus] = useState<VacancyStatus | null>(
		null,
	);
	const [popupState, setPopupState] = useState<null | "saving" | "saved">(
		null,
	);
	const [formState, setFormState] = useState<boolean>(false);
	const [picCaptions, setPicCaptions] = useState<Record <string, string> | null>(null);

	const imageState = [
		{name: "overview_outside", remove: false, value: "", text:""},
		{name: "apartment", remove: false, value: "", text:""},
		{name: "lounge", remove: false, value: "", text:""},
		{name: "dining_room", remove: false, value: "", text:""},
		{name: "outside", remove: false, value: "", text:""},
		{name: "entrance", remove: false, value: "", text:""},
		{name: "bathroom", remove: false, value: "", text:""},
		{name: "apartment_layout", remove: false, value: "", text:""},
		{name: "nursinghome_layout", remove: false, value: "", text:""},
		{name: "owner_logo", remove: false, value: "", text:""},
	];

	const removeImage = (id: string) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].remove = true;
		imageState[index].value = "";
	}

	const updateImageState = (id: string, state: string) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].value = state;
		imageState[index].remove = false;
	}

	const updateCaptionState = (id: string, state: string) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].text = state;
	}

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


	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	
	const nursinghomeImageTypes = [	"overview_outside",
									"apartment",
									"lounge",
									"dining_room",
									"outside",
									"entrance",
									"bathroom",
									"apartment_layout",
									"nursinghome_layout"];

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setPopupState("saving");
		await requestVacancyStatusUpdate(id, key, formState, imageState);
		setPopupState("saved");
		setVacancyStatus(null);
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>):void => {
		e.preventDefault();
		window.location.href = window.location.pathname + "/peruuta";
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
					<button className="page-update-cancel" onClick={cancelEdit}>{cancel}</button>
						<button type="submit" className="btn">{btnSave}</button>

						{popupState && (
							<span className="page-update-popup">
								{popupState === "saving"
									? updatePopupSaving
									: updatePopupSaved}
							</span>
						)}
					</div>
					<div className="page-update-section">
						
						<h3 className="page-update-minor-title">{freeApartmentsStatus}</h3>
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
						<h3 className="page-update-minor-title">{organizationLogo}</h3>
						<ImageUpload
							nursingHome={nursingHome}
							imageName={"owner_logo" as NursingHomeImageName}
							useButton={true}
							textAreaClass="textarea-hidden"
							onRemove={
								() => { removeImage("owner_logo")}
							}
							onChange={
								file => { updateImageState("owner_logo", file); }
							}
						/>
					</div>

					<div className="page-update-section">
						<h3 className="page-update-minor-title">{organizationPhotos}</h3>
						<p>{organizationPhotosGuide}</p>
						<div className="flex-container">
							{nursinghomeImageTypes.map((imageType, idx) => (
								<ImageUpload
									nursingHome={nursingHome}
									imageName={imageType as NursingHomeImageName}
									useButton={false}
									textAreaClass="nursinghome-upload-caption"
									onRemove={
										() => { removeImage(imageType)}
									}
									onChange={
										file => { updateImageState(imageType, file); }
									}
									onCaptionChange={
										text => { 
											updateCaptionState(imageType, text); }
									}
								/>
							))}
						</div>
					</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;

interface ImageUploadProps {
	nursingHome: NursingHome | null;
	imageName: NursingHomeImageName | null | undefined;
	useButton: boolean;
	textAreaClass: string;
	onRemove?: () => void;
	onChange: (file: any) => void;
	onCaptionChange?: (text: string) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({
	nursingHome,
	imageName,
	useButton,
	textAreaClass,
	onRemove,
	onChange,
	onCaptionChange
}) => {

	const organizationLogoBtn = useT("organizationLogoBtn");
	const uploadPlaceholder = useT("uploadPlaceholder");
	const imageSizeWarning = useT("warningImageToLarge");
	const emptyImageSpot = useT("emptyImageSpot");
	const imageUploadTooltip = useT("imageUploadTooltip");
	const swapImage = useT("swapImage");
	const remove = useT("remove");

	let hasImage = true;
	let imageStateStr = "";

	if (!imageName || !nursingHome || !nursingHome.pic_digests) hasImage = false;
	let digest: string = "";
	let caption: string = "";
	if (hasImage && nursingHome) {
		digest = (nursingHome.pic_digests as any)[
			`${imageName}_hash`
		];
		caption = (nursingHome.pic_captions as any)[
			`${imageName}_caption`
		];
	}
	if (!digest) hasImage = false;

	if(hasImage && nursingHome) {
		imageStateStr = `${config.API_URL}/nursing-homes/${nursingHome.id}/pics/${imageName}/${digest}`
	}

	if (imageStateStr) hasImage = true;

	const [srcUrl, setImage] = useState(imageStateStr);

	const [captionState, setCaptionState] = useState(caption);

	if (captionState && onCaptionChange) onCaptionChange(captionState);

	const handleImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		): void => {
		let file = new Blob;

		if (event.target.files && event.target.files.length > 0) { 
			file = event.target.files[0]; 

			if(file.size < 4200000){
				const reader = new FileReader();
				reader.onloadend = e => {
					onChange(reader.result);
					setImage(reader.result as string);
				}
				reader.readAsDataURL(file);
			}else{
				alert(imageSizeWarning);
			}
		}
	};

	const handleCaptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		): void => {
			if (onCaptionChange && event.target.value.length < 201){
				onCaptionChange(event.target.value);
				setCaptionState(event.target.value);
			}
	};

	const handleRemove= (
		event: React.MouseEvent <HTMLDivElement, MouseEvent>,
		): void => {
			if(onRemove) onRemove();
			setImage("");
	};
	
	if (!srcUrl)
		return (
			<div className="nursinghome-upload-container">
				<div className="nursinghome-upload-img nursinghome-upload-placeholder">
					<div className="nursinghome-upload-img-inner">
						<div className="nursinghome-upload-img-inner-text">{emptyImageSpot}</div>
						<input type="file" className={useButton ? "input-button" : "input-hidden"} title={imageUploadTooltip} onChange={handleImageChange}/>
					</div>
					<button type="submit" className={useButton ? "btn" : "upload-button-hidden"}>{organizationLogoBtn}</button>
				</div>
				<textarea className={textAreaClass} value={captionState} name={imageName as string + "_caption"} placeholder={uploadPlaceholder} onChange={handleCaptionChange}></textarea>
			</div>
		);
	else
		return (
			<div className={"nursinghome-upload-container " + (useButton ? "input-button-layout" : "input-hidden-layout")}>
				<div className="nursinghome-upload-img">
					<div
						className="nursinghome-upload-img-inner"
						style={{
							backgroundImage: `url(${srcUrl})`,
						}}
					>
						<div className="nursinghome-upload-img-hover">
							<div className={useButton ? "input-button" : "input-hidden"}>
								<div className="nursinghome-upload-img-change-text">{swapImage}</div>
								<input type="file"  title={imageUploadTooltip} onChange={handleImageChange}/>
							</div>
							<div className={useButton ? "nursinghome-upload-button-remove" : "nursinghome-upload-hidden-remove"} onClick={handleRemove}>
								<div className="nursinghome-upload-img-remove-text">{remove}</div>
							</div>
						</div>
					</div>
					<button type="submit" className={useButton ? "btn" : "upload-button-hidden"}>{organizationLogoBtn}</button>
				</div>
				<textarea className={textAreaClass} value={captionState} name={imageName as string + "_caption"} placeholder={uploadPlaceholder} onChange={handleCaptionChange}></textarea>
			</div>
		);
};