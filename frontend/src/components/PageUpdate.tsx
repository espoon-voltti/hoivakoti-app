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
	const hh = String(date.getUTCHours()).padStart(2, "0");
	const mm = String(date.getUTCMinutes()).padStart(2, "0");
	return `${YYYY}-${MM}-${DD} (${hh}:${mm} UTC)`;
};

const requestVacancyStatusUpdate = async (
	id: string,
	key: string,
	status: boolean,
	owner_logo: any,
	images:any,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{ has_vacancy: status, 
			owner_logo: owner_logo, 
			images: images
		}
	);
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
	const [picState, setPicState] = useState<any[]>([
		{name: "overview_outside", value: ""},
		{name: "apartment", value: ""},
		{name: "lounge", value: ""},
		{name: "dining_room", value: ""},
		{name: "outside", value: ""},
		{name: "entrance", value: ""},
		{name: "bathroom", value: ""},
		{name: "apartment_layout", value: ""},
		{name: "nursinghome_layout",value: ""}]
	);

	let ownerLogo = "";
	const imageState = [
		{name: "overview_outside", hasImage: false, value: "", text:""},
		{name: "apartment", hasImage: false, value: "", text:""},
		{name: "lounge", hasImage: false, value: "", text:""},
		{name: "dining_room", hasImage: false, value: "", text:""},
		{name: "outside", hasImage: false, value: "", text:""},
		{name: "entrance", hasImage: false, value: "", text:""},
		{name: "bathroom", hasImage: false, value: "", text:""},
		{name: "apartment_layout", hasImage: false, value: "", text:""},
		{name: "nursinghome_layout", hasImage: false, value: "", text:""},
	];

	const updateImageState = (id: string, state: string) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].value = state;
		const current = picState;
		current[index].value = state;
		setPicState(current);
	}

	const updateCaptionState = (id: string, state: string) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].text = state;
	}

	const setHasImage = (id: string, state: boolean) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].hasImage = state;
	}

	/*const uploadMultipleFiles = (files: string[]) => {
		let imageNumber = 0;
		console.log(files.length);
		picState.map((image: any, idx: number) => {
			if(image.value != "" && imageNumber < files.length){
				updateImageState(image.name, files[imageNumber])
				imageNumber++;
			}
		});
	}*/


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
		axios
			.get(`${config.API_URL}/nursing-homes/${id}/pics/captions`)
			.then((response: { data: Record<string, string> }) => {
				setPicCaptions(response.data);
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
		await requestVacancyStatusUpdate(id, key, formState, ownerLogo, imageState);
		setPopupState("saved");
		setVacancyStatus(null);
	};

	return (
		<div className="page-update">
			<div className="page-update-content">
				{!nursingHome ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
					<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
					<div className="page-update-section">
						<h1 className="page-update-title">{title}</h1>
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
							<div>
								<input
									type="submit"
									className="page-update-submit"
									value={btnSave}
								/>
								{popupState && (
									<span className="page-update-popup">
										{popupState === "saving"
											? updatePopupSaving
											: updatePopupSaved}
									</span>
								)}
							</div>
							</div>
						</form>
					
					<div className="page-update-section">

							<ImageUpload
								nursingHome={nursingHome}
								imageName={"owner_logo" as NursingHomeImageName}
								textAreaClass="textarea-hidden"
								onChange={
									file => { ownerLogo = file; }
								}
							/>
					</div>

					<div className="page-update-section">
						
						<div className="flex-container">
							{nursinghomeImageTypes.map((imageType, idx) => (
								<ImageUpload
									nursingHome={nursingHome}
									imageName={imageType as NursingHomeImageName}
									image={picState[picState.findIndex( x => x.name === imageType )].value}
									caption={picCaptions ? picCaptions[imageType + "_caption"] : ""} 
									textAreaClass="nursinghome-upload-caption"
									onChange={
										file => { updateImageState(imageType, file); }
									}
									onCaptionChange={
										text => { 
											updateCaptionState(imageType, text); }
									}
									setImageStatus={
										status => {
											setHasImage(imageType, status); }
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
	image?: string;
	caption?: string;
	textAreaClass: string;
	onClick?: () => void;
	onChange: (file: any) => void;
	onCaptionChange?: (text: string) => void;
	setImageStatus?: (status: boolean) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({
	nursingHome,
	imageName,
	image,
	caption,
	textAreaClass,
	onClick,
	onChange,
	onCaptionChange,
	setImageStatus
}) => {

	let hasImage = true;
	const imageUploadTooltip = "Valiste kuva";

	let imageStateStr = "";

	if (!image){
		if (!imageName || !nursingHome || !nursingHome.pic_digests) hasImage = false;
		let digest: string = "";
		if (hasImage && nursingHome) {
			digest = (nursingHome.pic_digests as any)[
				`${imageName}_hash`
			];
		}
		if (!digest) hasImage = false;
	
		if(hasImage && nursingHome) {
			imageStateStr = `${config.API_URL}/nursing-homes/${nursingHome.id}/pics/${imageName}/${digest}`
		}
	}else{
		imageStateStr = image;
	}

	if (setImageStatus )setImageStatus(hasImage);

	const [srcUrl, setImage] = useState(imageStateStr);
	const [captionState, setCaptionState] = useState(caption);

	if (captionState && onCaptionChange) onCaptionChange(captionState);

	const handleImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		): void => {
		let file = new Blob;
		if (event.target.files) { file = event.target.files[0]; }

		const reader = new FileReader();
		reader.onloadend = e => {
			setImage(reader.result as string);
		}
		reader.readAsDataURL(file);

		const readerBinary = new FileReader();
		readerBinary.onloadend = e => {
			onChange(readerBinary.result);
		}
		readerBinary.readAsDataURL(file);
	};

	const handleCaptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		): void => {
			setCaptionState(event.target.value);
	};

	if (!hasImage)
		return (
			<div className="nursinghome-upload-container">
				<div className="nursinghome-upload-img nursinghome-upload-placeholder" onClick={onClick}>
					<div
						className="nursinghome-upload-img-inner"
						style={{
							backgroundImage: `url()`,
						}}
					/>
					<input type="file" title={imageUploadTooltip} onChange={handleImageChange}/>
				</div>
				<textarea className={textAreaClass} value={captionState} name={imageName as string + "_caption"} onChange={handleCaptionChange}></textarea>
			</div>
		);
	else
		return (
			<div className="nursinghome-upload-container">
				<div className="nursinghome-upload-img" onClick={onClick}>
					<div
						className="nursinghome-upload-img-inner"
						style={{
							backgroundImage: `url(${srcUrl})`,
						}}
					/>
					<input type="file" title={imageUploadTooltip} onChange={handleImageChange}/>
				</div>
				<textarea className={textAreaClass} value={captionState} name={imageName as string + "_caption"} onChange={handleCaptionChange}></textarea>
			</div>
		);
};


interface MultiImageUploadProps {
	onChange: (files: any) => void;
}

export const MultiImageUpload: FC<MultiImageUploadProps> = ({
	onChange
}) => {

	let hasImage = true;
	const imageUploadTooltip = "Valiste kuvia";

	const readFiles = async (files: any): Promise<string[]> => {
		let filesStr: string[] = [];
		for (let i = 0; i < files.length; i++) {
			let file = new Blob;
			file = files[0];

			const reader = new FileReader();
			reader.onloadend = e => {
				filesStr.push(reader.result as string);
			}
			reader.readAsDataURL(file);
		}
		return filesStr;
	};


	const handleImageChange = async(
		event: React.ChangeEvent<HTMLInputElement>,
		): Promise<void> => {
		
		if (event.target.files){
			const files = await readFiles(event.target.files);
			console.log(files.length);
			onChange(files);
		}
	};

	return (
		<div className="nursinghome-multi-upload-container">
			<div className="nursinghome-multi-upload-img nursinghome-upload-placeholder" >
				<div
					className="nursinghome-upload-img-inner"
					style={{
						backgroundImage: `url()`,
					}}
				/>
				<input type="file" title={imageUploadTooltip} onChange={handleImageChange} multiple/>
			</div>
		</div>
	);
};