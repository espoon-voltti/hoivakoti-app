/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "../styles/PageNursingHome.scss";
import config from "./config";
import axios from "axios";
import {
	GetNursingHomeResponse,
	NursingHome,
	NursingHomeImageName,
} from "./types";
import { MapSmall } from "./Map";
import { useT } from "../i18n";
import Lightbox from "./Lightbox";
import Title from "./Title";
import VacancyStatusBadge from "./VacancyStatusBadge";

interface ParagraphProps {
	title?: string;
	text?: string;
	className?: string;
}

const Paragraph: FC<ParagraphProps> = ({ title, text, className }) => {
	if (!text) return null;

	return (
		<>
			{title && (
				<p className="nursinghome-info-paragraph-title">{title}</p>
			)}
			<p className={className}>{text}</p>
		</>
	);
};

interface DefinitionItemProps {
	term?: string;
	definition?: string;
	classNameTerm?: string;
	classNameDefinition?: string;
}

const DefinitionItem: FC<DefinitionItemProps> = ({
	term,
	definition,
	classNameTerm,
	classNameDefinition,
}) => {
	if (!definition) return null;

	return (
		<>
			{term && <dt className={classNameTerm}>{term}</dt>}
			<dd className={classNameDefinition}>{definition}</dd>
		</>
	);
};

interface ParagraphLinkProps {
	text?: string;
	to?: string;
}

const ParagraphLink: FC<ParagraphLinkProps> = ({ text, to }) => {
	if (!to) return null;
	return (
		<p>
			<a href={to} target="_blank" rel="noreferrer noopener external">
				{text || to}
			</a>
		</p>
	);
};

interface ImageProps {
	nursingHome: NursingHome | null;
	imageName: NursingHomeImageName | null | undefined;
	className?: string;
	alt?: string;
	placeholder?: JSX.Element;
	variant?: "img" | "background";
	onClick?: () => void;
}

export const Image: FC<ImageProps> = ({
	nursingHome,
	imageName,
	className,
	alt,
	placeholder = null,
	variant = "img",
	onClick,
}) => {
	if (!imageName || !nursingHome || !nursingHome.pic_digests)
		return placeholder;
	const digest: string = (nursingHome.pic_digests as any)[
		`${imageName}_hash`
	];
	if (!digest) return placeholder;
	const srcUrl = `${config.API_URL}/nursing-homes/${nursingHome.id}/pics/${imageName}/${digest}`;
	if (variant === "img")
		return (
			<img
				src={srcUrl}
				className={className}
				alt={alt}
				onClick={onClick}
			/>
		);
	else
		return (
			<div className={className} onClick={onClick}>
				<div
					className="nursinghome-img-inner"
					style={{
						backgroundImage: `url(${srcUrl})`,
					}}
				/>
			</div>
		);
};

interface NursingHomeDetailsBoxProps {
	nursingHome: NursingHome;
	className?: string;
	id?: string;
}

const NursingHomeDetailsBox: FC<NursingHomeDetailsBoxProps> = ({
	nursingHome,
	className,
	id,
}) => {
	const contactInfo = useT("contactInfo");
	const directions = useT("directions");
	const webpage = useT("webpage");
	const visitingInfo = useT("visitingInfo");
	const openReport = useT("openReport");
	const latestVisit = useT("latestVisit");
	const reportScoreHeader = useT("reportScoreLong");
	const giveReview = useT("giveReview");
	const readMore = useT("readMore");
	const feedbackCustomerReview = useT("feedbackCustomerReview");
	const feedbackRelativeReview = useT("feedbackRelativeReview");
	const feedbackNoReviews = useT("feedbackNoReviews");

	const surveyOption1 = useT("surveyOption1");
	const surveyOption2 = useT("surveyOption2");
	const surveyOption3 = useT("surveyOption3");
	const surveyOption4 = useT("surveyOption4");
	const surveyOption5 = useT("surveyOption5");

	const reportStatusOk = useT("status_ok_long");
	const reportStatusSmall = useT("status_small_issues_long");
	const reportStatusSignificant = useT("status_significant_issues_long");
	const reportStatusSurveillance = useT("status_surveillance_long");
	const reportStatusNoInfo = useT("status_no_info");

	const reportTypeAnnounced = useT("reportTypeAnnounced");
	const reportTypeUnannounced = useT("reportTypeUnannounced");
	const reportTypeConcern = useT("reportTypeConcern");

	let reportStatus = useT("status_waiting");
	let hasReport = false;

	const formatDate = (dateStr: string | null): string => {
		if (!dateStr) return "";
		console.log(dateStr);
		const date = new Date(dateStr);
		const YYYY = String(date.getUTCFullYear());
		const MM = String(date.getUTCMonth() + 1);
		const DD = String(date.getUTCDate());
		return `${DD}.${MM}.${YYYY}`;
	};

	const ratingToString = (rating: number | null): string => {
		let str = "";

		if (rating) {
			if (rating > 4.5) {
				str = surveyOption5;
			} else if (rating > 3.5) {
				str = surveyOption4;
			} else if (rating > 2.5) {
				str = surveyOption3;
			} else if (rating > 1.5) {
				str = surveyOption2;
			} else if (rating > 0.5) {
				str = surveyOption1;
			}
		}

		return str + " ";
	};

	const getTypeTranslation = (typeStr: string): string => {
		if (nursingHome) {
			switch (typeStr) {
				case "announced":
					return reportTypeAnnounced;
				case "audit":
					return reportTypeUnannounced;
				case "concern":
					return reportTypeConcern;
			}
		}
		return "";
	};

	if (nursingHome.report_status) {
		switch (nursingHome.report_status[0].status) {
			case "ok":
				reportStatus = reportStatusOk;
				hasReport = true;
				break;
			case "small":
				reportStatus = reportStatusSmall;
				hasReport = true;
				break;
			case "significant":
				reportStatus = reportStatusSignificant;
				hasReport = true;
				break;
			case "surveillance":
				reportStatus = reportStatusSurveillance;
				hasReport = true;
				break;
			case "no-info":
				reportStatus = reportStatusNoInfo;
				break;
		}
	}

	const reports: JSX.Element[] | null =
		nursingHome.report_status &&
		nursingHome.report_status.map((status, index) => (
			<div className={hasReport ? "" : "report_hidden"} key={index}>
				<p className={"report_info_item"}>
					{getTypeTranslation(status.type)} {formatDate(status.date)}
				</p>

				<a
					href={`/api/nursing-homes/${nursingHome.id}
						/raportti/${index}/Valvontaraportti-${nursingHome.owner}
						-${nursingHome.name}-${formatDate(status.date)}.pdf`}
					target="_blank"
					rel="noopener noreferrer"
					className="btn-secondary-link"
				>
					{openReport}
				</a>
			</div>
		));

	return (
		<>
			{id && <div id={id} />}
			<div className={className}>
				{
					<Link
						to={`/hoivakodit/${nursingHome.id}/anna-arvio`}
						className="nursinghome-details-box-survey-link"
					>
						<button className="btn report_info_btn">
							{giveReview}
						</button>
					</Link>
				}
				<div className="nursinghome-details-box-section">
					<Image
						nursingHome={nursingHome}
						imageName="owner_logo"
						className="nursinghome-details-logo"
						alt="Omistajan logo"
					/>
					<h4 className="nursinghome-details-name">
						{nursingHome.name}
					</h4>
					<a
						href={`https://www.google.com/maps/search/${
							nursingHome.name
						}/@${nursingHome.geolocation.center.join(",")}z`}
						target="_blank"
						rel="noreferrer noopener external"
						className="mapLink"
					>
						<MapSmall nursingHome={nursingHome} />
					</a>

					<dl className="nursingHome-info-list nursingHome-info-list--contact">
						<dt>{contactInfo}</dt>
						<dd>
							{nursingHome.address}, {nursingHome.postal_code}{" "}
							{nursingHome.city}
						</dd>
						<dd>
							<a
								href={nursingHome.www}
								target="_blank"
								rel="noopener noreferrer external"
							>
								{webpage}
							</a>
						</dd>
						<dd style={{ marginTop: 8 }}>
							<a href="#visitingInfo"> {visitingInfo}</a>
						</dd>
					</dl>

					<dl className="nursingHome-info-list nursingHome-info-list--directions">
						<dt>{directions}</dt>
						<dd>{nursingHome.arrival_guide_public_transit}</dd>
						<dd>{nursingHome.arrival_guide_car}</dd>
					</dl>
				</div>
				<div className="nursinghome-details-box-section">
					<div className="report_info_container">
						<div>
							<p>{feedbackCustomerReview}</p>
							<p>
								<span className="report_info_minor_header">
									{nursingHome.rating &&
									nursingHome.rating.average_relatives
										? ratingToString(
												nursingHome.rating
													.average_relatives,
										  )
										: feedbackNoReviews}
								</span>

								{nursingHome.rating &&
								nursingHome.rating.average_relatives
									? `${nursingHome.rating.average_relatives.toPrecision(
											2,
									  )} / 5`
									: ""}
							</p>
						</div>
						<div>
							<p>{feedbackRelativeReview}</p>
							<p>
								<span className="report_info_minor_header">
									{nursingHome.rating &&
									nursingHome.rating.average_relatives
										? ratingToString(
												nursingHome.rating
													.average_relatives,
										  )
										: feedbackNoReviews}
								</span>

								{nursingHome.rating &&
								nursingHome.rating.average_relatives
									? `${nursingHome.rating.average_relatives.toPrecision(
											2,
									  )} / 5`
									: ""}
							</p>
						</div>
						<Link
							to={`/hoivakodit/${nursingHome.id}/arviot`}
							className={
								nursingHome.rating &&
								nursingHome.rating.average_relatives
									? ""
									: "hidden"
							}
						>
							<button className="btn report_info_btn">
								{readMore}
							</button>
						</Link>
					</div>
				</div>
				<div className="nursinghome-details-box-section">
					<div className="report_info_container">
						<p className={hasReport ? "" : "hidden"}>
							{reportScoreHeader}
						</p>
						<p className="report_info_minor_header">
							{reportStatus}
						</p>
						{reports}
					</div>
				</div>
			</div>
		</>
	);
};

function getAvailablePics(nursingHome: NursingHome): [string, string][] | null {
	const { pic_digests = [] }: { pic_digests: any } = nursingHome;

	const availablePicHashes =
		nursingHome &&
		nursingHome.pic_digests &&
		Object.keys(nursingHome.pic_digests)
			.filter(name => pic_digests[name] !== null)
			.filter(hashName => hashName !== "owner_logo_hash");

	if (!availablePicHashes || availablePicHashes.length === 0) return null;

	const availablePics = availablePicHashes.map<[string, string]>(hashName => {
		const imageName = hashName.replace("_hash", "");
		const digest: string = pic_digests[imageName];
		return [imageName, digest];
	});

	return availablePics;
}

interface NursingHomeRouteParams {
	id: string;
}

const PageNursingHome: FC = () => {
	const { id } = useParams<NursingHomeRouteParams>();

	const location = useLocation();

	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [picCaptions, setPicCaptions] = useState<Record<
		string,
		string
	> | null>(null);
	const [lightboxState, setLightboxState] = useState<"hidden" | number>(
		"hidden",
	);

	useEffect(() => {
		axios
			.get(`${config.API_URL}/nursing-homes/${id}`)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	useEffect(() => {
		axios
			.get(`${config.API_URL}/nursing-homes/${id}/pics/captions`)
			.then((response: { data: Record<string, string> }) => {
				setPicCaptions(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	const linkBacktoList = useT("linkBacktoList");

	const anchorDetailsBox = useT("anchorDetailsBox");

	const loadingText = useT("loadingText");
	const filterAraLabel = useT("filterAraLabel");
	const numApartments = useT("numApartments");
	const serviceLanguage = useT("serviceLanguage");

	const language = useT(nursingHome && (nursingHome.language as any));

	const linkBacktoTop = useT("linkBacktoTop");

	const basicInformation = useT("basicInformation");
	const owner = useT("owner");
	const yearofConst = useT("yearofConst");
	const apartmentSize = useT("apartmentSize");
	const apartmentFurnitureLabel = useT("apartmentFurnitureLabel");
	const apartmentFurnitureText = useT("apartmentFurnitureText");
	const rent = useT("rent");
	const checkRentWithNursingHome = useT("checkRentWithNursingHome");
	const LAHapartments = useT("LAHapartments");
	const foodHeader = useT("foodHeader");
	const cookingMethod = useT("cookingMethod");

	const foodMoreInfo = useT("foodMoreInfo");
	const linkMenu = useT("linkMenu");
	const activies = useT("activies");
	const outdoorActivies = useT("outdoorActivies");
	const visitingInfo = useT("visitingInfo");
	const accessibility = useT("accessibility");
	const personnel = useT("personnel");
	const otherServices = useT("otherServices");
	const nearbyServices = useT("nearbyServices");
	const monthShort = useT("monthShort");
	const btnShowImages = useT("btnShowImages");

	const linkMoreInfoOutdoor = useT("linkMoreInfoOutdoor");
	const linkMoreInfoActivies = useT("linkMoreInfoActivies");
	const linkMoreInfoPersonnel = useT("linkMoreInfoPersonnel");

	const filterYes = useT("filterYes");
	const filterNo = useT("filterNo");
	const filterARABoth = useT("filterARABoth");

	const availablePics = nursingHome && getAvailablePics(nursingHome);

	const images =
		nursingHome &&
		availablePics &&
		availablePics.map(([imageName, digest]) => {
			return {
				src:
					`${config.API_URL}/nursing-homes/${nursingHome.id}` +
					`/pics/${imageName}/${digest}`,
				caption:
					(picCaptions && picCaptions[`${imageName}_caption`]) ||
					null,
			};
		});

	const numPics = availablePics
		? availablePics.length >= 5
			? 5
			: availablePics.length >= 3
			? 3
			: 1
		: 0;

	const heroPics =
		availablePics &&
		availablePics.length &&
		availablePics.slice(0, numPics);

	return (
		<div className="nursinghome-page-container">
			<Title title={nursingHome ? nursingHome.name : undefined} />
			{images && (
				<Lightbox
					state={lightboxState}
					onClose={() => setLightboxState("hidden")}
					images={images}
				/>
			)}
			<div className="nursinghome-hero-container">
				<div
					className={`nursinghome-hero nursinghome-hero-n${numPics}`}
				>
					{heroPics ? (
						heroPics.map(([imageName], idx) => (
							<Image
								key={imageName}
								nursingHome={nursingHome}
								imageName={imageName as NursingHomeImageName}
								className="nursinghome-hero-img"
								variant="background"
								placeholder={
									<div
										className={
											"nursinghome-hero-img " +
											"nursinghome-hero-placeholder"
										}
									/>
								}
								onClick={() => setLightboxState(idx)}
							/>
						))
					) : (
						<div className="nursinghome-hero-placeholder" />
					)}
				</div>
				{images && (
					<button
						onClick={() => setLightboxState(0)}
						className="nursinghome-hero-lightbox-button"
					>
						{btnShowImages}
					</button>
				)}
			</div>
			{!nursingHome ? (
				loadingText
			) : (
				<div className="nursinghome-info-container">
					<div className="nursinghome-info">
						<Link
							to={
								("/hoivakodit" +
									(location.state
										? location.state.fromFilterQuery
										: "")) as string
							}
							className="nursinghome-back-link"
						>
							{linkBacktoList}
						</Link>
						<h2 className="nursinghome-title">
							{nursingHome.name}
						</h2>

						<div className="nursinghomeDistrict-container">
							<Paragraph
								className="nursinghomeDistrict"
								text={`${
									nursingHome.district != null
										? nursingHome.district + ", "
										: ""
								} ${nursingHome.city}`}
							/>

							<a
								className="nursinghome-anchor-details"
								href="#yhteystiedot"
							>
								{anchorDetailsBox}
							</a>
						</div>

						<VacancyStatusBadge
							vacancyStatus={nursingHome.has_vacancy}
							className="nursinghome-title-vacancy-status-badge"
						/>

						<Paragraph text={nursingHome.summary} />

						<h3>{basicInformation}</h3>
						<dl className="nursingHome-info-list">
							<DefinitionItem
								term={owner}
								definition={nursingHome.owner}
							/>
							<DefinitionItem
								term={filterAraLabel}
								definition={
									nursingHome.ara === "Kyllä"
										? filterYes
										: nursingHome.ara === "Ei"
										? filterNo
										: filterARABoth
								}
							/>
							<DefinitionItem
								term={yearofConst}
								definition={String(
									nursingHome.construction_year,
								)}
							/>
							<DefinitionItem
								term={numApartments}
								definition={`${nursingHome.apartment_count}`}
							/>
							<DefinitionItem
								term={apartmentSize}
								definition={`${nursingHome.apartment_square_meters} m²`}
							/>
							<DefinitionItem
								term={apartmentFurnitureLabel}
								definition={apartmentFurnitureText}
							/>
							<DefinitionItem
								term={rent}
								definition={`${checkRentWithNursingHome} ${nursingHome.rent}€ / ${monthShort}`}
							/>

							<DefinitionItem
								term={serviceLanguage}
								definition={language}
							/>
							<DefinitionItem
								term={LAHapartments}
								definition={
									nursingHome.lah ? filterYes : filterNo
								}
							/>
						</dl>
						<h3>{foodHeader}</h3>
						<dl className="nursingHome-info-list">
							<DefinitionItem
								term={cookingMethod}
								definition={nursingHome.meals_preparation}
							/>
							<DefinitionItem
								term={foodMoreInfo}
								definition={nursingHome.meals_info}
							/>
						</dl>
						<ParagraphLink
							text={linkMenu}
							to={nursingHome.menu_link}
						/>
						<h3>{activies}</h3>
						<Paragraph text={nursingHome.activities_info} />
						<ParagraphLink
							text={linkMoreInfoActivies}
							to={nursingHome.activities_link}
						/>
						<h3>{outdoorActivies}</h3>
						<Paragraph
							text={nursingHome.outdoors_possibilities_info}
						/>
						{nursingHome.outdoors_possibilities_link && (
							<>
								<a
									href={
										nursingHome.outdoors_possibilities_link
									}
									target="_blank"
									rel="noreferrer noopener external"
								>
									{linkMoreInfoOutdoor}
								</a>
							</>
						)}

						<h3 id="visitingInfo">{visitingInfo}</h3>
						<Paragraph text={nursingHome.tour_info} />
						<dl className="nursingHome-info-list nursingHome-info-list--contact">
							<dt>{nursingHome.contact_name}</dt>
							<dd>{nursingHome.contact_title}</dd>
							<dd>Puh. {nursingHome.contact_phone}</dd>
							<dd>
								<a href={"mailto:" + nursingHome.email}>
									{nursingHome.email}
								</a>
							</dd>
							<dd>
								<br />
							</dd>
							<dd>{nursingHome.contact_phone_info}</dd>
						</dl>
						<h3>{accessibility}</h3>
						<Paragraph text={nursingHome.accessibility_info} />
						<h3>{personnel}</h3>
						<Paragraph text={nursingHome.staff_info} />

						{nursingHome.staff_satisfaction_info && (
							<>
								<a
									href={nursingHome.staff_satisfaction_info}
									target="_blank"
									rel="noreferrer noopener external"
								>
									{linkMoreInfoPersonnel}
								</a>
							</>
						)}

						{nursingHome.other_services && (
							<>
								<h3>{otherServices}</h3>
								<Paragraph text={nursingHome.other_services} />
							</>
						)}
						<h3>{nearbyServices}</h3>
						<Paragraph text={nursingHome.nearby_services} />
					</div>

					<NursingHomeDetailsBox
						nursingHome={nursingHome}
						id="yhteystiedot"
						className="nursinghome-details-box"
					/>
				</div>
			)}
			<a className="backToTopLink" href="#pageTop">
				{linkBacktoTop}
			</a>
		</div>
	);
};

export default PageNursingHome;
