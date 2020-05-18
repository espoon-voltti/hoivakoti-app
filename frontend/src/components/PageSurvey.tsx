import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import i18n from "../i18n";
import "../styles/PageSurvey.scss";
import Radio from "./Radio";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
import { stringify } from "querystring";


let surveyState: any[] = [];

const PageSurvey: FC = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [logInFailed, setLogInFailed] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const { id } = useParams();
	const [survey, setSurvey] = useState<any[] | null>(null);
	const [surveyDone, setSurveyDone] = useState<boolean>(false);

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
		survey: any
	): Promise<void> => {
		await axios.post(
			`${config.API_URL}/survey/${id}/responses`,
			// eslint-disable-next-line @typescript-eslint/camelcase
			{ 
				survey: survey,
				surveyKey: key
			}
		)
		.then((responce) => {
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


	const updateAnswer = (id: number, state: any) => {
		const index = surveyState.findIndex( x => x.id === id );
		surveyState[index].value = state;
	}
	

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		await sendSurvey(id, password, surveyState);
	};

	const handleLogin = async (
		event: React.MouseEvent<HTMLButtonElement>,
		): Promise<void> => {
            const login = await axios.post(
                `${config.API_URL}/survey/check-key`,
                { 
                    surveyKey: password,
                }
			).then(function(response: { data: string }) {
				setLoggedIn(true);
			}).catch((error: Error) => {
				setLogInFailed(true);
				console.error(error.message);
			});
	};

	const questions: JSX.Element[] | null =
		survey &&
		survey.map((question: any, index: number) => (
			<div card-key={index}>
				<div className={`page-survey-section`}>
					<Question 
						question={question}
						onChange={
							value => { updateAnswer(question.id, value); }
						}
						/>
				</div>
			</div>
		));
		
	if(surveyDone) {
		return (
			<div className="page-survey-done">
				<h1>{thankYouReview}</h1>
				<Link to={`/`}>{backToFrontpage}</Link>
			</div>
		);
	}

	if(loggedIn && nursingHome) {
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
								<h4 className="page-survey-minor-header">{aboutToGiveReview}: <span>{nursingHome.name}</span></h4>
								{questions}
	
								<div className="survey-send-btn-container">
									<button type="submit" className="btn">{btnSend}</button>
								</div>
						</form>
						
						</>
					)}
				</div>
			</div>
		);
	}

	if(nursingHome){
		return (
			<div className="login-container">
					<h4>{aboutToGiveReview}</h4>
					<h2 className="header-inline">{nursingHome.name}</h2><h3 className="header-inline">{nursingHome.owner}</h3>
					<h4>{reviewHelpPart1}</h4>
					<h4>{reviewHelpPart2}</h4>
					<h4>{reviewHelpPart3}</h4>
					<div>
						<span>{code}</span>
						<input type="text" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
						<p className={logInFailed ? "survey-login-error" : "hidden"}>{wrongCode}</p>
					</div>
					<div>
						<button className="btn" onClick={handleLogin}>{start}</button>
					</div>
			</div>
		);
	}

	return(
		<div className="login-container">
			<h2>{loadingText}</h2>
		</div>
	);

	
};

export default PageSurvey;

interface QuestionProps {
	question: any | null;
	onChange: (value: any) => void;
}

export const Question: FC<QuestionProps> = ({
	question,
	onChange
}) => {

	const optionText1 = useT("surveyOption1");
	const optionText2 = useT("surveyOption2");
	const optionText3 = useT("surveyOption3");
	const optionText4 = useT("surveyOption4");
	const optionText5 = useT("surveyOption5");

	const [questionState, setQuestionState] = useState<number | null>(null);

		return (
			<div className="survey-card-container">
			<div className="survey-card-inner">
				<div className="survey-icon">{question.question_icon ? (<img src={`/icons/${question.question_icon}`}></img>) : (<></>) }</div>
			</div>
			<div className="survey-card-inner">
			<div className={"survey-card-question"}>
				<div className="survey-card--header-container">
					<h3 className="survey-card--header">{i18n.language == "sv-FI" ? question.question_sv : question.question_fi }</h3>
					<h4 className="survey-card--desc">{i18n.language == "sv-FI" ? question.question_description_sv : question.question_description_fi }</h4>
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