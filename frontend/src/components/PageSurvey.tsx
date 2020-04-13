import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageSurvey.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome, NursingHomeImageName } from "./types";
import { stringify } from "querystring";


let surveyState: any[] = [];

const PageSurvey: FC = () => {
	const { id, key } = useParams();
	const [survey, setSurvey] = useState<any[] | null>(null);
	const [surveyDone, setSurveyDone] = useState<boolean>(false);

	if (!id || !key) throw new Error("Invalid URL!");

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
			`${config.API_URL}/survey/${id}/responses/${key}`,
			// eslint-disable-next-line @typescript-eslint/camelcase
			{ 
				survey: survey
			}
		)
		.then((responce) => {
			setSurveyDone(true);
		});
	};

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
	const btnSend = useT("btnSend");


	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");

	const updateAnswer = (id: number, state: any) => {
		const index = surveyState.findIndex( x => x.id === id );
		surveyState[index].value = state;
	}
	

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		await sendSurvey(id, key, surveyState);
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>):void => {
		e.preventDefault();
		window.location.href = window.location.pathname + "/peruuta";
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
				<h1>Kiitos palautteestasi</h1>
			</div>
		);
	}

	return (
		<div className="">
			<div className="">
				{!survey ? (
					<h1 className="page-update-title">{loadingText}</h1>
				) : (
					<>
					<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>

						<div className="page-survey-container">
							{questions}

							<div className="survey-send-btn-container">
								<button type="submit" className="btn">{btnSend}</button>
							</div>
						</div>
					</form>
					
					</>
				)}
			</div>
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
			<div className={"survey-card-question"}>
				<div className="survey-card--header-container">
					<h3 className="survey-card--header">{question.question}</h3>
					<h4 className="survey-card--desc">{question.question_description}</h4>
				</div>
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
				>
					{optionText5}
				</Radio>
						
								
				</div>
			</div>
		);
};