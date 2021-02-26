import React, { FC, Fragment, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import FilterItem, { FilterOption } from "./FilterItem";
import queryString from "query-string";
import { useT } from "../i18n";
import axios from "axios";
import config from "./config";
import { NursingHome } from "./types";
import Cookies from "universal-cookie";
import { FeedbackState } from "./feedback-state";

import "../styles/PageOpenFeedbackResults.scss";
import withAuthentication from "../hoc/withAuthentication";
import { AuthTypes } from "./authTypes";

interface SearchFilters {
	readonly tila?: string[];
}

interface KeyToString {
	[key: string]: string;
}

interface OpenFeedback {
	id: string;
	nursinghome_id: string;
	answer_text: string;
	feedback_state: FeedbackState;
}

interface FeedbackResponse {
	data: OpenFeedback[];
}

const requestFeedbackStateUpdate = async (
	answerId: string | string[],
	newState: FeedbackState,
): Promise<void> => {
	try {
		await axios.post(`${config.API_URL}/survey/text-results`, {
			// eslint-disable-next-line @typescript-eslint/camelcase
			feedback_state: newState,
			answerId: answerId,
		});
	} catch (error) {
		console.error(error);

		throw error;
	}
};

const PageOpenFeedbackResults: FC = () => {
	const [results, setResults] = useState<OpenFeedback[]>([]);
	const [filteredResults, setFilteredResults] = useState<OpenFeedback[]>([]);
	const [nursingHomes, setNursingHomes] = useState<NursingHome[]>([]);

	const history = useHistory();
	const { search } = useLocation();

	useEffect(() => {
		// axios
		// 	.get(`${config.API_URL}/survey/text-results`, {
		// 		headers: {
		// 			Authentication: key,
		// 		},
		// 	})
		// 	.then((res: FeedbackResponse) => {
		// 		const data = res.data;

		// 		const openCases = data.filter(
		// 			(result: OpenFeedback) =>
		// 				result.feedback_state === FeedbackState.OPEN,
		// 		);

		// 		const approvedCases = data.filter(
		// 			(result: OpenFeedback) =>
		// 				result.feedback_state === FeedbackState.APPROVED,
		// 		);

		// 		const rejectedCases = data.filter(
		// 			(result: OpenFeedback) =>
		// 				result.feedback_state === FeedbackState.REJECTED,
		// 		);

		// 		const sortResults = [
		// 			...openCases,
		// 			...approvedCases,
		// 			...rejectedCases,
		// 		];

		// 		setResults(sortResults);
		// 	});

		axios
			.get(config.API_URL + "/nursing-homes")
			.then(async (response: { data: NursingHome[] }) => {
				setNursingHomes(response.data);
			})
			.catch((error: Error) => {
				console.error(error.message);
				throw error;
			});
	}, []);

	const filterOpen = useT("filterOpen");
	const filterApproved = useT("filterApproved");
	const filterRejected = useT("filterRejected");
	const labelFeedbackState = useT("labelFeedbackState");
	const ariaFeedbackState = useT("ariaFeedbackState");
	const filterLabel = useT("filterLabel");
	const headingFeedback = useT("headingFeedback");
	const approveAllOpenFeedback = useT("approveAllOpenFeedback");
	const approve = useT("approve");
	const reject = useT("reject");
	const filterSelections = useT("filterSelections");

	const labelNursingHome = useT("nursingHome");

	const mapFeedbackStateString: KeyToString = {
		[FeedbackState.OPEN]: filterOpen,
		[FeedbackState.APPROVED]: filterApproved,
		[FeedbackState.REJECTED]: filterRejected,
	};

	const parsed = queryString.parse(search);
	const parsedFeedbackState = parsed.tila
		? !Array.isArray(parsed.tila)
			? [parsed.tila]
			: parsed.tila
		: undefined;

	const searchFilters: SearchFilters = {
		tila: parsedFeedbackState as string[],
	};

	const optionState: FilterOption[] = [
		{
			name: FeedbackState.OPEN,
			label: filterOpen,
			type: "checkbox",
			checked: searchFilters.tila
				? searchFilters.tila.includes(
						mapFeedbackStateString[FeedbackState.OPEN],
				  )
				: false,
		},
		{
			name: FeedbackState.APPROVED,
			label: filterApproved,
			type: "checkbox",
			checked: searchFilters.tila
				? searchFilters.tila.includes(
						mapFeedbackStateString[FeedbackState.APPROVED],
				  )
				: false,
		},
		{
			name: FeedbackState.REJECTED,
			label: filterRejected,
			type: "checkbox",
			checked: searchFilters.tila
				? searchFilters.tila.includes(
						mapFeedbackStateString[FeedbackState.REJECTED],
				  )
				: false,
		},
	];

	useEffect(() => {
		const filterResults: OpenFeedback[] = results.filter(result => {
			if (searchFilters.tila) {
				return searchFilters.tila.includes(
					mapFeedbackStateString[result.feedback_state],
				);
			}

			return result;
		});

		setFilteredResults(filterResults);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, history, results]);

	const markAsApproved = async (id: string): Promise<void> => {
		try {
			const feedbackItem = results.find(result => result.id === id);

			if (feedbackItem) {
				feedbackItem["feedback_state"] = FeedbackState.APPROVED;

				const newResults = [...results];

				const itemIndex = newResults.findIndex(
					result => result.id === id,
				);

				newResults[itemIndex] = feedbackItem as OpenFeedback;

				await requestFeedbackStateUpdate(id, FeedbackState.APPROVED);
				setResults(newResults);
			}
		} catch (error) {
			console.error(error);

			throw error;
		}
	};
	const markAsRejected = async (id: string): Promise<void> => {
		try {
			const feedbackItem = results.find(result => result.id === id);

			if (feedbackItem) {
				feedbackItem["feedback_state"] = FeedbackState.REJECTED;

				const newResults = [...results];

				const itemIndex = newResults.findIndex(
					result => result.id === id,
				);

				newResults[itemIndex] = feedbackItem as OpenFeedback;

				await requestFeedbackStateUpdate(id, FeedbackState.REJECTED);
				setResults(newResults);
			}
		} catch (error) {
			console.error(error);

			throw error;
		}
	};

	const markAllOpenAsApproved = async (): Promise<void> => {
		try {
			const openResults: OpenFeedback[] = [...results].filter(result => {
				return result["feedback_state"] === FeedbackState.OPEN;
			});

			if (openResults.length) {
				const openResultsIDs: string[] = openResults.map(
					result => result.id,
				);

				await requestFeedbackStateUpdate(
					openResultsIDs,
					FeedbackState.APPROVED,
				);

				const newResults: OpenFeedback[] = [...results];

				for (const id of openResultsIDs) {
					const answer = newResults.find(item => item.id === id);

					if (answer) {
						answer["feedback_state"] = FeedbackState.APPROVED;

						const answerIndex = newResults.findIndex(
							item => item.id === id,
						);

						newResults[answerIndex] = answer;
					}
				}

				setResults(newResults);
			}
		} catch (error) {
			console.error(error);

			throw error;
		}
	};

	const filterElements = (
		<FilterItem
			label={labelFeedbackState}
			prefix="state"
			value={
				searchFilters.tila
					? searchFilters.tila.length <= 2
						? searchFilters.tila.join(", ")
						: `${searchFilters.tila.length} ${filterSelections}`
					: null
			}
			values={optionState}
			ariaLabel={ariaFeedbackState}
			disabled={!results}
			onChange={({ newValue, name }) => {
				const newSearchFilters = { ...searchFilters };
				let newStateFilters = newSearchFilters["tila"];

				if (!newStateFilters) {
					newStateFilters = [];
				}

				if (newValue) {
					if (
						!newStateFilters.includes(mapFeedbackStateString[name])
					) {
						newStateFilters.push(mapFeedbackStateString[name]);
					}
				} else {
					newStateFilters = newStateFilters.filter(
						stateItem => stateItem !== mapFeedbackStateString[name],
					);
				}

				newSearchFilters["tila"] = newStateFilters;

				const stringfield = queryString.stringify(newSearchFilters);
				history.push("/valvonta/palaute?" + stringfield);
			}}
			onReset={(): void => {
				const newSearchFilters = {
					...searchFilters,
					tila: undefined,
				};
				const stringfield = queryString.stringify(newSearchFilters);
				history.push("/valvonta/palaute?" + stringfield);
			}}
		/>
	);

	const nursingHomeName = (id: string): string => {
		const nursingHome = nursingHomes.find(item => item.id === id);

		return nursingHome ? nursingHome.name : "";
	};

	return (
		<div>
<<<<<<< HEAD
			{isAuthenticated ? (
				<Fragment>
					<div className="filters">
						<div className="filters-text">{filterLabel}</div>
						{filterElements}
					</div>

					<div className="page-open-feedback-results">
						<h1 className="feedback-results-heading">
							{headingFeedback}
						</h1>
						{results.length ? (
							<Fragment>
								<button
									className="btn check-all-results"
									onClick={markAllOpenAsApproved}
								>
									{approveAllOpenFeedback}
								</button>
								<ul className="feedback-results-list">
									{filteredResults.map(result => {
										return (
											<li
												className="feedback-results-list-item"
												key={result.id}
=======
			<div className="filters feedback-filters">
				<div className="filters-text">{filterLabel}</div>
				{filterElements}
			</div>

			<div className="page-open-feedback-results">
				<h1 className="feedback-results-heading">{headingFeedback}</h1>
				{results.length ? (
					<Fragment>
						<button
							className="btn check-all-results"
							onClick={markAllOpenAsApproved}
						>
							{approveAllOpenFeedback}
						</button>
						<ul className="feedback-results-list">
							{filteredResults.map(result => {
								return (
									<li
										className="feedback-results-list-item"
										key={result.id}
									>
										<div className="feedback-result-answer">
											<Link
												className="feedback-result-link"
												to={{
													pathname: `/hoivakodit/${result.nursinghome_id}`,
												}}
											>
												{labelNursingHome}:{" "}
												{nursingHomeName(
													result.nursinghome_id,
												)}
											</Link>
											<textarea
												className={
													result.feedback_state ===
													FeedbackState.APPROVED
														? "input approved"
														: result.feedback_state ===
														  FeedbackState.REJECTED
														? "input rejected"
														: "input"
												}
												rows={7}
												value={result.answer_text}
												readOnly={true}
											></textarea>
										</div>
										<div className="feedback-result-actions">
											<button
												type="button"
												className={
													result.feedback_state ===
													FeedbackState.APPROVED
														? "btn checked"
														: result.feedback_state ===
														  FeedbackState.REJECTED
														? "btn unchecked"
														: "btn"
												}
												onClick={() => {
													markAsApproved(result.id);
												}}
											>
												{approve}
											</button>
											<button
												type="button"
												className={
													result.feedback_state ===
													FeedbackState.REJECTED
														? "btn checked"
														: result.feedback_state ===
														  FeedbackState.APPROVED
														? "btn unchecked"
														: "btn"
												}
												onClick={() => {
													markAsRejected(result.id);
												}}
>>>>>>> Login, refresh token
											>
												{reject}
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					</Fragment>
				) : null}
			</div>
		</div>
	);
};

export default withAuthentication(PageOpenFeedbackResults, AuthTypes.VALVONTA);
