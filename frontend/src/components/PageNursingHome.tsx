/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/PageNursingHome.scss";
import config from "./config";
import axios from "axios";
import { NursingHome, NursingHomeImageName } from "./types";
import { MapSmall } from "./Map";
import { useT } from "../translations";
import Lightbox from "./Lightbox";
import Title from "./Title";
import VacancyStatusBadge from "./VacancyStatusBadge";

function getAvailablePics(nursingHome: NursingHome): [string, string][] | null {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface GetNursingHomeResponse {
	data: NursingHome;
}

const PageNursingHome: FC = () => {
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [picCaptions, setPicCaptions] = useState<Record<
		string,
		string
	> | null>(null);
	const { id } = useParams();
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

	const availablePics = nursingHome && getAvailablePics(nursingHome);

	const linkBacktoList = useT("linkBacktoList");

	const anchorDetailsBox = useT("anchorDetailsBox");

	const loadingText = useT("loadingText");
	const filterAraLabel = useT("filterAraLabel");
	const numApartments = useT("numApartments");
	const serviceLanguage = useT("serviceLanguage");

	const basicInformation = useT("basicInformation");
	const owner = useT("owner");
	const yearofConst = useT("yearofConst");
	const apartmentSize = useT("apartmentSize");
	const apartmentFurnitureLabel = useT("apartmentFurnitureLabel");
	const apartmentFurnitureText = useT("apartmentFurnitureText");
	const rent = useT("rent");
	const LAHapartments = useT("LAHapartments");
	const foodHeader = useT("foodHeader");
	const cookingMethod = useT("cookingMethod");

	// const ownKitchen = useT("ownKitchen");
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

	const linkMoreInfoOutdoor = useT("linkMoreInfoOutdoor");
	const linkMoreInfoActivies = useT("linkMoreInfoActivies");
	const linkMoreInfoPersonnel = useT("linkMoreInfoPersonnel");

	// const filterFinnish = useT("filterFinnish");
	// const filterSwedish = useT("filterSwedish");
	const filterYes = useT("filterYes");
	const filterNo = useT("filterNo");

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
			<div className="nursinghome-hero">
				<Image
					nursingHome={nursingHome}
					imageName={nursingHome && nursingHome.pics[0]}
					className="nursinghome-hero-img nursinghome-hero-main"
					variant="background"
					placeholder={
						<div className="nursinghome-hero-placeholder" />
					}
					onClick={() => setLightboxState(0)}
				/>
				<div className="nursinghome-hero-extras-wrapper">
					<Image
						nursingHome={nursingHome}
						imageName={nursingHome && nursingHome.pics[1]}
						className="nursinghome-hero-img nursinghome-hero-extra"
						variant="background"
						placeholder={
							<div className="nursinghome-hero-placeholder" />
						}
						onClick={() => setLightboxState(1)}
					/>
					<Image
						nursingHome={nursingHome}
						imageName={nursingHome && nursingHome.pics[2]}
						className="nursinghome-hero-img nursinghome-hero-extra"
						variant="background"
						placeholder={
							<div className="nursinghome-hero-placeholder" />
						}
						onClick={() => setLightboxState(2)}
					/>
				</div>
				{images && (
					<button
						onClick={() => setLightboxState(0)}
						className="nursinghome-hero-lightbox-button"
					>
						Katso kuvat
					</button>
				)}
			</div>
			{!nursingHome ? (
				loadingText
			) : (
				<div className="nursinghome-info-container">
					<div className="nursinghome-info">
						<Link
							to="/hoivakodit"
							className="nursinghome-back-link"
						>
							{linkBacktoList}
						</Link>
						<h2 className="nursinghome-title">
							{nursingHome.name}
							<VacancyStatusBadge
								vacancyStatus={nursingHome.has_vacancy}
								className="nursinghome-title-vacancy-status-badge"
							/>
						</h2>
						<Paragraph
							text={`${nursingHome.district}, ${nursingHome.city}`}
						/>
						<Paragraph text={nursingHome.summary} />
						<p className="nursinghome-anchor-details">
							<a href="#yhteystiedot">{anchorDetailsBox}</a>
						</p>
						<h3>{basicInformation}</h3>
						<dl className="nursingHome-info-list">
							<DefinitionItem
								term={owner}
								definition={nursingHome.owner}
							/>
							<DefinitionItem
								term={filterAraLabel}
								definition={
									nursingHome.ara ? filterYes : filterNo
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
								definition={`${nursingHome.rent} € / ${monthShort}`}
							/>
							<DefinitionItem
								term={serviceLanguage}
								definition={nursingHome.language}
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
						<Paragraph
							title={linkMoreInfoOutdoor}
							text={nursingHome.outdoors_possibilities_link}
						/>
						<h3>{visitingInfo}</h3>
						<Paragraph text={nursingHome.tour_info} />
						<h3>{accessibility}</h3>
						<Paragraph text={nursingHome.accessibility_info} />
						<h3>{personnel}</h3>
						<Paragraph text={nursingHome.staff_info} />
						<Paragraph
							title={linkMoreInfoPersonnel}
							text={nursingHome.staff_satisfaction_info}
						/>
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
		</div>
	);
};

export default PageNursingHome;

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
			<a href={to} target="_blank" rel="noreferrer noopener">
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
	return (
		<>
			{id && <div id={id} />}
			<div className={className}>
				<Image
					nursingHome={nursingHome}
					imageName="owner_logo"
					className="nursinghome-details-logo"
					alt="Omistajan logo"
				/>
				<Paragraph
					text={nursingHome.name}
					className="nursinghome-details-name"
				/>
				<a
					href={`https://www.google.com/maps/search/${
						nursingHome.name
					}/@${nursingHome.geolocation.center.join(",")}z`}
					target="_blank"
					rel="noreferrer noopener"
				>
					<MapSmall nursingHome={nursingHome} />
				</a>

				<dl className="nursingHome-info-list nursingHome-info-list--contact">
					<dt>{contactInfo}</dt>
					<dd>
						{nursingHome.address}, {nursingHome.postal_code}{" "}
						{nursingHome.city}
					</dd>
					<dd>Puh. {nursingHome.contact_phone}</dd>
					<dd>
						<a href={"mailto:" + nursingHome.email}>
							{nursingHome.email}
						</a>
					</dd>
					<dd>
						<a
							href={nursingHome.www}
							target="_blank"
							rel="noopener noreferrer"
						>
							{webpage}
						</a>
					</dd>
				</dl>

				<dl className="nursingHome-info-list nursingHome-info-list--directions">
					<dt>{directions}</dt>
					<dd>{nursingHome.arrival_guide_public_transit}</dd>
					<dd>{nursingHome.arrival_guide_car}</dd>
				</dl>
			</div>
		</>
	);
};
