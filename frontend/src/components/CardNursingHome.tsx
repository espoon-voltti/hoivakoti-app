import React, { FC } from "react";
import "../styles/CardNursingHome.scss";
import { NursingHome } from "./types";
import { Link, useLocation } from "react-router-dom";
import { useT } from "../i18n";
import config from "./config";
import VacancyStatusBadge from "./VacancyStatusBadge";
import PageAdmin from "./PageAdmin";

type NursingHomeSmallProps = {
	nursinghome: NursingHome;
	type?: string,
	className?: string;
};

const CardNursingHome: FC<NursingHomeSmallProps> = ({
	nursinghome,
	type,
	className,
}) => {
	const { search } = useLocation();
	const serviceLanguage = useT("serviceLanguage");
	const numApartments = useT("numApartments");
	const alsoLAHText = useT("alsoLAHText");
	const filterAraLabel = useT("filterAraLabel");
	const filterARABoth = useT("filterARABoth");
	const visitingInfo = useT("visitingInfo");
	const imageDigest =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash;
	const imageUrl = 
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash &&
		`${config.API_URL}/nursing-homes/${nursinghome.id}` +
			`/pics/overview_outside/${imageDigest}`;
	const language = useT(nursinghome.language as any);

	const reportStatusOk = useT("status_ok");
	const reportStatusSmall = useT("status_small");
	const reportStatusSignificant = useT("status_significant");
	const reportStatusSurveillance = useT("status_surveillance");
	const reportStatusNoInfo = useT("status_no_info");
	let reportStatus = useT("status_waiting");

	const getStatusTranslation = (statusStr: string): string => {
		if(nursinghome && nursinghome.report_status){

			switch (statusStr) {
				case "ok":
					reportStatus = reportStatusOk;
				break;
				case "small":
					reportStatus = reportStatusSmall;
				break;
				case "significant":
					reportStatus = reportStatusSignificant;
				break;
				case "surveillance":
					reportStatus = reportStatusSurveillance;
				break;
				case "no-info":
					reportStatus = reportStatusNoInfo;
				break;
			}
		}
		return reportStatus;
	}

	const formatDate = (dateStr: string | null): string => {
		if (!dateStr) return "-";
		const date = new Date(dateStr);
		const YYYY = String(date.getUTCFullYear());
		const MM = String(date.getUTCMonth() + 1);
		const DD = String(date.getUTCDate());
		return `${DD}.${MM}.${YYYY}`;
	};

	const openBtnLink = (e: React.FormEvent<HTMLButtonElement>, link: string):void => {
		e.preventDefault();
		window.location.href = link;
	};

	return (
		<Link
			to={{
				pathname: `/hoivakodit/${nursinghome.id}`,
				state: {
					fromFilterQuery: search,
				},
			}}
			className={`card-list-item ${className || ""}`}
		>
			<div className="card-list-item-container">
				<img src={imageUrl ? imageUrl : undefined}
					className={`card-list-item__image-container ${
						imageUrl ? "has-pic" : ""
					}`}
				/>
				<div className={(type == "admin" && nursinghome.report_status.status == "surveillance")? "card-list-item-alert-tag" : "hidden"}>
					<div className="card-list-item-alert-tag-mark"></div>
					<div className="card-list-item-alert-tag-label">Tehostetussa seurannassa</div>
				</div>
				
				<div className="card-list-item__content">
					<div className="card-list-item__content-upper">
						<div className="card-list-item__subheader">
							{nursinghome && nursinghome.owner}
						</div>

						<h3 className="card-list-item__header">
							{nursinghome && nursinghome.name}
						</h3>

						<div className="card-list-item__text">
							{nursinghome.address}, {nursinghome.postal_code}{" "}
							{nursinghome.city}
						</div>
						{nursinghome.has_vacancy && (
							<VacancyStatusBadge
								vacancyStatus={nursinghome.has_vacancy}
								className="card-nursinghome-vacancy-status-badge"
							/>
						)}
					</div>

					<div className={type == "admin" ? "hidden": ""}>
						{nursinghome && nursinghome.ara === "Kyllä" && (
							<div className="card-list-item__tag">
								{filterAraLabel}
							</div>
						)}

						{nursinghome &&
							nursinghome.ara !== "Ei" &&
							nursinghome.ara !== "Kyllä" && (
								<div className="card-list-item__tag">
									{filterARABoth}
								</div>
							)}

						<div className="card-list-item__text">
							<span className="nowrap">
								{serviceLanguage}: {nursinghome && language}{" "}
							</span>
							<span className="card-list-item__text--dot"> • </span>{" "}
							<span className="nowrap">
								{numApartments}:{" "}
								{nursinghome && nursinghome.apartment_count}
							</span>
						</div>
						<div className="card-list-item__text card-list-item__text--lah">
							{nursinghome && nursinghome.lah ? alsoLAHText : ""}
						</div>
					</div>
					<div className={type == "admin" ? "": "hidden"}>
						<div className="card-nursing-home-status">
							<span>Tilanne:{" "}</span>
							{nursinghome.report_status ? getStatusTranslation(nursinghome.report_status.status) : ""}
						</div>	
						<div className="card-nursing-home-status">
							<span>Viimeisein käynti:{" "}</span>
							{nursinghome.report_status ? formatDate(nursinghome.report_status.date) : "-"}
						</div>	
					</div>
				</div>

				<div className="card-list-item__visiting-info">
					<p className="nursinghome-info-paragraph-title">{nursinghome.tour_info}</p>
					<dl className="nursingHome-info-list nursingHome-info-list--contact">
						<dt>{nursinghome.contact_name}</dt>
						<dd>{nursinghome.contact_title}</dd>
						<dd>Puh. {nursinghome.contact_phone}</dd>
						<dd>
							<a href={"mailto:" + nursinghome.email}>
								{nursinghome.email}
							</a>
						</dd>
						<dd>
							<br />
						</dd>
						<dd>{nursinghome.contact_phone_info}</dd>
					</dl>
				</div>
				<button className={type== "admin" ? "btn":"hidden"} onClick={(e) => {openBtnLink(e, `/hoivakodit/${nursinghome.id}/valvonta/`)}}>Lisää uusi käynti</button>
			</div>
			<div className={type == "admin" ? "hidden": ""}>
					<div className="card-nursing-home-public-status">
						<p className="card-nursing-home-public-status-header">{`"${nursinghome.report_status ? getStatusTranslation(nursinghome.report_status.status) : ""}"`}</p>
						<p>Valvontakäynnin tulos</p>
					</div>	
				</div>
		</Link>
		
		
	);
};

export { CardNursingHome };
