import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageUploadReport.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome } from "./types";
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

const PageUploadReport: FC = () => {
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
		{name: "overview_outside", hasImage: false, remove: false, value: "", text:""},
		{name: "apartment", hasImage: false, remove: false, value: "", text:""},
		{name: "lounge", hasImage: false, remove: false, value: "", text:""},
		{name: "dining_room", hasImage: false, remove: false, value: "", text:""},
		{name: "outside", hasImage: false, remove: false, value: "", text:""},
		{name: "entrance", hasImage: false, remove: false, value: "", text:""},
		{name: "bathroom", hasImage: false, remove: false, value: "", text:""},
		{name: "apartment_layout", hasImage: false, remove: false, value: "", text:""},
		{name: "nursinghome_layout", hasImage: false, remove: false, value: "", text:""},
		{name: "owner_logo", hasImage: false, remove: false, value: "", text:""},
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

	const setHasImage = (id: string, state: boolean) => {
		const index = imageState.findIndex( x => x.name === id );
		imageState[index].hasImage = state;
	}

	if (!id) throw new Error("Invalid URL!");

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

	const title = useT("pageUploadReportTitle");
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
		//await requestVacancyStatusUpdate(id, key, formState, imageState);
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
						<button className="page-update-cancel" onClick={cancelEdit}>Peruuta</button>
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
						
						<h3 className="page-update-minor-title">{}</h3>
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
							
							<Radio
								id="nursinghome-status-ok"
								name="update-vacancy-true"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Kaikki kunnossa"}
							</Radio>
							<Radio
								id="nursinghome-status-small"
								name="nursinghome-status-small"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Pientä parannettavaa"}
							</Radio>
							<Radio
								id="nursinghome-status-true-significant"
								name="nursinghome-status-significant"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Merkittävästi parannettavaa"}
							</Radio>
							<Radio
								id="nursinghome-status-surveillance"
								name="nursinghome-status-surveillance"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Tehostetussa valvonnassa"}
							</Radio>
							<Radio
								id="nursinghome-status-waiting"
								name="nursinghome-status-waiting"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Odottaa käyntiä"}
							</Radio>
							<Radio
								id="nursinghome-status-no-info"
								name="nursinghome-status-no-info"
								isSelected={formState}
								onChange={isChecked => {
									if (isChecked) setFormState(true);
								}}
							>
								{"Sijaintikunta valvoo. Tietoja ei saatavilla."}
							</Radio>
							
							
							</div>
						</form>
					
					<div className="page-update-section nursinghome-logo-upload">
						<h3 className="page-update-minor-title">{}</h3>
						
					</div>

					<div className="page-update-section">
						<h3 className="page-update-minor-title">{}</h3>
						<p>{}</p>
						<div className="flex-container">
							
						</div>
					</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUploadReport;