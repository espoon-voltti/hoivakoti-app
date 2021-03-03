import React, { FC, Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useT } from "../i18n";
import axios from "axios";
import config from "./config";
import FeedbackState from "../shared/types/feedback-state";

import "../styles/PageRespondFeedback.scss";

interface OpenFeedback {
	id: string;
	nursinghome_id: string;
	answer_text: string;
	feedback_state: FeedbackState;
}

const PageRespondFeedback: FC = () => {
	const { id, key } = useParams() as any;
	const [results, setResults] = useState<OpenFeedback[]>([]);

	useEffect(() => {
		axios
			.get(`${config.API_URL}/survey/${id}/approved-results/omaiskysely`)
			.then((response: { data: any[] }) => setResults(response.data))
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	const submitResponse = async (
		response: string,
		responseId: string,
	): Promise<void> => {
		console.log(responseId);
		await axios
			.post(
				`${config.API_URL}/feedback/response`,
				// eslint-disable-next-line @typescript-eslint/camelcase
				{
					response: response,
					id: responseId,
					key: key,
				},
			)
			.then(() => {
				return;
			});
	};

	const feedbackResponseInfo = useT("feedbackResponseInfo");
	const feedbackForNursingHome = useT("feedbackForNursingHome");
	const noFeedbackYet = useT("noFeedbackYet");

	return (
		<div>
			<Fragment>
				<div className="page-respond-feedback">
					<h2>{feedbackForNursingHome}</h2>
					<p>{feedbackResponseInfo}</p>
					{results.length ? (
						<Fragment>
							<ul className="feedback-results-list">
								{results.map(result => {
									return (
										<li
											className="feedback-results-list-item"
											key={result.id}
										>
											<div className="">
												{result.answer_text}
											</div>
											<ResponseField
												feedback={result}
												submit={value => {
													submitResponse(
														value,
														result.id,
													);
												}}
											/>
										</li>
									);
								})}
							</ul>
						</Fragment>
					) : (
						<Fragment>
							<p>{noFeedbackYet}</p>
						</Fragment>
					)}
				</div>
			</Fragment>
		</div>
	);
};

export default PageRespondFeedback;

interface ResponseFieldProps {
	feedback: any | null;
	submit: (value: string) => void;
}

export const ResponseField: FC<ResponseFieldProps> = ({ feedback, submit }) => {
	const charactersLeft = useT("charactersLeft");
	const savedT = useT("saved");
	const btnSave = useT("btnSave");
	const [response, setResponse] = useState<string>(
		feedback.response_text ? feedback.response_text : "",
	);
	const [changed, setChanged] = useState<boolean>(false);
	const [saved, setSaved] = useState<boolean>(false);

	return (
		<>
			<div className="feedback-response">
				<textarea
					className="input"
					onChange={(
						event: React.ChangeEvent<HTMLTextAreaElement>,
					): void => {
						if (event.target.value.length <= 1000) {
							setResponse(event.target.value);
							setChanged(true);
							setSaved(false);
						}
					}}
					rows={7}
					value={response}
				></textarea>
				<span>
					{1000 - response.length}/1000 {charactersLeft}
				</span>
			</div>
			<div className="feedback-response-actions">
				<p
					className={`feedback-response-saved ${
						saved ? "" : "hidden"
					}`}
				>
					{savedT}
				</p>
				<button
					type="button"
					className={`btn ${changed ? "" : "disabled"}`}
					disabled={!changed}
					onClick={e => {
						e.preventDefault();
						submit(response);
						setChanged(false);
						setSaved(true);
					}}
				>
					{btnSave}
				</button>
			</div>
		</>
	);
};
