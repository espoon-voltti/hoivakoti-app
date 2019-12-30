import React, { FC } from "react";
import "../styles/CardNursingHome.scss";
import { NursingHome } from "./types";
import { Link, useLocation } from "react-router-dom";
import { useT } from "../i18n";
import config from "./config";
import VacancyStatusBadge from "./VacancyStatusBadge";

type NursingHomeSmallProps = {
	nursinghome: NursingHome;
	className?: string;
};

const CardNursingHome: FC<NursingHomeSmallProps> = ({
	nursinghome,
	className,
}) => {
	const { search } = useLocation();
	const serviceLanguage = useT("serviceLanguage");
	const numApartments = useT("numApartments");
	const alsoLAHText = useT("alsoLAHText");
	const filterAraLabel = useT("filterAraLabel");
	const filterARABoth = useT("filterARABoth");
	const imageDigest =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash;
	const imageUrl =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash &&
		`${config.API_URL}/nursing-homes/${nursinghome.id}` +
			`/pics/overview_outside/${imageDigest}`;
	const language = useT(nursinghome.language as any);
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
			<div
				className={`card-list-item__image-container ${
					imageUrl ? "has-pic" : ""
				}`}
				style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
			/>

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

				<div>
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
			</div>
		</Link>
	);
};

export { CardNursingHome };
