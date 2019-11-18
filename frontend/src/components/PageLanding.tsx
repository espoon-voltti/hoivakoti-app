import React, { FC, useState, ChangeEvent } from "react";
import "../styles/landing.scss";
import { useT, Language, useCurrentLanguage } from "../translations";
import { useHistory } from "react-router-dom";

type Area = "Espoon keskus" | "Espoonlahti" | "Leppävaara" | "Matinkylä" | "Tapiola";

const areas: Area[] = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

const PageLanding: FC = () => {
	const history = useHistory();

	const [selectedArea, setSelectedArea] = useState<Area | null>(areas[0]);

	const handleSelectArea = (event: ChangeEvent<HTMLSelectElement>): void => {
		const area = event.target.value as Area;
		setSelectedArea(area);
	};

	return (
		<div id="landing">
			<div className="jumbotron">
				<h2 className="jumbotron__header">{useT("jumbotronHeadline")}</h2>

				<div className="location-picker">
					<div className="location-picker-label">{useT("locationPickerLabel")}</div>
					<div className="location-picker-select">
						<select onChange={handleSelectArea}>
							{areas.map(area => (
								<option value={area} key={area}>
									{area}
								</option>
							))}
						</select>
					</div>
					<button
						className="btn landing-cta"
						onClick={(): void => {
							const query = selectedArea ? `?alue=${selectedArea}` : "";
							const url = `/hoivakodit${query}`;
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
						{useT("landingIngress1")}
					</p>
					<p className="ingress">
						{useT("landingIngress2")}{" "}
						<a href={useT("urlParastapalvelua")} target="_blank" rel="noopener noreferrer">
							www.parastapalvelua.fi
						</a>
					</p>
				</section>

				<section className="content-block">
					<h2>{useT("whatisNursinghomeHeadline")}</h2>
					<p>{useT("whatisNursinghomeText")}</p>
				</section>

				<section className="content-block">
					<div className="apply-process">
						<h2>{useT("decisionStepsHeadline")}</h2>
						<div>
							<h3>{useT("decisionStep1Headline")}</h3>
							<p>{useT("decisionStep1Text")}</p>
						</div>
						<div>
							<h3>{useT("decisionStep2Headline")}</h3>
							<p>{useT("decisionStep2Text")}</p>
						</div>
						<div>
							<h3>{useT("decisionStep3Headline")}</h3>
							<p>{useT("decisionStep3Text")}</p>
						</div>
					</div>
					
					<p><a href={useT("urlDecisionMoreInfo")} target="_blank">{useT("decisionMoreInfo")}</a></p>
				</section>

				<section className="content-block">
					<h2>{useT("selectingHeadline")}</h2>
					<p>{useT("selectingText")}</p>
				</section>

				<section className="content-block">
					<h2>{useT("serviceDescriptionHeadline")}</h2>
					<p>{useT("serviceDescriptionText")}</p>
					<p><a href={useT("urlServiceDescription")}target="_blank">{useT("serviceDescriptionLink")}</a></p>

					<h3 className="faqHeadline">{useT("faqSectionHeadline")}</h3>
					<dl className="faq-list">
						<dt>{useT("faqItem1Headline")}</dt>
						<dd>{useT("faqItem1Text")}</dd>
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
						<dt>{useT("faqItem11Headline")}</dt>
						<dd>{useT("faqItem11Text")}</dd>
						<dt>{useT("faqItem12Headline")}</dt>
						<dd>{useT("faqItem12Text")}</dd>
					</dl>
				</section>
			</div>
		</div>
	);
};

export default PageLanding;
