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

interface GetNursingHomeResponse {
	data: NursingHome;
}

const PageNursingHome: FC = () => {
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const { id } = useParams();
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes/" + id)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	const availablePics = nursingHome && getAvailablePics(nursingHome);

	const linkBacktoList = useT("linkBacktoList");
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

	// const webpage = useT("webpage");

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
			return (
				`${config.API_URL}/nursing-homes/${nursingHome.id}` +
				`/pics/${imageName}/${digest}`
			);
		});

	return (
		<div className="nursinghome-page-container">
			{images && (
				<Lightbox
					isOpen={isLightboxOpen}
					onClose={() => setIsLightboxOpen(false)}
					imageUrls={images}
				/>
			)}
			<div className="nursinghome-hero">
				{images && (
					<button
						onClick={() => setIsLightboxOpen(true)}
						className="nursinghome-hero-lightbox-button"
					>
						Katso kuvat
					</button>
				)}
				<Image
					nursingHome={nursingHome}
					imageName="overview_outside"
					className="nursinghome-hero-img nursinghome-hero-main"
					variant="background"
					placeholder={
						<div className="nursinghome-hero-placeholder" />
					}
				/>
				<div className="nursinghome-hero-extras-wrapper">
					<Image
						nursingHome={nursingHome}
						imageName="lounge"
						className="nursinghome-hero-img nursinghome-hero-extra"
						variant="background"
						placeholder={
							<div className="nursinghome-hero-placeholder" />
						}
					/>
					<Image
						nursingHome={nursingHome}
						imageName="outside"
						className="nursinghome-hero-img nursinghome-hero-extra"
						variant="background"
						placeholder={
							<div className="nursinghome-hero-placeholder" />
						}
					/>
				</div>
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
							{nursingHome && nursingHome.name}
						</h2>
						<Paragraph
							text={`${nursingHome.district}, ${nursingHome.city}`}
						/>
						<Paragraph text={nursingHome.summary} />
						<h3>{basicInformation}</h3>
						
						<dl>
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
						<Paragraph
							title={cookingMethod}
							text={nursingHome.meals_preparation}
						/>
						<Paragraph
							title={foodMoreInfo}
							text={nursingHome.meals_info}
						/>
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
	className?: string;
}

const DefinitionItem: FC<DefinitionItemProps> = ({
	term,
	definition,
	className,
}) => {
	if (!definition) return null;

	return (
		<>
			{term && (
				<dt className="nursinghome-info-paragraph-title">{term}</dt>
			)}
			<dd className={className}>{definition}</dd>
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
	imageName: NursingHomeImageName;
	className?: string;
	alt?: string;
	placeholder?: JSX.Element;
	variant?: "img" | "background";
}

export const Image: FC<ImageProps> = ({
	nursingHome,
	imageName,
	className,
	alt,
	placeholder = null,
	variant = "img",
}) => {
	if (!nursingHome || !nursingHome.pic_digests) return placeholder;
	const digest: string = (nursingHome.pic_digests as any)[
		`${imageName}_hash`
	];
	if (!digest) return placeholder;
	const srcUrl = `${config.API_URL}/nursing-homes/${nursingHome.id}/pics/${imageName}/${digest}`;
	if (variant === "img")
		return <img src={srcUrl} className={className} alt={alt} />;
	else
		return (
			<div
				style={{
					backgroundImage: `url(${srcUrl})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
				className={className}
			/>
		);
};

interface NursingHomeDetailsBoxProps {
	nursingHome: NursingHome;
	className?: string;
}

const NursingHomeDetailsBox: FC<NursingHomeDetailsBoxProps> = ({
	nursingHome,
	className,
}) => {
	const contactInfo = useT("contactInfo");
	const directions = useT("directions");
	return (
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
			<h3>{contactInfo}</h3>
			<Paragraph text={nursingHome.address} />
			<Paragraph text={nursingHome.contact_name} />
			<Paragraph text={nursingHome.contact_title} />
			<Paragraph text={nursingHome.contact_phone} />
			<ParagraphLink
				text={nursingHome.email}
				to={
					nursingHome.email
						? `mailto:${nursingHome.email}`
						: undefined
				}
			/>
			<ParagraphLink to={nursingHome.www} />
			<h3>{directions}</h3>
			<Paragraph text={nursingHome.arrival_guide_public_transit} />
			<Paragraph text={nursingHome.arrival_guide_car} />
		</div>
	);
};
