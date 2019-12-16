import React, { FC } from "react";
import config from "./config";
import { useT } from "../i18n";
import "../styles/PageError.scss";

interface Props {
	error: "404" | Error;
}

const PageError: FC<Props> = ({ error }) => {
	const errorType = error === "404" ? "error-404" : "error-runtime";
	const error404Title = useT("error404Title");
	const errorGeneralTitle = useT("errorGeneralTitle");
	const error404Text = useT("error404Text");
	const errorGeneralText = useT("errorGeneralText");
	const title = errorType === "error-404" ? error404Title : errorGeneralTitle;
	const subTitle =
		errorType === "error-404"
			? error404Text
			: errorGeneralText;
	const linkText = "Palaa etusivulle";

	return (
		<div className={`page-error ${errorType}`}>
			<img
				src={config.PUBLIC_FILES_URL + "/icons/icon-error.svg"}
				alt=""
				className="page-error-logo"
			/>
			<h1 className="page-error-title">{title}</h1>
			<p>{subTitle}</p>
			<p>
				<a href="/">{useT("backToFrontPage")}</a>
			</p>
		</div>
	);
};

export default PageError;
