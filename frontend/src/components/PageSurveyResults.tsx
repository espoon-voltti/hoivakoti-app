import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageSurveyResults.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
import { stringify } from "querystring";


let surveyState: any[] = [];

const PageSurveyResults: FC = () => {
	const { id } = useParams();
	const [survey, setSurvey] = useState<any[] | null>(null);
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);

	if (!id) throw new Error("Invalid URL!");

	useEffect(() => {
		axios
			.get(`${config.API_URL}/survey/${id}/results/omaiskysely`)
			.then((response: { data: any[] }) => {
				surveyState = response.data;
				setSurvey(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, []);

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

	const questions: JSX.Element[] | null =
		survey &&
		survey.map((question: any, index: number) => (
			<div card-key={index}>
				<div className={`page-survey-results-result`}>
					<div className="page-survey-results-result-question">{question.question}</div>
					<div className="page-survey-results-result-score">
						<div className="page-survey-results-result-value">{question.average}</div>
						<div className={`page-survey-results-result-image${question.average > 0.5 ? " star-full" : " star-none"}`}></div>
						<div className={`page-survey-results-result-image${question.average > 1.75 ? " star-full" : (question.average > 1.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 2.75 ? " star-full" : (question.average > 2.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 3.75 ? " star-full" : (question.average > 3.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 4.75 ? " star-full" : (question.average > 4.25 ? " star-half" : " star-none")}`}></div>
						<div className="progress-background"></div>
					</div>
				</div>
			</div>
		));

	return (
		<div className="page-survey-results">
			<a className="nursinghome-back-link" href="./">Palaa perustietoihin</a>
			<div className="">
				{!survey || !nursingHome ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
					<h2>Arvostelut</h2>
					<p>{nursingHome.name} - {nursingHome.address}, {nursingHome.city}</p>

					<h3 className="page-survey-results-title">Omaisten antamat arvostelut</h3>
					<p className="page-survey-results-bold page-survey-results-minor-title">{nursingHome.rating.answers} arvostelua</p>
					<div className="page-survey-results-container">
						{questions}
					</div>
					<p className="page-survey-results-minor-title"><span className="page-survey-results-bold">Arvostelujen keskiarvo:</span> {nursingHome.rating.average}</p>
					</>
				)}
			</div>
			<div className="page-survey-results-footer">
				<p className="page-survey-results-bold">Miten tyytyväisyystietoja kerätään?</p>
				<p>Asiakkaat ja omaiset voivat arvioida hoivakodin palvelua. 
					Arvioinnit tehdään anonyymisti. 
					Espoon kaupunki kerää asiakaspalautteen hoivakodeissa sähköisenä kyselynä. 
					Asiakas ja omainen voivat antaa palautteen itsenäisesti hoivakotiportaalissa. 
					Palautteen antamiseen tarvitaan Nestorin antama salasana.</p>
				<p>Espoon kaupungilla on myös muita palautekanavia</p>
			</div>
		</div>
	);
};

export default PageSurveyResults;