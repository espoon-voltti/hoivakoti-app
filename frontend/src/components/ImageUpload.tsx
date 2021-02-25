import React, { useState } from "react";
import { useT } from "../i18n";
import config from "../config";
import { NursingHome, NursingHomeImageName } from "./types";

import "../styles/ImageUpload.scss";

interface ImageUploadProps {
	nursingHome: NursingHome | null;
	imageName: NursingHomeImageName | null | undefined;
	useButton: boolean;
	textAreaClass: string;
	onRemove?: () => void;
	onChange: (file: any) => void;
	onCaptionChange?: (text: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	nursingHome,
	imageName,
	useButton,
	textAreaClass,
	onRemove,
	onChange,
	onCaptionChange,
}) => {
	let hasImage = true;
	let imageStateStr = "";

	if (!imageName || !nursingHome || !nursingHome.pic_digests)
		hasImage = false;

	let digest = "";
	let caption = "";

	if (hasImage && nursingHome) {
		digest = (nursingHome.pic_digests as any)[`${imageName}_hash`];
		caption = (nursingHome.pic_captions as any)[`${imageName}_caption`];
	}
	if (!digest) hasImage = false;

	if (hasImage && nursingHome) {
		imageStateStr = `${config.API_URL}/nursing-homes/${nursingHome.id}/pics/${imageName}/${digest}`;
	}

	if (imageStateStr) hasImage = true;

	const [srcUrl, setImage] = useState(imageStateStr);

	const [captionState, setCaptionState] = useState(caption);

	if (captionState && onCaptionChange) onCaptionChange(captionState);

	const organizationLogoBtn = useT("organizationLogoBtn");
	const uploadPlaceholder = useT("uploadPlaceholder");
	const imageSizeWarning = useT("warningImageToLarge");
	const emptyImageSpot = useT("emptyImageSpot");
	const imageUploadTooltip = useT("imageUploadTooltip");
	const swapImage = useT("swapImage");
	const remove = useT("remove");

	const handleImageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		let file = new Blob();

		if (event.target.files && event.target.files.length > 0) {
			file = event.target.files[0];

			if (file.size < 4200000) {
				const reader = new FileReader();
				reader.onloadend = e => {
					onChange(reader.result);
					setImage(reader.result as string);
				};
				reader.readAsDataURL(file);
			} else {
				alert(imageSizeWarning);
			}
		}
	};

	const handleCaptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		if (onCaptionChange && event.target.value.length < 201) {
			onCaptionChange(event.target.value);
			setCaptionState(event.target.value);
		}
	};

	const handleRemove = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
	): void => {
		if (onRemove) onRemove();
		setImage("");
	};

	if (!srcUrl)
		return (
			<div className="nursinghome-upload-container">
				<div className="nursinghome-upload-img nursinghome-upload-placeholder">
					<div className="nursinghome-upload-img-inner">
						<div className="nursinghome-upload-img-inner-text">
							{emptyImageSpot}
						</div>
						<input
							type="file"
							className={
								useButton ? "input-button" : "input-hidden"
							}
							title={imageUploadTooltip}
							onChange={handleImageChange}
						/>
					</div>
					<button
						type="submit"
						className={useButton ? "btn" : "upload-button-hidden"}
					>
						{organizationLogoBtn}
					</button>
				</div>
				<textarea
					className={textAreaClass}
					value={captionState}
					name={(imageName as string) + "_caption"}
					placeholder={uploadPlaceholder}
					onChange={handleCaptionChange}
				></textarea>
			</div>
		);
	else
		return (
			<div
				className={
					"nursinghome-upload-container " +
					(useButton ? "input-button-layout" : "input-hidden-layout")
				}
			>
				<div className="nursinghome-upload-img">
					<div
						className="nursinghome-upload-img-inner"
						style={{
							backgroundImage: `url(${srcUrl})`,
						}}
					>
						<div className="nursinghome-upload-img-hover">
							<div
								className={
									useButton ? "input-button" : "input-hidden"
								}
							>
								<div className="nursinghome-upload-img-change-text">
									{swapImage}
								</div>
								<input
									type="file"
									title={imageUploadTooltip}
									onChange={handleImageChange}
								/>
							</div>
							<div
								className={
									useButton
										? "nursinghome-upload-button-remove"
										: "nursinghome-upload-hidden-remove"
								}
								onClick={handleRemove}
							>
								<div className="nursinghome-upload-img-remove-text">
									{remove}
								</div>
							</div>
						</div>
					</div>
					<button
						type="submit"
						className={useButton ? "btn" : "upload-button-hidden"}
					>
						{organizationLogoBtn}
					</button>
				</div>
				<textarea
					className={textAreaClass}
					value={captionState}
					name={(imageName as string) + "_caption"}
					placeholder={uploadPlaceholder}
					onChange={handleCaptionChange}
				></textarea>
			</div>
		);
};

export default ImageUpload;
