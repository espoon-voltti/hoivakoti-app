import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import i18n from "../i18n";
import "../styles/PageSurveyResults.scss";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./types";
import { NursingHome } from "./types";

const PageSurveyResults: FC = () => {
	const { id } = useParams() as any;
	const [relativeSurvey, setRelativeSurvey] = useState<any[] | null>(null);
	const [textResults, setTextResults] = useState<any[] | null>(null);
	const [customerSurvey, setCustomerSurvey] = useState<any[] | null>(null);
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);

	if (!id) throw new Error("Invalid URL!");

	useEffect(() => {
		axios
			.get(`${config.API_URL}/survey/${id}/results/asiakaskysely`)
			.then((response: { data: any[] }) => {
				setCustomerSurvey(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});

		axios
			.get(`${config.API_URL}/survey/${id}/results/omaiskysely`)
			.then((response: { data: any[] }) => {
				setRelativeSurvey(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});

		axios
			.get(`${config.API_URL}/survey/${id}/text-results/omaiskysely`)
			.then((response: { data: any[] }) => {
				setTextResults(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

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

	const loadingText = useT("loadingText");
	const nursingHomeReviews = useT("nursingHomeReviews");
	const linkBackToBasicInfo = useT("linkBackToBasicInfo");
	const relativeReviewsBy = useT("relativeReviewsBy");
	const customerReviewsBy = useT("customerReviewsBy");
	const nReviews = useT("nReviews");
	const averageReviewScore = useT("averageReviewScore");
	const reviewFooterHeader = useT("reviewFooterHeader");
	const reviewFooterPart1 = useT("reviewFooterPart1");
	const reviewFooterPart2 = useT("reviewFooterPart2");
	const reviewFooterPart3 = useT("reviewFooterPart3");
	const reviewFooterPart4 = useT("reviewFooterPart4");
	const reviewFooterLink = useT("reviewFooterLink");
	const urlReviewFooterLink = useT("urlReviewFooterLink");

	const optionText1 = useT("surveyOption1");
	const optionText2 = useT("surveyOption2");
	const optionText3 = useT("surveyOption3");
	const optionText4 = useT("surveyOption4");
	const optionText5 = useT("surveyOption5");

	const ratingToString = (rating: number | null): string => {
		let str = "-";

		if (rating) {
			if (rating > 4.5) {
				str = optionText5;
			} else if (rating > 3.5) {
				str = optionText4;
			} else if (rating > 2.5) {
				str = optionText3;
			} else if (rating > 1.5) {
				str = optionText2;
			} else if (rating > 0.5) {
				str = optionText1;
			}
		}

		return str;
	};

	const questions = (survey: any): JSX.Element[] | null =>
		survey &&
		survey.map((question: any, index: number) => (
			<div key={index}>
				<div className={"page-survey-results-result"}>
					<div className="page-survey-results-result-question">
						{i18n.language == "sv-FI"
							? question.question_sv
							: question.question_fi}
					</div>
					<div className="page-survey-results-result-score">
						<div
							className={`page-survey-results-result-image${
								question.average > 0.5
									? " star-full"
									: " star-none"
							}`}
						></div>
						<div
							className={`page-survey-results-result-image${
								question.average > 1.75
									? " star-full"
									: question.average > 1.25
									? " star-half"
									: " star-none"
							}`}
						></div>
						<div
							className={`page-survey-results-result-image${
								question.average > 2.75
									? " star-full"
									: question.average > 2.25
									? " star-half"
									: " star-none"
							}`}
						></div>
						<div
							className={`page-survey-results-result-image${
								question.average > 3.75
									? " star-full"
									: question.average > 3.25
									? " star-half"
									: " star-none"
							}`}
						></div>
						<div
							className={`page-survey-results-result-image${
								question.average > 4.75
									? " star-full"
									: question.average > 4.25
									? " star-half"
									: " star-none"
							}`}
						></div>
					</div>
				</div>
			</div>
		));

	const answers = (answers: any): JSX.Element[] | null =>
		answers &&
		answers.map((answer: any, index: number) => (
			<p className="answer" key={index}>
				&quot;{answer.answer_text}&quot;
			</p>
		));

	return (
		<div className="page-survey-results">
			<div>
				{!relativeSurvey || !customerSurvey || !nursingHome ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
						<Link
							to={`/hoivakodit/${nursingHome.id}`}
							className="nursinghome-back-link"
						>
							{linkBackToBasicInfo}
						</Link>
						<h2>{nursingHomeReviews}</h2>
						<p>
							{nursingHome.name} - {nursingHome.address},{" "}
							{nursingHome.city}
						</p>
						<div className="page-survey-results-set">
							<h3 className="page-survey-results-title">
								{customerReviewsBy}
							</h3>
							<p className="page-survey-results-minor-title">
								{nursingHome.rating.answers_customers
									? nursingHome.rating.answers_customers
									: "0"}{" "}
								{nReviews}
							</p>
							<div className="page-survey-results-item">
								{questions(customerSurvey)}
							</div>
							<p className="page-survey-results-minor-title">
								{averageReviewScore}:
								<span className="page-survey-results-bold">
									{" "}
									{ratingToString(
										nursingHome.rating.average_customers,
									)}
								</span>{" "}
								{nursingHome.rating &&
								nursingHome.rating.average_customers
									? nursingHome.rating.average_customers.toPrecision(
											2,
									  )
									: ""}{" "}
								/ 5
							</p>
						</div>
						<div className="page-survey-results-set">
							<h3 className="page-survey-results-title">
								{relativeReviewsBy}
							</h3>
							<p className="page-survey-results-minor-title">
								{nursingHome.rating.answers_relatives
									? nursingHome.rating.answers_relatives
									: "0"}{" "}
								{nReviews}
							</p>
							<div className="page-survey-results-item">
								{questions(relativeSurvey)}
							</div>
							<p className="page-survey-results-minor-title">
								{averageReviewScore}:
								<span className="page-survey-results-bold">
									{" "}
									{ratingToString(
										nursingHome.rating.average_relatives,
									)}
								</span>{" "}
								{nursingHome.rating &&
								nursingHome.rating.average_relatives
									? nursingHome.rating.average_relatives.toPrecision(
											2,
									  )
									: ""}{" "}
								/ 5
							</p>
							<div className="page-survey-results-answer-container">
								<div className="page-survey-results-answer-header">
									Omaisilta
								</div>
								<div className="page-survey-results-answer-content">
									{answers(textResults)}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			<div className="page-survey-results-footer">
				<p className="page-survey-results-bold">{reviewFooterHeader}</p>
				<p>{reviewFooterPart1}</p>
				<p>{reviewFooterPart2}</p>
				<p>{reviewFooterPart3}</p>
				<p>
					{reviewFooterPart4}{" "}
					<a
						href={urlReviewFooterLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{reviewFooterLink}
					</a>
				</p>
			</div>
		</div>
	);
};

export default PageSurveyResults;
