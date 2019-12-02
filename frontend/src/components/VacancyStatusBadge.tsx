import React, { FC } from "react";
import { useT } from "../i18n";
import "../styles/VacancyStatusBadge.scss";

interface Props {
	vacancyStatus: boolean | null;
	className?: string;
}

const VacancyStatusBadge: FC<Props> = ({ vacancyStatus = true, className }) => {
	const labelVacancyTrue = useT("vacancyTrue");
	const labelVacancyFalse = useT("vacancyFalse");

	const classes =
		"vacancy-status-badge " +
		`vacancy-status-badge-${vacancyStatus} ${className || ""}`;

	return (
		<div className={classes}>
			{vacancyStatus ? labelVacancyTrue : labelVacancyFalse}
		</div>
	);
};

export default VacancyStatusBadge;
