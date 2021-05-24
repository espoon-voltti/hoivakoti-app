import React, { FC, useState } from "react";
import "../styles/landing.scss";
import { useT } from "../i18n";
import { useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import FilterItem, { FilterOption } from "./FilterItem";
import queryString from "query-string";
import { Translation } from "../shared/types/translation";
import Commune from "../shared/types/commune";

const PageLanding: FC = () => {
	const history = useHistory();

	const locationPickerPlaceholder = useT("locationPickerPlaceholder");
	const linkBacktoTop = useT("linkBacktoTop");
	const [selectedCommune, setSelectedCommune] = useState<string | null>(null);

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
	const contactItemEspoo = useT("contactItemEspoo");
	const contactItemKirkkonummi = useT("contactItemKirkkonummi");
	const contactItemKauniainen = useT("contactItemKauniainen");
	const contactItemLohja = useT("contactItemLohja");
	const contactItemHanko = useT("contactItemHanko");
	const contactItemKarviainen = useT("contactItemKarviainen");
	const contactItemInkoo = useT("contactItemInkoo");
	const contactItemRaasepori = useT("contactItemRaasepori");
	const contactItemSiuntio = useT("contactItemSiuntio");

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

	const surveillanceTitle = useT("surveillanceTitle");
	const surveillanceDescription = useT("surveillanceDescription");

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
	const faq8Title = useT("faq8Title");
	const faq8Content = useT("faq8Content");
	const faq9Title = useT("faq9Title");
	const faq9Content = useT("faq9Content");

	const selectCommuneLabel = useT("selectCommuneLabel");
	const filterCommune = useT("filterCommune");
	const communePickerLabel = useT("communePickerLabel");

	const contactItems = [
		contactItemEspoo,
		contactItemKirkkonummi,
		contactItemKauniainen,
		contactItemLohja,
		contactItemHanko,
		contactItemKarviainen,
		contactItemInkoo,
		contactItemRaasepori,
		contactItemSiuntio,
	];

	const LUCommunes: Translation = {
		[Commune.EPO]: useT("espoo"),
		[Commune.HNK]: useT("hanko"),
		[Commune.INK]: useT("inkoo"),
		[Commune.KAU]: useT("kauniainen"),
		[Commune.PKA]: useT("karviainen"),
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.STO]: useT("siuntio"),
	};

	const optionsCustomerCommune: FilterOption[] = [
		{ text: selectCommuneLabel, type: "header" },
		...Object.keys(LUCommunes).map<FilterOption>(key => {
			const value = LUCommunes[key];

			const checked = selectedCommune
				? selectedCommune.includes(value)
				: false;

			return {
				name: value,
				label: value,
				type: "radio",
				checked: checked,
			};
		}),
	];

	const filterText =
		selectedCommune !== "" ? selectedCommune : locationPickerPlaceholder;

	return (
		<div id="landing">
			<div className="jumbotron">
				<h2 className="jumbotron__header">
					{useT("jumbotronHeadline")}
				</h2>

				<div className="location-picker">
					<div className="location-picker-label">
						{communePickerLabel}
					</div>
					<div className="location-picker-select">
						<FilterItem
							prefix="commune"
							label=""
							value={filterText}
							values={optionsCustomerCommune}
							ariaLabel={filterCommune}
							dropdownVariant="subtle"
							onChange={({ name }) => {
								setSelectedCommune(name);
							}}
							onReset={(): void => {
								setSelectedCommune(null);
							}}
						/>
					</div>
					<button
						className="btn landing-cta"
						onClick={(): void => {
							let query = "";

							if (selectedCommune) {
								query = queryString.stringify({
									kotikunta: selectedCommune,
								});
							}

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
						{contactItems.map((item, index) => (
							<li
								key={`contact-item-${index}`}
								dangerouslySetInnerHTML={{ __html: item }}
							></li>
						))}
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
				<section className="content-block" id="surveillance">
					<h2>{surveillanceTitle}</h2>
					<p>{surveillanceDescription}</p>
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
						<dt>{faq9Title}</dt>
						<dd>
							<p>{faq9Content}</p>
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
