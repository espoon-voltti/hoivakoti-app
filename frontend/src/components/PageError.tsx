import React, { FC } from "react";
import config from "./config";
import "../styles/PageError.scss";

interface Props {
	error: "404" | Error;
}

const PageError: FC<Props> = ({ error }) => {
	const errorType = error === "404" ? "error-404" : "error-runtime";

	const title = errorType === "error-404" ? "Hups! Etsimääsi sivua ei löytynyt." : "Palvelussa on häiriö";
	const subTitle =
		errorType === "error-404"
			? "Luultavasti etsimäsi sivun osoite on muuttunut tai sivua ei ole enää olemassa."
			: "Yritä myöhemmin uudelleen.";
	const linkText = "Palaa etusivulle";

	return (
		<div className={`page-error ${errorType}`}>
			<img
				src={config.PUBLIC_FILES_URL + "/icon-error.svg"}
				alt="Espoo – Esbo"
				className="page-error-logo"
			/>
			<h1 className="page-error-title">{title}</h1>
			<p>{subTitle}</p>
			<p>
				<a href="/">{linkText}</a>
			</p>
		</div>
	);
};

export default PageError;
