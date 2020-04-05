import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageSurvey.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
import { stringify } from "querystring";

const formatDate = (dateString: string | null): string => {
	if (!dateString) return "";
	const date = new Date(dateString);
	const YYYY = String(date.getUTCFullYear());
	const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
	const DD = String(date.getUTCDate()).padStart(2, "0");
	const hh = String(date.getUTCHours()).padStart(2, "0");
	const mm = String(date.getUTCMinutes()).padStart(2, "0");
	return `${YYYY}-${MM}-${DD} (${hh}:${mm} UTC)`;
};

const requestVacancyStatusUpdate = async (
	id: string,
	key: string,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{ 
		}
	);
};

const PageSurvey: FC = () => {
	const { id, key } = useParams();
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);


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


	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		await requestVacancyStatusUpdate(id, key);
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
						<button className="page-update-cancel" onClick={cancelEdit}>Peruuta</button>
						<button type="submit" className="btn">{btnSave}</button>

						)}
					</div>
					<div className="page-update-section">
						
						<h3 className="page-update-minor-title">{freeApartmentsStatus}</h3>
						<p className="page-update-data">
							<strong>{nursingHomeName}: </strong>
							{nursingHome.name}
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
					
					</>
				)}
			</div>
		</div>
	);
};

export default PageSurvey;

interface ImageUploadProps {
	nursingHome: NursingHome | null;
	imageName: NursingHomeImageName | null | undefined;
	useButton: boolean;
	textAreaClass: string;
	onRemove?: () => void;
	onChange: (file: any) => void;
	onCaptionChange?: (text: string) => void;
	setImageStatus: (status: boolean) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({
	nursingHome,
	imageName,
	useButton,
	textAreaClass,
	onRemove,
	onChange,
	onCaptionChange,
	setImageStatus
}) => {

	const organizationLogoBtn = useT("organizationLogoBtn");
	const uploadPlaceholder = useT("uploadPlaceholder");

	let hasImage = true;
	const imageUploadTooltip = "Valiste kuva";

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

	if (setImageStatus) setImageStatus(hasImage);
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

			const reader = new FileReader();
			reader.onloadend = e => {
				onChange(reader.result);
				setImage(reader.result as string);
			}
			reader.readAsDataURL(file);
		}
	};

	const handleCaptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		): void => {
			setCaptionState(event.target.value);
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
						<div className="nursinghome-upload-img-inner-text">Tyhjä kuvapaikka</div>
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
								<div className="nursinghome-upload-img-change-text">Vaihda kuva</div>
								<input type="file"  title={imageUploadTooltip} onChange={handleImageChange}/>
							</div>
							<div className={useButton ? "nursinghome-upload-button-remove" : "nursinghome-upload-hidden-remove"} onClick={handleRemove}>
								<div className="nursinghome-upload-img-remove-text">Poista</div>
							</div>
						</div>
					</div>
					<button type="submit" className={useButton ? "btn" : "upload-button-hidden"}>{organizationLogoBtn}</button>
				</div>
				<textarea className={textAreaClass} value={captionState} name={imageName as string + "_caption"} placeholder={uploadPlaceholder} onChange={handleCaptionChange}></textarea>
			</div>
		);
};