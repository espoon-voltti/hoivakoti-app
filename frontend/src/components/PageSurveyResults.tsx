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

	const ratingToString = (rating: number | null): string => {
		let str = "-";

		if (rating){
			if (rating > 4.5){
				str = "Erinomainen";
			} else if (rating > 3.5){
				str = "Hyvä";
			} else if (rating > 2.5){
				str = "Tyydyttävä";
			} else if (rating > 1.5){
				str = "Huono";
			} else if (rating > 0.5){
				str = "Erittäin huono";
			}
		}

		return str;
	};

	const questions: JSX.Element[] | null =
		survey &&
		survey.map((question: any, index: number) => (
			<div card-key={index}>
				<div className={`page-survey-results-result`}>
					<div className="page-survey-results-result-question">{question.question}</div>
					<div className="page-survey-results-result-score">
						<div className={`page-survey-results-result-image${question.average > 0.5 ? " star-full" : " star-none"}`}></div>
						<div className={`page-survey-results-result-image${question.average > 1.75 ? " star-full" : (question.average > 1.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 2.75 ? " star-full" : (question.average > 2.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 3.75 ? " star-full" : (question.average > 3.25 ? " star-half" : " star-none")}`}></div>
						<div className={`page-survey-results-result-image${question.average > 4.75 ? " star-full" : (question.average > 4.25 ? " star-half" : " star-none")}`}></div>
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
					<h2>Arviot hoivakodista</h2>
					<p>{nursingHome.name} - {nursingHome.address}, {nursingHome.city}</p>

					<h3 className="page-survey-results-title">Omaisten antamat arviot</h3>
					<p className="page-survey-results-minor-title">{nursingHome.rating.answers} arviota</p>
					<div className="page-survey-results-container">
						{questions}
					</div>
					<p className="page-survey-results-minor-title">Arvioiden keskiarvo:<span className="page-survey-results-bold"> {ratingToString(nursingHome.rating.average)}</span> {nursingHome.rating && nursingHome.rating.average ? nursingHome.rating.average.toPrecision(2) : "-"} / 5</p>
					</>
				)}
			</div>
			<div className="page-survey-results-footer">
				<p className="page-survey-results-bold">Miten arviointeja kerätään?</p>
				<p>Omainen voi tehdä arvioinnin Espoon kaupungin antamalla koodilla. 
					Portaaliin ei tallenneta arvioinnin tekijän henkilötietoja.
					Arvio tehdään valitsemalla tyytyväisyyttä kuvaava numeroarvo.</p>
				<p>1=erittäin huono, 2=huono, 3=tyydyttävä, 4=hyvä, 5=erinomainen</p>
				<p>Vapaan palautteen mahdollisuus sekä asiakkaiden antamat arviot on tarkoitus lisätä tähän portaaliin myöhemmin.</p>
				<p>Asiakas ja/tai omainen voi antaa palautetta hoivakodin toiminnasta (esimerkiksi yksittäisistä tilanteista) <a href="https://easiointi.espoo.fi/eFeedback/fi/Feedback/21-Senioripalvelut" target="_blank">Espoon kaupungin palautepalvelun kautta.</a></p>
			</div>
		</div>
	);
};

export default PageSurveyResults;