/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/PageNursingHome.scss";
import * as config from "./config";
import axios from "axios";
import { NursingHome } from "./types";

interface GetNursingHomeResponse {
	data: [NursingHome];
}

const PageNursingHome: FC = () => {
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const { id } = useParams();

	useEffect(() => {
		axios
			.get(config.API_URL + "/nursing-homes/" + id)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data[0]);
			})
			.catch(console.error);
	}, [id]);

	return (
		<div className="nursinghome-page-container">
			<div className="nursinghome-hero">
				<img alt="Kuva hoivakodista" src="/placeholder.jpg" />
			</div>
			{!nursingHome ? (
				"Loading..."
			) : (
				<div className="nursinghome-info-container">
					<div className="nursinghome-info">
						<Link to="/hoivakodit" className="nursinghome-back-link">
							Takaisin hoivakotilistaukseen
						</Link>
						<h2 className="nursinghome-title">{nursingHome && nursingHome.name}</h2>
						<Paragraph text={nursingHome.summary} />
						<h3>Perustiedot</h3>
						<Paragraph title="ARA-kohde" text={nursingHome.ara ? "Kyllä" : "Ei"} />
						<Paragraph title="Rakennusvuosi" text={String(nursingHome.construction_year)} />
						<Paragraph title="Asuntojen määrä" text={String(nursingHome.apartment_count)} />
						<Paragraph title="Asuntojen neliömäärä" text={String(nursingHome.apartment_square_meters)} />
						<Paragraph title="Asunnon peruskalustus" text="Sänky, pöytä, wc" />
						<Paragraph title="Vuokran määrä" text={String(nursingHome.rent)} />
						<Paragraph title="Palvelukieli" text={nursingHome.language} />
						<Paragraph title="Lyhytaikaisen hoivan asuntoja" text={nursingHome.lah ? "Kyllä" : "Ei"} />
						<h3>Ruoka</h3>
						<Paragraph title="Ruoan valmistuksen tapa" text={nursingHome.meals_preparation} />
						<Paragraph title="Lisätietoa ruoasta" text={nursingHome.meals_info} />
						<ParagraphLink text="Linkki ruokalistaan" to={nursingHome.menu_link} />
						<h3>Toiminta</h3>
						<Paragraph text={nursingHome.activities_info} />
						<ParagraphLink text="Lisätietoja toiminnasta" to={nursingHome.activities_link} />
						<h3>Ulkoilumahdollisuudet</h3>
						<Paragraph text={nursingHome.outdoors_possibilities_info} />
						<Paragraph
							title="Lisätietoja ulkoilumahdollisuuksista"
							text={nursingHome.outdoors_possibilities_link}
						/>
						<h3>Hoivakotiin tutustuminen</h3>
						<Paragraph text={nursingHome.tour_info} />
						<h3>Esteettömyys</h3>
						<Paragraph text={nursingHome.accessibility_info} />
						<h3>Henkilöstö</h3>
						<Paragraph text={nursingHome.staff_info} />
						<Paragraph
							title="Lisätietoja henkilöstön tyytyväisyydestä"
							text={nursingHome.staff_satisfaction_info}
						/>
						{nursingHome.other_services && (
							<>
								<h3>Muut hoivakodin palvelut</h3>
								<Paragraph text={nursingHome.other_services} />
							</>
						)}
						<h3>Lähellä olevat palvelut</h3>
						<Paragraph text={nursingHome.nearby_services} />
					</div>

					<div className="nursinghome-details-box">
						<Paragraph text={nursingHome.name} className="nursinghome-details-name" />
						<h3>Yhteystiedot</h3>
						<Paragraph text={nursingHome.address} />
						<Paragraph text={nursingHome.contact_name} />
						<Paragraph text={nursingHome.contact_title} />
						<Paragraph text={nursingHome.contact_phone} />
						<ParagraphLink
							text={nursingHome.email}
							to={nursingHome.email ? `mailto:${nursingHome.email}` : undefined}
						/>
						<ParagraphLink to={nursingHome.www} />
						<h3>Kulkuyhteydet</h3>
						<Paragraph text={nursingHome.arrival_guide_public_transit} />
						<Paragraph text={nursingHome.arrival_guide_car} />
					</div>
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
			{title && <p className="nursinghome-info-paragraph-title">{title}</p>}
			<p className={className}>{text}</p>
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
