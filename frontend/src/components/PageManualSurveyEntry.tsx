import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageManualSurveyEntry.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome } from "./types";
import Cookies from "universal-cookie";

const PageManualSurveyEntry: FC = () => {
	const sessionCookies = new Cookies();

	const { id } = useParams();
	const key = sessionCookies.get("hoivakoti_session");
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [popupState, setPopupState] = useState<
		null | "saving" | "saved" | "failed"
	>(null);

	const [results, setResults] = useState<any[] | null>(null);
	const [temp, setTemp] = useState<any | null>(null);

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
				setResults(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id, key]);

	const title = "Syötä asiakaskyselyn vastaukset";
	const loadingText = useT("loadingText");
	const btnSave = useT("btnSave");

	const updatePopupSaved = useT("saved");
	const updatePopupFailed = useT("reportFailed");
	const updatePopupSaving = useT("saving");

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setPopupState("saving");
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
					<h4>{question.question_fi}</h4>

					<span>Vastausten keskiarvo: </span>
					<input
						type="text"
						value={temp}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>,
						): void => {
							setTemp(event.target.value);
						}}
					></input>
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
									Takaisin listaukseen
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
									<strong>Osoite: </strong>
									{nursingHome.address}
								</p>
							</div>
							<div className="page-update-section manual-survey-question">
								<h4>Kyselyyn vastaajia yhteensä</h4>
								<span>Kpl: </span>
								<input
									type="text"
									value={temp}
									onChange={(
										event: React.ChangeEvent<
											HTMLInputElement
										>,
									): void => {
										setTemp(event.target.value);
									}}
								></input>
							</div>
							<div className="page-update-section">
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
