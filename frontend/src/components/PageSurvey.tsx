import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import i18n from "../i18n";
import "../styles/PageSurvey.scss";
import Radio from "./Radio";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./types";
import { NursingHome } from "./types";

let surveyState: any[] = [];

const PageSurvey: FC = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [logInFailed, setLogInFailed] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);

	const { id } = useParams() as any;

	const [survey, setSurvey] = useState<any[] | null>(null);
	const [surveyDone, setSurveyDone] = useState<boolean>(false);

	const [surveyPage, setSurveyPage] = useState<number>(0);

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
		axios
			.get(`${config.API_URL}/survey/omaiskysely`)
			.then((response: { data: any[] }) => {
				surveyState = response.data;
				setSurvey(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, []);

	const sendSurvey = async (
		id: string,
		key: string,
		survey: any,
	): Promise<void> => {
		await axios
			.post(
				`${config.API_URL}/survey/${id}/responses`,
				// eslint-disable-next-line @typescript-eslint/camelcase
				{
					survey: survey,
					surveyKey: key,
				},
			)
			.then(() => {
				setSurveyDone(true);
			});
	};

	const loadingText = useT("loadingText");
	const btnSend = useT("btnSend");
	const aboutToGiveReview = useT("aboutToGiveReview");
	const reviewHelpPart1 = useT("reviewHelpPart1");
	const reviewHelpPart2 = useT("reviewHelpPart2");
	const reviewHelpPart3 = useT("reviewHelpPart3");
	const code = useT("code");
	const wrongCode = useT("wrongCode");
	const start = useT("start");
	const thankYouReview = useT("thankYouReview");
	const backToFrontpage = useT("backToFrontpage");
	const next = useT("next");
	const previous = useT("previous");

	const updateAnswer = (id: number, state: any): void => {
		const index = surveyState.findIndex(x => x.id === id);
		surveyState[index].value = state;
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		await sendSurvey(id, password, surveyState);
	};

	const handleLogin = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		await axios
			.post(`${config.API_URL}/survey/check-key`, {
				surveyKey: password,
			})
			.then(function() {
				setLoggedIn(true);
			})
			.catch((error: Error) => {
				setLogInFailed(true);
				console.error(error.message);
			});
	};

	const replaceLocation = (link: string): void => {
		window.location.href = link;
	};

	const raitingQuestions: JSX.Element[] | null =
		survey &&
		survey
			.filter(q => q.question_type == "rating")
			.map((question: any, index: number) => (
				<section className={"page-survey-section"} key={index}>
					<Question
						question={question}
						onChange={value => {
							updateAnswer(question.id, value);
						}}
					/>
				</section>
			));

	const textQuestionLink = `/hoivakodit/${id}/arviot`;

	const textQuestions: JSX.Element[] | null =
		survey &&
		survey
			.filter(q => q.question_type == "text")
			.map((question: any, index: number) => (
				<section className={"page-survey-section"} key={index}>
					<TextQuestion
						question={question}
						link={textQuestionLink}
						onChange={value => {
							updateAnswer(question.id, value);
						}}
					/>
				</section>
			));

	if (surveyDone) {
		return (
			<div className="page-survey-done">
				<h1>{thankYouReview}</h1>
				<Link to={"/"}>{backToFrontpage}</Link>
			</div>
		);
	}

	if (loggedIn && nursingHome) {
		return (
			<div className="">
				<div className="">
					{!survey ? (
						<h1 className="page-update-title">{loadingText}</h1>
					) : (
						<>
							<form
								className="page-survey-container"
								onSubmit={handleSubmit}
							>
								<h4 className="page-survey-minor-header">
									{aboutToGiveReview}:{" "}
									<span>{nursingHome.name}</span>
								</h4>
								<div
									className={
										"page-survey-page" +
										(surveyPage == 0 ? "" : " hidden")
									}
								>
									{raitingQuestions}
									<div className="survey-send-btn-container">
										<button
											className="btn btn-right"
											onClick={e => {
												e.preventDefault();
												setSurveyPage(1);
											}}
										>
											{next}
										</button>
									</div>
								</div>
								<div
									className={
										"page-survey-page" +
										(surveyPage == 1 ? "" : " hidden")
									}
								>
									{textQuestions}
									<div className="survey-send-btn-container">
										<button
											className="btn btn-secondary"
											onClick={e => {
												e.preventDefault();
												setSurveyPage(0);
											}}
										>
											{previous}
										</button>
										<button
											type="submit"
											className="btn btn-right"
										>
											{btnSend}
										</button>
									</div>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		);
	}

	if (nursingHome) {
		return (
			<div className="login-container">
				<h4>{aboutToGiveReview}</h4>
				<h2 className="header-inline">{nursingHome.name}</h2>
				<h3 className="header-inline">{nursingHome.owner}</h3>
				<h4>{reviewHelpPart1}</h4>
				<h4>{reviewHelpPart2}</h4>
				<h4>{reviewHelpPart3}</h4>
				<form onSubmit={handleLogin}>
					<div>
						<span className="login-input-label">{code}</span>
						<input
							type="text"
							value={password}
							onChange={e => {
								setPassword(e.target.value);
							}}
						></input>
					</div>
					<div className="align-right">
						<p
							className={
								logInFailed ? "survey-login-error" : "hidden"
							}
						>
							{wrongCode}
						</p>
						<button type="submit" className="btn" value="Submit">
							{start}
						</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="login-container">
			<h2>{loadingText}</h2>
		</div>
	);
};

export default PageSurvey;

interface QuestionProps {
	question: any | null;
	link?: string | null;
	onChange: (value: any) => void;
}

export const Question: FC<QuestionProps> = ({ question, onChange }) => {
	const optionText1 = useT("surveyOption1");
	const optionText2 = useT("surveyOption2");
	const optionText3 = useT("surveyOption3");
	const optionText4 = useT("surveyOption4");
	const optionText5 = useT("surveyOption5");

	const [questionState, setQuestionState] = useState<number | null>(null);

	return (
		<div className="survey-card-container">
			<div className="survey-card-inner">
				<div className="survey-icon">
					{question.question_icon ? (
						<img src={`/icons/${question.question_icon}`}></img>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="survey-card-inner">
				<div className="survey-card-question">
					<div className="survey-card--header-container">
						<h3 className="survey-card--header">
							{i18n.language == "sv-FI"
								? question.question_sv
								: question.question_fi}
						</h3>
						<h4 className="survey-card--desc">
							{i18n.language == "sv-FI"
								? question.question_description_sv
								: question.question_description_fi}
						</h4>
					</div>
					<div className="survey-card-line line-1"></div>
					<div className="survey-card-line line-2"></div>
					<div className="survey-card-line line-3"></div>
					<div className="survey-card-line line-4"></div>
					<div className="survey-card--inputs">
						<Radio
							id={`option-1-${question.id}`}
							name={`option-1-${question.id}`}
							isSelected={questionState == 1}
							onChange={isChecked => {
								if (isChecked) {
									onChange(1);
									setQuestionState(1);
								}
							}}
							tag={"1"}
						>
							{optionText1}
						</Radio>

						<Radio
							id={`option-2-${question.id}`}
							name={`option-2-${question.id}`}
							isSelected={questionState == 2}
							onChange={isChecked => {
								if (isChecked) {
									onChange(2);
									setQuestionState(2);
								}
							}}
							tag={"2"}
						>
							{optionText2}
						</Radio>

						<Radio
							id={`option-3-${question.id}`}
							name={`option-3-${question.id}`}
							isSelected={questionState == 3}
							onChange={isChecked => {
								if (isChecked) {
									onChange(3);
									setQuestionState(3);
								}
							}}
							tag={"3"}
						>
							{optionText3}
						</Radio>

						<Radio
							id={`option-4-${question.id}`}
							name={`option-4-${question.id}`}
							isSelected={questionState == 4}
							onChange={isChecked => {
								if (isChecked) {
									onChange(4);
									setQuestionState(4);
								}
							}}
							tag={"4"}
						>
							{optionText4}
						</Radio>

						<Radio
							id={`option-5-${question.id}`}
							name={`option-5-${question.id}`}
							isSelected={questionState == 5}
							onChange={isChecked => {
								if (isChecked) {
									onChange(5);
									setQuestionState(5);
								}
							}}
							tag={"5"}
						>
							{optionText5}
						</Radio>
					</div>
				</div>
			</div>
		</div>
	);
};

export const TextQuestion: FC<QuestionProps> = ({
	question,
	link,
	onChange,
}) => {
	const charactersLeft = useT("charactersLeft");
	const openFeedbackPlaceholder = useT("openFeedbackPlaceholder");
	const [questionState, setQuestionState] = useState<string>("");

	return (
		<div className="survey-card-container">
			<div className="survey-card-inner">
				<div className="survey-card-question">
					<div className="survey-card--header-container">
						<h3 className="survey-card--header">
							{i18n.language == "sv-FI"
								? question.question_sv
								: question.question_fi}
						</h3>
						<p>
							Anna yleistä palautetta hoivakodin laadusta. Palaute
							julkaistaan kun se on hyväksytty. Palautteen antajan
							nimi pysyy piilossa. Tietoja joista voidaan
							tunnistaa henkilö, ei voida julkaista.
						</p>
						<p>
							Jos haluat antaa tietoja jostain tietystä henkilöstä
							tai tilanteesta tai haluat palautteeseen
							henkilökohtaisen vastauksen, anna palaute kunnan
							oman{" "}
							<Link
								to={{
									pathname: link as string,
									hash: "#contact-list",
								}}
								replace={false}
							>
								palautekanavan
							</Link>{" "}
							kautta.
						</p>
						{/* <h4 className="survey-card--desc">
							{i18n.language == "sv-FI"
								? question.question_description_sv
								: question.question_description_fi}
						</h4> */}
					</div>
					<textarea
						value={questionState}
						placeholder={openFeedbackPlaceholder}
						maxLength={1000}
						onChange={(
							event: React.ChangeEvent<HTMLTextAreaElement>,
						): void => {
							if (event.target.value.length <= 1000) {
								onChange(event.target.value);
								setQuestionState(event.target.value);
							}
						}}
					></textarea>
					<p>
						{1000 - questionState.length}/1000 {charactersLeft}
					</p>
				</div>
			</div>
		</div>
	);
};
