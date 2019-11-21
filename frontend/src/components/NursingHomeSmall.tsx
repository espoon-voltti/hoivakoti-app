import React, { FC } from "react";
import "../styles/NursingHomeSmall.scss";
import { NursingHome } from "./types";
import { Link } from "react-router-dom";
import { Image } from "./PageNursingHome";
import { useT } from "../translations";

type NursingHomeSmallProps = {
	nursinghome: NursingHome;
	isNarrow?: boolean;
	className?: string;
};



const NursingHomeSmall: FC<NursingHomeSmallProps> = ({
	nursinghome,
	isNarrow,
	className,
}) => {
	const serviceLanguage = useT('serviceLanguage');
	const numApartments = useT('numApartments');
	const alsoLAHText = useT('alsoLAHText');
	return (

		<div
			className={`card-list-item ${
				isNarrow ? "card-narrow" : ""
			} ${className || ""}`}
		>
			<div className="card-list-item__image-container">
				<Image
					nursingHome={nursinghome}
					imageName="overview_outside"
					alt="Hoivakodin preview-kuva"
					className="card-list-item__image"
				/>
			</div>

			<div className="card-list-item__content">
				<div>
					<div className="card-list-item__subheader">
						{nursinghome && nursinghome.owner}
					</div>

					<h3 className="card-list-item__header">
						{nursinghome && nursinghome.name}
					</h3>

					<div className="card-list-item__text">
						{nursinghome && nursinghome.address}
					</div>
					{nursinghome && nursinghome.ara && (
						<div className="card-list-item__tag">filterAraLabel</div>
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
						{nursinghome && nursinghome.lah
							? {alsoLAHText}
							: ""}
					</div>
				</div>

				{isNarrow && (
					<div className="card-list-item__link">
						<div className="card-list-item__text">
							<Link to={`/hoivakodit/${nursinghome.id}`}>
								Hoivakodin tiedot
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export { NursingHomeSmall };
