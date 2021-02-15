import React, { FC, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import FilterItem, { FilterOption } from "./FilterItem";
import queryString from "query-string";

import "../styles/PageOpenFeedbackResults.scss";

enum FeedbackState {
	OPEN = "open",
	APPROVED = "approved",
	REJECTED = "rejected",
}

interface OpenFeedback {
	id: string;
	nursinghome_id: string;
	answer: string;
	state: FeedbackState;
}

interface SearchFilters {
	readonly name?: string;
	readonly tila?: string[];
}

interface KeyToString {
	[key: string]: string;
}

const PageOpenFeedbackResults: FC = () => {
	const [results, setResults] = useState<OpenFeedback[]>([]);
	const [filteredResults, setFilteredResults] = useState<OpenFeedback[]>([]);
	const [, setHasOpenCases] = useState(false);

	const history = useHistory();
	const { search } = useLocation();

	useEffect(() => {
		const resultsStatic: OpenFeedback[] = [
			{
				id: "result-1",
				// eslint-disable-next-line @typescript-eslint/camelcase
				nursinghome_id: "967731a488",
				answer:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit dui quis ligula elementum maximus. Donec quis posuere nisi. Duis eu euismod turpis. Nam libero erat, laoreet quis tincidunt quis, lobortis in lacus. Ut scelerisque orci sit amet ante finibus, sit amet tempor arcu dapibus. Aliquam vitae lectus felis. Mauris commodo vel dolor at molestie. Etiam non eros orci. Pellentesque a dolor augue. Integer nec nulla in enim sodales blandit. Vivamus suscipit est sagittis tellus aliquam, sit amet dapibus sem commodo. Aliquam commodo luctus augue non lacinia. Fusce varius ut lacus quis egestas. Phasellus dolor quam, bibendum pellentesque nisi at, venenatis tempor ante.",
				state: FeedbackState.REJECTED,
			},
			{
				id: "result-2",
				// eslint-disable-next-line @typescript-eslint/camelcase
				nursinghome_id: "967731a488",
				answer:
					"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam eleifend posuere tellus, id feugiat nisi faucibus ut. Donec condimentum enim nulla, sit amet convallis ante lacinia ac. Proin dapibus quis massa ut volutpat. Integer a lacus mollis, aliquam ligula eu, pharetra nibh. Suspendisse fringilla sagittis ligula vel rutrum. Vivamus eget sapien suscipit, molestie quam eu, facilisis tellus. Sed dapibus tempor tortor, non tristique nisl maximus id. Etiam consequat euismod felis, efficitur hendrerit turpis viverra id. Ut tellus arcu, egestas ut velit ut, sagittis mattis lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
				state: FeedbackState.OPEN,
			},
			{
				id: "result-3",
				// eslint-disable-next-line @typescript-eslint/camelcase
				nursinghome_id: "967731a488",
				answer:
					"Curabitur fringilla lobortis odio, et ultrices lectus efficitur ac. Donec quis lacus vehicula, posuere lorem a, semper diam. Nunc vitae blandit odio. Nulla facilisi. Quisque tincidunt ex a purus placerat, vel dignissim dolor porta. Curabitur ullamcorper porta nisl. Donec augue metus, egestas et molestie ut, laoreet nec justo. Praesent tristique lectus tincidunt arcu facilisis pellentesque. Cras vitae molestie nisl, ac volutpat velit. Nam elit tellus, vulputate in nisl in, rhoncus cursus ex. Nulla pulvinar leo orci, non hendrerit libero varius eu. Nulla viverra arcu at mauris convallis, vitae iaculis tortor luctus. Nunc eros elit, ultrices sed feugiat lacinia, congue a arcu. Nam dolor neque, rhoncus nec eros eget, ultrices iaculis arcu. Vestibulum quis efficitur massa.",
				state: FeedbackState.APPROVED,
			},
		];

		const openCases = resultsStatic.filter(
			result => result.state === FeedbackState.OPEN,
		);

		const approvedCases = resultsStatic.filter(
			result => result.state === FeedbackState.APPROVED,
		);

		const rejectedCases = resultsStatic.filter(
			result => result.state === FeedbackState.REJECTED,
		);

		const sortResults = [...openCases, ...approvedCases, ...rejectedCases];

		setResults(sortResults);
		setHasOpenCases(openCases.length > 0);
	}, []);

	const mapFeedbackStateString: KeyToString = {
		[FeedbackState.OPEN]: "Avoin",
		[FeedbackState.APPROVED]: "Hyväksytty",
		[FeedbackState.REJECTED]: "Hylätty",
	};

	const parsed = queryString.parse(search);
	const parsedFeedbackState = parsed.tila
		? !Array.isArray(parsed.tila)
			? [parsed.tila]
			: parsed.tila
		: undefined;

	const searchFilters: SearchFilters = {
		tila: parsedFeedbackState as string[],
		name: parsed.name as string,
	};

	const optionState: FilterOption[] = [
		{
			name: FeedbackState.OPEN,
			label: "Avoin",
			type: "checkbox",
			checked: searchFilters.tila
				? searchFilters.tila.includes(
						mapFeedbackStateString[FeedbackState.OPEN],
				  )
				: false,
		},
		{
			name: FeedbackState.APPROVED,
			label: "Hyväksytty",
			type: "checkbox",
			checked: searchFilters.tila
				? searchFilters.tila.includes(
						mapFeedbackStateString[FeedbackState.APPROVED],
				  )
				: false,
		},
		{
			name: FeedbackState.REJECTED,
			label: "Hylätty",
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
					mapFeedbackStateString[result.state],
				);
			}

			return result;
		});

		setFilteredResults(filterResults);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, history, results]);

	const markAsApproved = (id: string): void => {
		const feedbackItem = results.find(result => result.id === id);

		if (feedbackItem) {
			feedbackItem.state = FeedbackState.APPROVED;

			const newResults = [...results];

			const itemIndex = newResults.findIndex(result => result.id === id);

			newResults[itemIndex] = feedbackItem as OpenFeedback;

			setResults(newResults);
		}
	};
	const markAsRejected = (id: string): void => {
		if (results) {
			const feedbackItem = results.find(result => result.id === id);

			if (feedbackItem) {
				feedbackItem.state = FeedbackState.REJECTED;

				const newResults = [...results];

				const itemIndex = newResults.findIndex(
					result => result.id === id,
				);

				newResults[itemIndex] = feedbackItem as OpenFeedback;

				setResults(newResults);
			}
		}
	};

	const markAllOpenAsApproved = (): void => {
		const newResults = [...results].map(result => {
			if (result.state === FeedbackState.OPEN) {
				return {
					...result,
					state: FeedbackState.APPROVED,
				};
			}

			return result;
		});

		setResults(newResults);
	};

	const submitForm = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		const openCases = results.some(
			result => result.state === FeedbackState.OPEN,
		);

		if (openCases) {
			console.log("ERROR");
		} else {
			setHasOpenCases(openCases);
			console.log(results);
		}
	};

	const filterElements = (
		<FilterItem
			label="Palautteen tila"
			prefix="state"
			value={
				searchFilters.tila
					? searchFilters.tila.length <= 2
						? searchFilters.tila.join(", ")
						: `${searchFilters.tila.length} valintaa`
					: null
			}
			values={optionState}
			ariaLabel="Valitse palautteen tila"
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
				history.push("/valvonta/avoin-palaute?" + stringfield);
			}}
			onReset={(): void => {
				const newSearchFilters = {
					...searchFilters,
					tila: undefined,
				};
				const stringfield = queryString.stringify(newSearchFilters);
				history.push("/valvonta/avoin-palaute?" + stringfield);
			}}
		/>
	);

	return (
		<div>
			<div className="filters">
				<div className="filters-text">Rajaa tuloksia</div>
				{filterElements}
			</div>
			{results ? (
				<div className="page-open-feedback-results">
					<h1 className="feedback-results-heading">
						Avoimet palautteet
					</h1>
					<button
						className="btn check-all-results"
						onClick={markAllOpenAsApproved}
					>
						Hyväksy kaikki avoimet
					</button>
					<form onSubmit={submitForm}>
						<ul className="feedback-results-list">
							{filteredResults.map(result => {
								return (
									<li
										className="feedback-results-list-item"
										key={result.id}
									>
										<div className="feedback-result-answer">
											<textarea
												className={
													result.state ===
													FeedbackState.APPROVED
														? "approved"
														: result.state ===
														  FeedbackState.REJECTED
														? "rejected"
														: ""
												}
												rows={7}
												value={result.answer}
												readOnly={true}
											></textarea>
										</div>
										<div className="feedback-result-actions">
											<button
												type="button"
												className={
													result.state ===
													FeedbackState.REJECTED
														? "btn unchecked"
														: "btn"
												}
												onClick={() => {
													markAsApproved(result.id);
												}}
											>
												Hyväksy
											</button>
											<button
												type="button"
												className={
													result.state ===
													FeedbackState.APPROVED
														? "btn unchecked"
														: "btn"
												}
												onClick={() => {
													markAsRejected(result.id);
												}}
											>
												Hylkää
											</button>
										</div>
									</li>
								);
							})}
						</ul>
						<div className="nav-save">
							<button
								type="button"
								className="cancel"
								onClick={event => {
									event.preventDefault();

									history.push("/valvonta");
								}}
							>
								Peruuta
							</button>
							<button type="submit" className="btn submit">
								Tallenna
							</button>
						</div>
					</form>
				</div>
			) : null}
		</div>
	);
};

export default PageOpenFeedbackResults;
