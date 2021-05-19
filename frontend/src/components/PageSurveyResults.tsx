import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import i18n from "../i18n";
import "../styles/PageSurveyResults.scss";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./types";
import { NursingHome } from "./types";
import FeedbackState from "../shared/types/feedback-state";

interface OpenAnswer {
	answer_text: string;
	created_date: string;
	feedback_state: FeedbackState;
	id: string;
	response_date: string;
	response_text: string;
}

const PageSurveyResults: FC = () => {
	const { id } = useParams() as any;

	if (!id) throw new Error("Invalid URL!");

	const [relativeSurvey, setRelativeSurvey] = useState<any[] | null>(null);
	const [textResults, setTextResults] = useState<any[] | null>(null);
	const [customerSurvey, setCustomerSurvey] = useState<any[] | null>(null);
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);

	const { hash } = useLocation();

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

	useEffect(() => {
		if (hash) {
			setTimeout(() => {
				const hashElement = document.querySelector(hash) as HTMLElement;

				if (hashElement) {
					hashElement.scrollIntoView();
				}
			}, 250);
		}
	}, [hash]);

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
	const reviewFooterPart3 = useT("reviewFooterPart3");
	const reviewFooterPart4 = useT("reviewFooterPart4");

	const noRelativesOpenTextAnswers = useT("noRelativesOpenTextAnswers");
	const feedbackResponseHeader = useT("feedbackResponseHeader");

	const optionText1 = useT("surveyOption1");
	const optionText2 = useT("surveyOption2");
	const optionText3 = useT("surveyOption3");
	const optionText4 = useT("surveyOption4");
	const optionText5 = useT("surveyOption5");
	const feedbackAverage = useT("feedbackAverage");

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

	const formatDate = (dateStr: string | null): string => {
		if (!dateStr) {
			return "";
		}

		const date = new Date(dateStr);

		const YYYY = String(date.getUTCFullYear());
		const MM = String(date.getUTCMonth() + 1);
		const DD = String(date.getUTCDate());

		return `${DD}.${MM}.${YYYY}`;
	};

	const ratingToString = (
		answers: number | null,
		rating: number | null,
	): string => {
		if (rating && answers) {
			if (answers >= 5) {
				if (rating > 4.5) {
					return optionText5;
				} else if (rating > 3.5) {
					return optionText4;
				} else if (rating > 2.5) {
					return optionText3;
				} else if (rating > 1.5) {
					return optionText2;
				} else if (rating > 0.5) {
					return optionText1;
				}
			}

			return feedbackAverage;
		}

		return "-";
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

	const answers = (
		answers: OpenAnswer[],
	): JSX.Element[] | JSX.Element | null => {
		let answerList: JSX.Element | JSX.Element[] = (
			<p>{noRelativesOpenTextAnswers}</p>
		);

		if (answers && answers.length > 0) {
			const sortedAnswers = answers.sort((a1, a2) => {
				const date1 = new Date(a1.created_date);
				const date2 = new Date(a2.created_date);

				return date2.getTime() - date1.getTime();
			});

			answerList = sortedAnswers.map(
				(answer: OpenAnswer, index: number) => (
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
				),
			);
		}

		return answerList;
	};

	const nursingHomeRating = nursingHome ? nursingHome.rating : null;

	const enoughCustomerAnswers = nursingHomeRating
		? nursingHomeRating.answers_customers &&
		  nursingHomeRating.answers_customers >= 5
		: null;

	const enoughRelativesAnswers = nursingHomeRating
		? nursingHomeRating.answers_relatives &&
		  nursingHomeRating.answers_relatives >= 5
		: null;

	return (
		<div className="page-survey-results">
			<div>
				{!relativeSurvey ||
				!customerSurvey ||
				!nursingHome ||
				!nursingHomeRating ? (
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
								{nursingHomeRating.answers_customers
									? nursingHomeRating.answers_customers
									: "0"}{" "}
								{nReviews}
							</p>

							{enoughCustomerAnswers ? (
								<div className="page-survey-results-item">
									{questions(customerSurvey)}
								</div>
							) : null}

							<p className="page-survey-results-minor-title">
								{averageReviewScore}:
								<span className="page-survey-results-bold">
									{" "}
									{ratingToString(
										nursingHomeRating.answers_customers,
										nursingHomeRating.average_customers,
									)}
								</span>{" "}
								{enoughCustomerAnswers &&
								nursingHomeRating.average_customers
									? nursingHomeRating.average_customers.toPrecision(
											2,
									  ) + " / 5"
									: ""}
							</p>
						</div>
						<div className="page-survey-results-set">
							<h3 className="page-survey-results-title">
								{relativeReviewsBy}
							</h3>
							<p className="page-survey-results-minor-title">
								{nursingHomeRating.answers_relatives
									? nursingHomeRating.answers_relatives
									: "0"}{" "}
								{nReviews}
							</p>

							{enoughRelativesAnswers ? (
								<div className="page-survey-results-item">
									{questions(relativeSurvey)}
								</div>
							) : null}

							<p className="page-survey-results-minor-title">
								{averageReviewScore}:
								<span className="page-survey-results-bold">
									{" "}
									{ratingToString(
										nursingHomeRating.answers_relatives,
										nursingHomeRating.average_relatives,
									)}
								</span>{" "}
								{enoughRelativesAnswers &&
								nursingHomeRating.average_relatives
									? nursingHomeRating.average_relatives.toPrecision(
											2,
									  ) + " / 5"
									: ""}
							</p>
							<div className="page-survey-results-answer-container">
								<div className="page-survey-results-answer-header">
									{fromRelatives}
								</div>
								<div className="page-survey-results-answer-content">
									{answers(textResults as OpenAnswer[])}
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
				<p>
					<strong>{reviewFooterPart3}</strong>
				</p>
				<p>{reviewFooterPart4}</p>
				<ul id="contact-list">
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
