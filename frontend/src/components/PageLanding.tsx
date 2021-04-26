import React, { FC, useState } from "react";
import "../styles/landing.scss";
import { useT } from "../i18n";
import { Link, useHistory } from "react-router-dom";
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
		useT("karkkila"),
		useT("kerava"),
		useT("kirkkonummi"),
		useT("lohja"),
		useT("nurmijärvi"),
		useT("raasepori"),
		useT("siuntio"),
		useT("sipoo"),
		useT("tuusula"),
		useT("vantaa"),
		useT("vihti"),
	];

	// LU translation
	const homepageHeading = useT("homepageHeading");
	const homepageIngress = useT("homepageIngress");
	const homepageAnchor1 = useT("homepageAnchor1");
	const homepageAnchor2 = useT("homepageAnchor2");
	const homepageAnchor3 = useT("homepageAnchor3");
	const whoAreServicesForTitle = useT("whoAreServicesForTitle");
	const howToApplyTitle = useT("howToApplyTitle");
	const howToApplyDesc = useT("howToApplyDesc");
	const contactDesc = useT("contactDesc");
	const howToPickTitle = useT("howToPickTitle");
	const howToPickContent1 = useT("howToPickContent1");
	const howToPickContent2 = useT("howToPickContent2");
	const howToPickContent3 = useT("howToPickContent3");
	const howToPickContent4 = useT("howToPickContent4");

	const whatServicesIncludesTitle = useT("whatServicesIncludesTitle");
	const whatServicesIncludesContent1 = useT("whatServicesIncludesContent1");
	const whatServicesIncludesContent2 = useT("whatServicesIncludesContent2");
	const whatServicesIncludesContent3 = useT("whatServicesIncludesContent3");
	const whatServicesIncludesContent4 = useT("whatServicesIncludesContent4");
	const whatServicesIncludesContent5 = useT("whatServicesIncludesContent5");

	const paymentsTitle = useT("paymentsTitle");
	const paymentsContent = useT("paymentsContent");

	const homepageFaqTitle = useT("homepageFaqTitle");
	const faq1Title = useT("faq1Title");
	const faq2Title = useT("faq2Title");
	const faq2Content = useT("faq2Content");
	const faq3Title = useT("faq3Title");
	const faq3Content = useT("faq3Content");
	const faq4Title = useT("faq4Title");
	const faq4Content = useT("faq4Content");
	const faq5Title = useT("faq5Title");
	const faq5Content = useT("faq5Content");
	const faq6Title = useT("faq6Title");
	const faq6Content = useT("faq6Content");
	const faq7Title = useT("faq7Title");
	const faq7Content = useT("faq7Content");
	const faq8Title = useT("faq7Title");
	const faq8Content = useT("faq7Content");

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
							prefix="location"
							label=""
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
					<h2>{homepageHeading}</h2>
					<p className="ingress">{homepageIngress}</p>
				</section>
				<section className="content-block">
					<div className="anchor-list">
						<a href="#contact-list" className="btn anchor-link">
							{homepageAnchor1}
						</a>
						<a href="#about-service" className="btn anchor-link">
							{homepageAnchor2}
						</a>
						<a href="#faq" className="btn anchor-link">
							{homepageAnchor3}
						</a>
					</div>
				</section>
				<section className="content-block">
					<h2>{whoAreServicesForTitle}</h2>
					<Trans i18nKey="defaultNamespace:whoAreServicesForContent">
						<p></p>
						<p></p>
					</Trans>
				</section>
				<section className="content-block" id="contact-list">
					<h2>{howToApplyTitle}</h2>
					<p>{howToApplyDesc}</p>
					<ol>
						<Trans i18nKey="defaultNamespace:howToApplySteps">
							<li></li>
							<li></li>
							<li></li>
						</Trans>
					</ol>
					<p>{contactDesc}</p>
					<ul>
						<Trans i18nKey="defaultNamespace:contactSteps">
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
						</Trans>
					</ul>
				</section>
				<section className="content-block">
					<h2>{howToPickTitle}</h2>
					<p>{howToPickContent1}</p>
					<p>{howToPickContent2}</p>
					<p>{howToPickContent3}</p>
					<p
						dangerouslySetInnerHTML={{ __html: howToPickContent4 }}
					></p>
				</section>
				<section className="content-block" id="about-service">
					<h2>{whatServicesIncludesTitle}</h2>
					<p
						dangerouslySetInnerHTML={{
							__html: whatServicesIncludesContent1,
						}}
					></p>
					<p>{whatServicesIncludesContent2}</p>
					<p>{whatServicesIncludesContent3}</p>
					<p>{whatServicesIncludesContent4}</p>
					<p>{whatServicesIncludesContent5}</p>
				</section>
				<section className="content-block">
					<h2>{paymentsTitle}</h2>
					<p>{paymentsContent}</p>
				</section>
				<section className="content-block" id="faq">
					<h3>{homepageFaqTitle}</h3>
					<dl className="faq-list">
						<dt>{faq1Title}</dt>
						<dd>
							<Trans i18nKey="defaultNamespace:faq1Content">
								<p></p>
								<p></p>
								<p></p>
							</Trans>
						</dd>
						<dt>{faq2Title}</dt>
						<dd>
							<p>{faq2Content}</p>
						</dd>
						<dt>{faq3Title}</dt>
						<dd>
							<p>{faq3Content}</p>
						</dd>
						<dt>{faq4Title}</dt>
						<dd>
							<p>{faq4Content}</p>
						</dd>
						<dt>{faq5Title}</dt>
						<dd>
							<p>{faq5Content}</p>
						</dd>
						<dt>{faq6Title}</dt>
						<dd>
							<p>{faq6Content}</p>
						</dd>
						<dt>{faq7Title}</dt>
						<dd>
							<p>{faq7Content}</p>
						</dd>
						<dt>{faq8Title}</dt>
						<dd>
							<p>{faq8Content}</p>
						</dd>
						<dt>Voivatko läheiset ja omaiset yöpyä luonani?</dt>
						<dd>
							<p>
								Läheiset ja omaiset voivat tilapäisesti yöpyä
								luonasi. Sovithan yöpymisestä etukäteen
								hoivakodin kanssa.
							</p>
						</dd>
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
