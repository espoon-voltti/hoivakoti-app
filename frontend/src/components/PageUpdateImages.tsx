import React, { FC, useEffect, useState } from "react";
import { useParams, useHistory, Link, useLocation } from "react-router-dom";
import { useT } from "../i18n";
import axios from "axios";
import config from "../config";
import ImageUpload from "./ImageUpload";
import { NursingHome, NursingHomeImageName } from "./types";
import { GetNursingHomeResponse } from "./types";

interface NursingHomeRouteParams {
	id: string;
	key: string;
}

const requestImagesUpdate = async (
	id: string,
	key: string,
	images: object[],
): Promise<void> => {
	for (const image of images) {
		await axios.post(
			`${config.API_URL}/nursing-homes/${id}/update-image/${key}`,
			{
				image: image,
			},
		);
	}
};

const PageUpdateImages: FC = () => {
	const { id, key } = useParams<NursingHomeRouteParams>();
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [popupState, setPopupState] = useState<null | "saving" | "saved">(
		null,
	);

	if (!id || !key) throw new Error("Invalid URL!");

	const history = useHistory();
	const location = useLocation();

	const parentUpdatePage = location.pathname.substring(
		0,
		location.pathname.lastIndexOf("/"),
	);

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

	const organizationLogo = useT("organizationLogo");
	const organizationPhotos = useT("organizationPhotos");
	const organizationPhotosGuide = useT("organizationPhotosGuide");
	const btnSave = useT("btnSave");
	const cancel = useT("cancel");
	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	const loadingText = useT("loadingText");
	const linkBackToBasicInfo = useT("linkBackToBasicInfo");

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

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();

		history.push(parentUpdatePage);
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			setPopupState("saving");

			await requestImagesUpdate(id, key, imageState);

			setPopupState("saved");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="page-update">
			<div className="page-update-content">
				{!nursingHome ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<form onSubmit={handleSubmit}>
						<div className="page-update-section nursinghome-logo-upload">
							<Link
								to={{
									pathname: parentUpdatePage,
								}}
								className="nursinghome-back-link"
							>
								{linkBackToBasicInfo}
							</Link>
							<h1 className="page-update-minor-title">
								{organizationLogo}
							</h1>
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
							<h2 className="page-update-minor-title">
								{organizationPhotos}
							</h2>
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
					</form>
				)}
			</div>
		</div>
	);
};

export default PageUpdateImages;
