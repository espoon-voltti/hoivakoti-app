import React, { FC } from "react";
import "../styles/CardNursingHome.scss";
import { NursingHome } from "./types";
import { Link } from "react-router-dom";
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
	const serviceLanguage = useT("serviceLanguage");
	const numApartments = useT("numApartments");
	const alsoLAHText = useT("alsoLAHText");
	console.log(alsoLAHText);
	const imageDigest =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash;
	const imageUrl =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash &&
		`${config.API_URL}/nursing-homes/${nursinghome.id}` +
			`/pics/overview_outside/${imageDigest}`;
	return (
		<Link
			to={`/hoivakodit/${nursinghome.id}`}
			className={`card-list-item ${className || ""}`}
		>
			<div
				className={`card-list-item__image-container ${
					imageUrl ? "has-pic" : ""
				}`}
				style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
			/>

			<div className="card-list-item__content">
				<div>
					{nursinghome.has_vacancy && (
						<VacancyStatusBadge
							vacancyStatus={nursinghome.has_vacancy}
							className="card-nursinghome-vacancy-status-badge"
						/>
					)}
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
					{nursinghome && nursinghome.ara && (
						<div className="card-list-item__tag">ARA</div>
					)}
				</div>

				<div>
					<div className="card-list-item__text">
						{serviceLanguage}: {nursinghome && nursinghome.language}{" "}
						<span className="card-list-item__text--dot"> • </span>{" "}
						{numApartments}:{" "}
						{nursinghome && nursinghome.apartment_count}
					</div>
					<div className="card-list-item__text card-list-item__text--lah">
						{nursinghome && nursinghome.lah ? alsoLAHText : ""}
					</div>
				</div>
			</div>

			<div className="card-list-item__spacer" />

			<div>
				<div className="card-list-item__link">
					<button className="card-list-item__link-button">
						Hoivakodin tiedot
					</button>
				</div>
			</div>
		</Link>
	);
};

export { CardNursingHome };
