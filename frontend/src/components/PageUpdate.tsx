import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageUpdate.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome } from "./types";

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
	value: boolean,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/vacancy-status/${key}`,
		// eslint-disable-next-line @typescript-eslint/camelcase
		{ has_vacancy: value },
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
	const intro = useT("pageUpdateIntro");
	const labelTrue = useT("vacancyTrue");
	const labelFalse = useT("vacancyFalse");
	const loadingText = useT("loadingText");

	const updatePopupSaved = "Tallennettu!";
	const updatePopupSaving = "Tallennetaan...";

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setPopupState("saving");
		await requestVacancyStatusUpdate(id, key, formState);
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
						<h1 className="page-update-title">{title}</h1>
						<p className="page-update-data">
							<strong>Hoivakodin nimi: </strong>
							{nursingHome.name}
						</p>
						<p className="page-update-data">
							<strong>Tilanne: </strong>
							{vacancyStatus
								? vacancyStatus.has_vacancy
									? labelTrue
									: labelFalse
								: loadingText}
						</p>
						<p className="page-update-data">
							<strong>Tietoa viimeksi päivitetty: </strong>
							{vacancyStatus
								? formatDate(
										vacancyStatus.vacancy_last_updated_at,
								  ) || " (ei päivitetty)"
								: loadingText}
						</p>
						<p className="page-update-intro">{intro}</p>
						<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
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
									value="Tallenna"
								/>
								{popupState && (
									<span className="page-update-popup">
										{popupState === "saving"
											? updatePopupSaving
											: updatePopupSaved}
									</span>
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
