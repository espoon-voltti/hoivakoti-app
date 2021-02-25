import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageManualSurveyEntry.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../config";

import { NursingHome, GetNursingHomeResponse } from "./types";
import Cookies from "universal-cookie";

let resultState: any[] = [];

const PageManualSurveyEntry: FC = () => {
	const sessionCookies = new Cookies();

	const { id } = useParams() as any;
	const key = sessionCookies.get("hoivakoti_session");
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [popupState, setPopupState] = useState<
		null | "saving" | "saved" | "failed"
	>(null);

	const [results, setResults] = useState<any[]>([]);
	const [count, setCount] = useState<number>(0);

	if (!id) throw new Error("Invalid URL!");

	useEffect(() => {
		axios
			.get(config.API_URL + "/admin/login", {
				headers: { Authentication: key },
			})
			.catch((error: Error) => {
				console.error(error.message);
				window.location.href = "/valvonta";
			});

		axios
			.get(`${config.API_URL}/nursing-homes/${id}`)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});

		axios
			.get(`${config.API_URL}/survey/${id}/results/asiakaskysely`)
			.then((response: { data: any[] }) => {
				resultState = response.data;
				if (response.data && response.data.length) {
					setCount(response.data[0].answers);
					setResults(response.data);
				}
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id, key]);

	const title = useT("manualSurveyEntryTitle");
	const loadingText = useT("loadingText");
	const btnSave = useT("btnSave");
	const manualSurveyEntryHelpText = useT("manualSurveyEntryHelpText");
	const linkBacktoListShort = useT("linkBacktoListShort");
	const address = useT("address");
	const surveyAnswersTotal = useT("surveyAnswersTotal");
	const numberOfShort = useT("numberOfShort");

	const updatePopupSaved = useT("saved");
	const updatePopupFailed = useT("reportFailed");
	const updatePopupSaving = useT("saving");

	const updateAnswer = (id: number, value: number): void => {
		const index = resultState.findIndex(x => x.id === id);
		resultState[index].average = value;
		setResults(resultState);
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setPopupState("saving");
		await axios
			.post(
				`${config.API_URL}/survey/${id}/manual-entry`,
				{
					survey: results,
				},
				{
					headers: { Authentication: key },
				},
			)
			.then(_ => {
				setPopupState("saved");
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		window.location.href = "/valvonta";
	};

	const questions: JSX.Element[] | null =
		results &&
		results.map((question: any, index: number) => (
			<div key={index}>
				<div className={"manual-survey-question"}>
					<Question
						question={question}
						onChange={value => {
							{
								updateAnswer(question.id, value);
							}
						}}
					/>
				</div>
			</div>
		));

	return (
		<div className="page-update">
			<div className="page-update-content">
				{!nursingHome ? (
					<h1>{loadingText}</h1>
				) : (
					<>
						<h1 className="page-update-title">{title}</h1>
						<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
							<div className="nav-save">
								<button
									className="page-update-cancel"
									onClick={cancelEdit}
								>
									{linkBacktoListShort}
								</button>
								<button type="submit" className="btn">
									{btnSave}
								</button>

								{popupState && (
									<span
										className={
											popupState === "failed"
												? "page-update-popup-failed"
												: "page-update-popup"
										}
									>
										{popupState === "saving"
											? updatePopupSaving
											: popupState === "failed"
											? updatePopupFailed
											: updatePopupSaved}
									</span>
								)}
							</div>
							<div className="page-update-section">
								<h3 className="page-update-data page-update-data-nursing-home-name">
									{nursingHome.name}
								</h3>
								<h4 className="page-update-data page-update-data-nursing-home-owner">
									{nursingHome.owner}
								</h4>
								<p className="page-update-data">
									<strong>{address}: </strong>
									{nursingHome.address}
								</p>
							</div>
							<div className="page-update-section manual-survey-question">
								<h4>{surveyAnswersTotal}</h4>
								<span>{numberOfShort}: </span>
								<input
									type="text"
									value={count}
									onChange={(
										event: React.ChangeEvent<
											HTMLInputElement
										>,
									): void => {
										for (const question of resultState) {
											question.answers = parseInt(
												event.target.value,
											);
										}
										setResults(resultState);
										setCount(parseInt(event.target.value));
									}}
								></input>
							</div>
							<div className="page-update-section">
								<p>{manualSurveyEntryHelpText}</p>
								{questions}
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default PageManualSurveyEntry;

interface QuestionProps {
	question: any;
	onChange: (value: any) => void;
}

export const Question: FC<QuestionProps> = ({ question, onChange }) => {
	const [questionState, setQuestionState] = useState<string>(
		question.average,
	);

	const averageReviewScore = useT("averageReviewScore");

	return (
		<>
			<h4>{question.question_fi}</h4>

			<span>{averageReviewScore}: </span>
			<input
				type="string"
				value={questionState}
				onChange={(
					event: React.ChangeEvent<HTMLInputElement>,
				): void => {
					onChange(parseFloat(event.target.value.replace(",", ".")));
					setQuestionState(event.target.value.replace(",", "."));
				}}
			></input>
		</>
	);
};
