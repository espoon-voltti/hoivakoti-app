import React, { FC } from "react";
import config from "./config";
import "../styles/NursingHomeSmall.scss";
import { NursingHome } from "./types";
import { Link } from "react-router-dom";

type NursingHomeSmallProps = {
	nursinghome: NursingHome;
	isNarrow?: boolean;
	className?: string;
};

const NursingHomeSmall: FC<NursingHomeSmallProps> = ({ nursinghome, isNarrow, className }) => {
	return (
		<div className={`card-list-item ${isNarrow ? "card-narrow" : ""} ${className || ""}`}>
			<div className="card-list-item__image-container">
				<img
					className="card-list-item__image"
					src={config.PUBLIC_FILES_URL + "/placeholder.jpg"}
					alt="Hoivakodin preview-kuva"
				/>
			</div>

			<div className="card-list-item__content">
				<div className="card-list-item__content--top">
					<div className="card-list-item__subheader">{nursinghome && nursinghome.owner}</div>

					<h3 className="card-list-item__header">{nursinghome && nursinghome.name}</h3>

					<div className="card-list-item__text">{nursinghome && nursinghome.address}</div>
					{nursinghome && nursinghome.ara && <div className="card-list-item__tag">ARA-kohde</div>}
				</div>

				<div className="card-list-item__content--bottom">
					<div className="card-list-item__text">
						Palvelukieli: {nursinghome && nursinghome.language}{" "}
						<span className="card-list-item__text--dot"> • </span> Asuntojen määrä:{" "}
						{nursinghome && nursinghome.apartment_count}
					</div>
					<div className="card-list-item__text card-list-item__text--lah">
						{nursinghome && nursinghome.lah ? "Myös lyhytaikainen asuminen" : ""}
					</div>
				</div>

				{isNarrow && (
					<div className="card-list-item__link">
						<div className="card-list-item__text">
							<Link to={`/hoivakodit/${nursinghome.id}`}>Hoivakodin tiedot</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export { NursingHomeSmall };
