import React, { FC, useState } from "react";
import "../styles/landing.scss";
import { useT } from "../i18n";
import { useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import FilterItem, { FilterOption } from "./FilterItem";
import queryString from "query-string";

type Area =
	| "Espoon keskus"
	| "Espoonlahti"
	| "Leppävaara"
	| "Matinkylä"
	| "Tapiola";

const areas: Area[] = [
	"Espoon keskus",
	"Espoonlahti",
	"Leppävaara",
	"Matinkylä",
	"Tapiola",
];

const PageLanding: FC = () => {
	const history = useHistory();
	const locationPickerLabel = useT("locationPickerLabel");
	const locationPickerPlaceholder = useT("locationPickerPlaceholder");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		...areas.map<FilterOption>((value: Area) => {
			const checked = selectedAreas
				? selectedAreas.includes(value)
				: false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
			};
		}),
	];

	const filterSelections = useT("filterSelections");

	const filterText: string | null =
		selectedAreas.length !== 0
			? selectedAreas.length <= 2
				? selectedAreas.join(", ")
				: `${selectedAreas.length} ${filterSelections}`
			: locationPickerPlaceholder;

	return (
		<div id="landing">
			<div className="jumbotron">
				<h2 className="jumbotron__header">
					{useT("jumbotronHeadline")}
				</h2>

				<div className="location-picker">
					<div className="location-picker-label">
						{locationPickerLabel}
					</div>
					<div className="location-picker-select">
						<FilterItem
							prefix=""
							value={filterText}
							values={optionsArea}
							ariaLabel="Valitse hoivakodin alue"
							dropdownVariant="subtle"
							onChange={({ newValue, name }) => {
								let newSelectedAreas = selectedAreas
									? [...selectedAreas]
									: [];
								if (!newValue)
									newSelectedAreas = newSelectedAreas.filter(
										(value: string) => {
											return value !== name;
										},
									);
								else if (!newSelectedAreas.includes(name))
									newSelectedAreas.push(name);
								setSelectedAreas(newSelectedAreas);
							}}
							onReset={(): void => {
								setSelectedAreas([]);
							}}
						/>
					</div>
					<button
						className="btn landing-cta"
						onClick={(): void => {
							const query = queryString.stringify({
								alue: selectedAreas,
							});
							const url = `/hoivakodit?${query}`;
							history.push(url);
						}}
					>
						{useT("jumbotronBtn")}
					</button>
				</div>
			</div>

			<div className="content-column">
				<section className="content-block">
					<p className="ingress">
						<Trans i18nKey="defaultNamespace:landingIngress1">
							<strong></strong>
							<strong></strong>
						</Trans>
					</p>
				</section>

				<section className="content-block">
					<h2>{useT("whatisNursinghomeHeadline")}</h2>
					<p>{useT("whatisNursinghomeText")}</p>

					<p>
						{useT("landingServiceVoucher1")}{" "}
						<a
							href={useT("urlServiceVoucher")}
							target="_blank"
							rel="noopener noreferrer"
						>
							{useT("linkServiceVoucher")}
						</a>

						{" "}{useT("landingServiceVoucher2")}{" "}
						<a
							href={useT("urlParastapalvelua")}
							target="_blank"
							rel="noopener noreferrer"
						>
							www.parastapalvelua.fi
						</a>.
					</p>
					<p>{useT("landingOwnMoney")}</p>
				</section>

				<section className="content-block content-block--wide">
					<h2>{useT("decisionStepsHeadline")}</h2>
					<div className="process-diagram">
						<div className="process-diagram__item">
							<div className="process-diagram__item__img">
								<img src="/icon-contact.svg" alt="" />
							</div>
							<h3>{useT("decisionStep1Headline")}</h3>
							<p>
								{/* {useT("decisionStep1Text")} */}
								<Trans i18nKey="defaultNamespace:decisionStep1Text">
									<span className="no-wrap"></span>
								</Trans>
							</p>
						</div>
						<div className="process-diagram__item">
							<div className="process-diagram__item__img">
								<img src="/icon-meeting.svg" alt="" />
							</div>
							<h3>{useT("decisionStep2Headline")}</h3>
							<p>{useT("decisionStep2Text")}</p>
						</div>
						<div className="process-diagram__item">
							<div className="process-diagram__item__img">
								<img src="/icon-decision.svg" alt="" />
							</div>
							<h3>{useT("decisionStep3Headline")}</h3>
							<p>{useT("decisionStep3Text")}</p>
						</div>
					</div>

					<p className="content-block-paragraph">
						<a
							href={useT("urlDecisionMoreInfo")}
							target="_blank"
							rel="noopener noreferrer"
						>
							{useT("decisionMoreInfo")}
						</a>
					</p>
				</section>

				<section className="content-block">
					<h2>{useT("selectingHeadline")}</h2>
					<Trans i18nKey="defaultNamespace:selectingText">
							<p></p>
							<p></p>
						</Trans>
				</section>

				<section className="content-block">
					<h2>{useT("serviceDescriptionHeadline")}</h2>
					<p>{useT("serviceDescriptionText")}</p>

					<h3 className="faqHeadline">
						{useT("faqSectionHeadline")}
					</h3>
					<dl className="faq-list">
						<dt>{useT("faqItem1Headline")}</dt>
						<dd><Trans i18nKey="defaultNamespace:faqItem1Text">
							<p></p>
							<p></p>
						</Trans></dd>
						<dt>{useT("faqItem2Headline")}</dt>
						<dd>{useT("faqItem2Text")}</dd>
						<dt>{useT("faqItem3Headline")}</dt>
						<dd>{useT("faqItem3Text")}</dd>
						<dt>{useT("faqItem4Headline")}</dt>
						<dd>{useT("faqItem4Text")}</dd>
						<dt>{useT("faqItem5Headline")}</dt>
						<dd>{useT("faqItem5Text")}</dd>
						<dt>{useT("faqItem6Headline")}</dt>
						<dd>{useT("faqItem6Text")}</dd>
						<dt>{useT("faqItem7Headline")}</dt>
						<dd>{useT("faqItem7Text")}</dd>
						<dt>{useT("faqItem8Headline")}</dt>
						<dd>{useT("faqItem8Text")}</dd>
						<dt>{useT("faqItem9Headline")}</dt>
						<dd>{useT("faqItem9Text")}</dd>
						<dt>{useT("faqItem10Headline")}</dt>
						<dd>{useT("faqItem10Text")}</dd>
					</dl>
				</section>
			</div>
		</div>
	);
};

export default PageLanding;
