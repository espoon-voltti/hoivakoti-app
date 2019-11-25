import React, { FC, useEffect, useState } from "react";
import { useT } from "../translations";
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
	const [isRequesting, setIsRequesting] = useState(false);

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
				})
				.catch(e => {
					console.error(e);
					throw e;
				});
		}
	}, [id, key, vacancyStatus]);

	const title = useT("pageUpdateTitle");
	const intro = useT("pageUpdateIntro");
	const labelTrue = useT("vacancyTrue");
	const labelFalse = useT("vacancyFalse");
	const loadingText = useT("loadingText");

	const handleClick = async (value: boolean): Promise<void> => {
		setIsRequesting(true);
		await requestVacancyStatusUpdate(id, key, value);
		setIsRequesting(false);
		setVacancyStatus(null);
	};

	return (
		<div className="page-update">
			<div className="page-update-content">
				{!nursingHome || !vacancyStatus || isRequesting ? (
					loadingText
				) : (
					<>
						<h1 className="page-update-title">{title}</h1>
						<p className="page-update-data">
							<strong>Hoivakodin nimi: </strong>
							{nursingHome.name}
						</p>
						<p className="page-update-data">
							<strong>Tilanne: </strong>
							{vacancyStatus.has_vacancy ? labelTrue : labelFalse}
						</p>
						{vacancyStatus.vacancy_last_updated_at && (
							<p className="page-update-data">
								<strong>Tietoa viimeksi päivitetty: </strong>
								{vacancyStatus.vacancy_last_updated_at}
							</p>
						)}
						<p className="page-update-intro">{intro}</p>
						<div className="page-update-controls">
							<Radio
								id="update-vacancy-true"
								name="update-vacancy-true"
								isSelected={vacancyStatus.has_vacancy}
								onChange={isChecked => {
									if (isChecked) handleClick(true);
								}}
							>
								{labelTrue}
							</Radio>
							<Radio
								id="update-vacancy-false"
								name="update-vacancy-false"
								isSelected={!vacancyStatus.has_vacancy}
								onChange={isChecked => {
									if (isChecked) handleClick(false);
								}}
							>
								{labelFalse}
							</Radio>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PageUpdate;
