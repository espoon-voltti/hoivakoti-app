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

	const formatDate = (dateStr: string | null): string => {
		if (!dateStr) return "";
		console.log(dateStr);
		const date = new Date(dateStr);
		const YYYY = String(date.getUTCFullYear());
		const MM = String(date.getUTCMonth() + 1);
		const DD = String(date.getUTCDate());
		return `${DD}.${MM}.${YYYY}`;
	};

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
				console.log(response.data);

				setRelativeSurvey(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});

		axios
			.get(`${config.API_URL}/survey/${id}/approved-results/omaiskysely`)
			.then((response: { data: any[] }) => setTextResults(response.data))
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
	const fromRelatives = useT("fromRelatives");
	const nReviews = useT("nReviews");
	const averageReviewScore = useT("averageReviewScore");
	const reviewFooterHeader = useT("reviewFooterHeader");
	const reviewFooterPart1 = useT("reviewFooterPart1");
	const reviewFooterPart2 = useT("reviewFooterPart2");
	const reviewFooterPart4 = useT("reviewFooterPart4");

	const noRelativesOpenTextAnswers = useT("noRelativesOpenTextAnswers");
	const feedbackResponseHeader = useT("feedbackResponseHeader");

	const optionText1 = useT("surveyOption1");
	const optionText2 = useT("surveyOption2");
	const optionText3 = useT("surveyOption3");
	const optionText4 = useT("surveyOption4");
	const optionText5 = useT("surveyOption5");

	const espoo = useT("espoo");
	const kirkkonummi = useT("kirkkonummi");
	const kauniainen = useT("kauniainen");
	const lohja = useT("lohja");
	const raasepori = useT("raasepori");
	const hanko = useT("hanko");
	const karviainen = useT("karviainen");
	const inkoo = useT("inkoo");
	const siuntio = useT("siuntio");

	const espooFeedbackLink = useT("espooFeedbackLink");
	const kirkkonummiFeedbackLink = useT("kirkkonummiFeedbackLink");
	const kauniainenFeedbackLink = useT("kauniainenFeedbackLink");
	const lohjaFeedbackLink = useT("lohjaFeedbackLink");
	const raaseporiFeedbackLink = useT("raaseporiFeedbackLink");
	const hankoFeedbackLink = useT("hankoFeedbackLink");
	const karviainenFeedbackLink = useT("karviainenFeedbackLink");
	const inkooFeedbackLink = useT("inkooFeedbackLink");
	const siuntioFeedbackLink = useT("siuntioFeedbackLink");

	const average = useT("average");

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
						<span>
							{i18n.language == "sv-FI"
								? question.question_sv
								: question.question_fi}
						</span>
						<span className="hide-visually">
							. {average}: {question.average}.
						</span>
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

	const answers = (answers: any): JSX.Element[] | JSX.Element | null => {
		let answerList = <p>{noRelativesOpenTextAnswers}</p>;

		if (answers && answers.length > 0) {
			answerList = answers.map((answer: any, index: number) => (
				<>
					<div className="answer">
						<p className="answer-date">
							{formatDate(answer.created_date)}
						</p>
						<p key={index}>&quot;{answer.answer_text}&quot;</p>
						<p
							className={`response-header ${
								answer.response_text ? "" : "hidden"
							}`}
						>
							{feedbackResponseHeader}{" "}
							{formatDate(answer.response_date)}:
						</p>
						<p
							className={`response ${
								answer.response_text ? "" : "hidden"
							}`}
						>
							{answer.response_text}
						</p>
					</div>
				</>
			));
		}

		return answerList;
	};

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
									{fromRelatives}
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

				<p>{reviewFooterPart4}</p>
				<ul>
					<li>
						<a
							href={espooFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{espoo}
						</a>
					</li>
					<li>
						<a
							href={kirkkonummiFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{kirkkonummi}
						</a>
					</li>
					<li>
						<a
							href={kauniainenFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{kauniainen}
						</a>
					</li>
					<li>
						<a
							href={lohjaFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{lohja}
						</a>
					</li>
					<li>
						<a
							href={raaseporiFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{raasepori}
						</a>
					</li>
					<li>
						<a
							href={hankoFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{hanko}
						</a>
					</li>
					<li>
						<a
							href={karviainenFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{karviainen}
						</a>
					</li>
					<li>
						<a
							href={inkooFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{inkoo}
						</a>
					</li>
					<li>
						<a
							href={siuntioFeedbackLink}
							rel="noopener noreferrer"
							target="_blank"
						>
							{siuntio}
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default PageSurveyResults;
