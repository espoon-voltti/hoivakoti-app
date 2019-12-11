import React, { FC, useState } from "react";
import "../styles/landing.scss";
import { useT } from "../i18n";
import { useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import FilterItem, { FilterOption } from "./FilterItem";
import queryString from "query-string";

const PageLanding: FC = () => {
	const history = useHistory();
	const locationPickerLabel = useT("locationPickerLabel");
	const locationPickerPlaceholder = useT("locationPickerPlaceholder");
	const linkBacktoTop = useT("linkBacktoTop");
	const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

	const espooAreas = [
		useT("espoon keskus"),
		useT("espoonlahti"),
		useT("leppävaara"),
		useT("matinkylä"),
		useT("tapiola"),
	];
	const otherCities = [
		useT("helsinki"),
		useT("hyvinkää"),
		useT("järvenpää"),
		useT("karjaa"),
		useT("karkkila"),
		useT("kerava"),
		useT("lohja"),
		useT("nurmijärvi"),
		useT("siuntio"),
		useT("tammisaari"),
		useT("tuusula"),
		useT("vantaa"),
		useT("vihti"),
	];

	const espooChecked = selectedAreas
		? selectedAreas.includes("Espoo")
		: false;
	const espooCheckboxItem: FilterOption = {
		name: "Espoo",
		label: "Espoo",
		type: "checkbox",
		checked: espooChecked,
		bold: true,
	};

	const optionsArea: FilterOption[] = [
		{ text: locationPickerLabel, type: "header" },
		espooCheckboxItem,
		...espooAreas.map<FilterOption>((value: string) => {
			const checked = selectedAreas
				? selectedAreas.includes(value)
				: false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				withMargin: true,
			};
		}),
		...otherCities.map<FilterOption>((value: string) => {
			const checked = selectedAreas
				? selectedAreas.includes(value)
				: false;
			return {
				name: value,
				label: value,
				type: "checkbox",
				checked: checked,
				bold: true,
				alignment: "right",
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
								if (!newValue) {
									// Normal flow: Remove district/city to search filters if
									// present
									newSelectedAreas = newSelectedAreas.filter(
										(value: string) => {
											return value !== name;
										},
									);

									// Weird flow to accommodate the Espoo special selection
									if (name === "Espoo")
										newSelectedAreas = newSelectedAreas.filter(
											(value: string) => {
												if (espooAreas.includes(value))
													return false;
												return true;
											},
										);
									else if (espooAreas.includes(name))
										newSelectedAreas = newSelectedAreas.filter(
											(value: string) => {
												return value !== "Espoo";
											},
										);
									// If the district/city was checked
								} else {
									// Normal flow: Add district/city to search filters if
									// not already added
									if (!newSelectedAreas.includes(name))
										newSelectedAreas.push(name);

									// Weird flow to accommodate the Espoo special selection
									if (name === "Espoo")
										for (
											let i = 0;
											i < espooAreas.length;
											i++
										) {
											const district = espooAreas[i];
											if (
												!newSelectedAreas.includes(
													district,
												)
											)
												newSelectedAreas.push(district);
										}
									else if (espooAreas.includes(name)) {
										let included = 0;
										for (
											let i = 0;
											i < espooAreas.length;
											i++
										) {
											const district = espooAreas[i];
											if (
												newSelectedAreas.includes(
													district,
												)
											)
												included++;
										}
										if (included === espooAreas.length) {
											newSelectedAreas.push("Espoo");
										}
									}
								}
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
							rel="noopener noreferrer external"
						>
							{useT("linkServiceVoucher")}
						</a>
						? {useT("landingServiceVoucher2")}{" "}
						<a
							href={useT("urlParastapalvelua")}
							target="_blank"
							rel="noopener noreferrer external"
						>
							www.parastapalvelua.fi
						</a>
						.
					</p>
					<p>{useT("landingOwnMoney")}</p>
				</section>

				<section className="content-block content-block--wide">
					<h2>{useT("decisionStepsHeadline")}</h2>
					<div className="process-diagram">
						<div className="process-diagram__item">
							<div className="process-diagram__item__img">
								<img src="/icons/icon-contact.svg" alt="" />
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
								<img src="/icons/icon-meeting.svg" alt="" />
							</div>
							<h3>{useT("decisionStep2Headline")}</h3>
							<p>{useT("decisionStep2Text")}</p>
						</div>
						<div className="process-diagram__item">
							<div className="process-diagram__item__img">
								<img src="/icons/icon-decision.svg" alt="" />
							</div>
							<h3>{useT("decisionStep3Headline")}</h3>
							<p>{useT("decisionStep3Text")}</p>
						</div>
					</div>

					<p className="content-block-paragraph">
						<a
							href={useT("urlDecisionMoreInfo")}
							target="_blank"
							rel="noopener noreferrer external"
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
					<Trans i18nKey="defaultNamespace:serviceDescriptionText">
						<p></p>
						<p></p>
					</Trans>

					<h3 className="faqHeadline">
						{useT("faqSectionHeadline")}
					</h3>
					<dl className="faq-list">
						<dt>{useT("faqItem1Headline")}</dt>
						<dd>
							<Trans i18nKey="defaultNamespace:faqItem1Text">
								<p></p>
								<p></p>
							</Trans>
						</dd>
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
				<a className="backToTopLink" href="#pageTop">
					{linkBacktoTop}
				</a>
			</div>
		</div>
	);
};

export default PageLanding;
