import React, { FC } from "react";
import "../styles/CardNursingHome.scss";
import { NursingHome } from "./types";
import { Link, useLocation } from "react-router-dom";
import { useCurrentLanguage, useT } from "../i18n";
import config from "./config";
import VacancyStatusBadge from "./VacancyStatusBadge";

type NursingHomeSmallProps = {
	nursinghome: NursingHome;
	type?: string;
	className?: string;
};

const CardNursingHome: FC<NursingHomeSmallProps> = ({
	nursinghome,
	type,
	className,
}) => {
	const currentLanguage = useCurrentLanguage();
	const { search } = useLocation();

	const language = useT(nursinghome.language as any);

	const serviceLanguage = useT("serviceLanguage");
	const numApartments = useT("numApartments");
	const alsoLAHText = useT("alsoLAHText");
	const filterAraLabel = useT("filterAraLabel");
	const filterARABoth = useT("filterARABoth");
	const reportStatusOk = useT("status_ok");
	const reportStatusSmall = useT("status_small_issues");
	const reportStatusSignificant = useT("status_significant_issues");
	const reportStatusSurveillance = useT("status_surveillance");
	const reportStatusNoInfo = useT("status_no_info");
	const reportStatus = useT("status_waiting");

	const reportScore = useT("reportScore");
	const feedbackRelativeReview = useT("feedbackRelativeReview");
	const feedbackCustomerReview = useT("feedbackCustomerReview");
	const feedbackNoReviews = useT("feedbackNoReviews");
	const feedbackReviews = useT("feedbackReviews");
	const feedbackGreat = useT("feedbackGreat");
	const feedbackGood = useT("feedbackGood");
	const feedbackOk = useT("feedbackOk");
	const feedbackBad = useT("feedbackBad");
	const feedbackVeryBad = useT("feedbackVeryBad");
	const feedbackAverage = useT("feedbackAverage");
	const latestVisit = useT("latestVisit");
	const status = useT("status");
	const addNewReport = useT("pageUploadReportTitle");
	const changeNursingHomeCommunes = useT("changeNursingHomeCommunes");

	const imageDigest =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash;

	const imageUrl =
		nursinghome.pic_digests &&
		nursinghome.pic_digests.overview_outside_hash &&
		`${config.API_URL}/nursing-homes/${nursinghome.id}` +
			`/pics/overview_outside/${imageDigest}`;

	const nursingHomeReportStatus = nursinghome.report_status[0];

	const getStatusTranslation = (status: string): string => {
		if (nursinghome && nursingHomeReportStatus) {
			switch (status) {
				case "ok":
					return reportStatusOk;
				case "small":
					return reportStatusSmall;
				case "significant":
					return reportStatusSignificant;
				case "surveillance":
					return reportStatusSurveillance;
				case "no-info":
					return reportStatusNoInfo;
			}
		}
		return reportStatus;
	};

	const formatDate = (dateStr: string | null): string => {
		if (!dateStr) {
			return "-";
		}

		const date = new Date(dateStr);

		const YYYY = String(date.getUTCFullYear());
		const MM = String(date.getUTCMonth() + 1);
		const DD = String(date.getUTCDate());

		return `${DD}.${MM}.${YYYY}`;
	};

	const ratingToString = (
		answers: number | null,
		rating: number | null,
	): string => {
		if (rating && answers) {
			if (answers >= 5) {
				if (rating > 4.5) {
					return feedbackGreat;
				} else if (rating > 3.5) {
					return feedbackGood;
				} else if (rating > 2.5) {
					return feedbackOk;
				} else if (rating > 1.5) {
					return feedbackBad;
				} else if (rating > 0.5) {
					return feedbackVeryBad;
				}
			}

			return feedbackAverage;
		}

		return feedbackNoReviews;
	};

	const openButtonLink = (
		event: React.FormEvent<HTMLButtonElement>,
		link: string,
	): void => {
		event.preventDefault();
		window.location.href = link;
	};

	const nursingHomeRating = nursinghome.rating;

	const enoughCustomerAnswers =
		nursingHomeRating.answers_customers &&
		nursingHomeRating.answers_customers >= 5;

	const enoughRelativesAnswers =
		nursingHomeRating.answers_relatives &&
		nursingHomeRating.answers_relatives >= 5;

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
				<img
					src={imageUrl ? imageUrl : undefined}
					className={`card-list-item__image-container ${
						imageUrl ? "has-pic" : ""
					}`}
				/>
				<div
					className={
						type == "admin" &&
						nursingHomeReportStatus &&
						nursingHomeReportStatus.status == "surveillance"
							? "card-list-item-alert-tag"
							: "hidden"
					}
				>
					<div className="card-list-item-alert-tag-mark"></div>
					<div className="card-list-item-alert-tag-label">
						Tehostetussa valvonnassa
					</div>
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

					<div className={type == "admin" ? "hidden" : ""}>
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
							<span className="card-list-item__text--dot">
								{" "}
								•{" "}
							</span>{" "}
							<span className="nowrap">
								{numApartments}:{" "}
								{nursinghome && nursinghome.apartment_count}
							</span>
						</div>
						<div className="card-list-item__text card-list-item__text--lah">
							{nursinghome && nursinghome.lah ? alsoLAHText : ""}
						</div>
					</div>
					<div className={type == "admin" ? "" : "hidden"}>
						<div className="card-nursing-home-status">
							<span>{status}: </span>
							{nursingHomeReportStatus
								? getStatusTranslation(
										nursingHomeReportStatus.status,
								  )
								: getStatusTranslation("")}
						</div>
						<div className="card-nursing-home-status">
							<span>{latestVisit}: </span>
							{nursingHomeReportStatus
								? formatDate(nursingHomeReportStatus.date)
								: "-"}
						</div>
					</div>
				</div>

				<div className="card-list-item__visiting-info">
					<p className="nursinghome-info-paragraph-title">
						{nursinghome.tour_info}
					</p>
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
				<div
					className={
						type === "admin" ? "card-list-item__buttons" : "hidden"
					}
				>
					<button
						className="btn"
						onClick={e => {
							openButtonLink(
								e,
								`/${currentLanguage}/valvonta/${nursinghome.id}`,
							);
						}}
					>
						{addNewReport}
					</button>
					<button
						className="btn"
						onClick={e => {
							openButtonLink(
								e,
								`/${currentLanguage}/valvonta/asiakaskyselyn-vastaukset/${nursinghome.id}`,
							);
						}}
					>
						Lisää kyselyn tulokset
					</button>
					<button
						className="btn"
						onClick={event => {
							openButtonLink(
								event,
								`/${currentLanguage}/valvonta/kotikunnat/${nursinghome.id}`,
							);
						}}
					>
						{changeNursingHomeCommunes}
					</button>
				</div>
			</div>
			<div
				className={
					type == "admin" || type == "narrow"
						? "hidden"
						: "card-nursing-home-boxes"
				}
			>
				<div className="card-nursing-home-public-status no-left-border">
					<div>
						<p
							className={
								nursingHomeRating.average_customers
									? ""
									: "hidden"
							}
						>
							{feedbackCustomerReview}
						</p>
						<p className="card-nursing-home-public-status-header">
							{ratingToString(
								nursingHomeRating.answers_customers,
								nursingHomeRating.average_customers,
							)}
						</p>

						{enoughCustomerAnswers ? (
							<p>
								{nursingHomeRating.average_customers
									? nursingHomeRating.average_customers.toPrecision(
											2,
									  ) + " / 5"
									: ""}
							</p>
						) : null}

						<p>
							({nursingHomeRating.answers_customers}{" "}
							{feedbackReviews})
						</p>
					</div>
				</div>
				<div className="card-nursing-home-public-status no-left-border">
					<div>
						<p
							className={
								nursingHomeRating.average_relatives
									? ""
									: "hidden"
							}
						>
							{feedbackRelativeReview}
						</p>
						<p className="card-nursing-home-public-status-header">
							{ratingToString(
								nursingHomeRating.answers_relatives,
								nursingHomeRating.average_relatives,
							)}
						</p>
						{enoughRelativesAnswers ? (
							<p>
								{nursingHomeRating.average_relatives
									? nursingHomeRating.average_relatives.toPrecision(
											2,
									  ) + " / 5"
									: ""}
							</p>
						) : null}
						<p>
							({nursingHomeRating.answers_relatives}{" "}
							{feedbackReviews})
						</p>
					</div>
				</div>
				<div className="card-nursing-home-public-status no-left-border">
					<div>
						<div
							className={
								nursingHomeReportStatus &&
								nursingHomeReportStatus.status == "surveillance"
									? "card-nursing-home-alert-sign"
									: "hidden"
							}
						></div>
						<p
							className={
								"card-nursing-home-public-status-header" +
								((nursingHomeReportStatus &&
									nursingHomeReportStatus.status) ==
								"surveillance"
									? " card-nursing-home-alert"
									: "")
							}
						>
							{`${
								nursingHomeReportStatus
									? getStatusTranslation(
											nursingHomeReportStatus.status,
									  )
									: getStatusTranslation("")
							}`}
						</p>
						<p
							className={
								!nursingHomeReportStatus ||
								(nursingHomeReportStatus &&
									["waiting", "no-info"].includes(
										nursingHomeReportStatus.status,
									))
									? "hidden"
									: ""
							}
						>
							{reportScore}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export { CardNursingHome };
