import React, { FC } from "react";
import config from "./config";
import { useT } from "../i18n";
import "../styles/PageCancel.scss";

interface Props {
	error: "404" | Error;
}

const PageError: FC<Props> = ({ error }) => {
	const errorType = error === "404" ? "error-404" : "error-runtime";
	const error404Title = useT("error404Title");
	const errorGeneralTitle = useT("errorGeneralTitle");
	const error404Text = useT("error404Text");
	const errorGeneralText = useT("errorGeneralText");
	const title = useT("cancelPageTitle");
	const subTitle = useT("cancelPageContent");

	return (
		<div className={`page-cancel`}>
			<h1 className="page-cancel-title">{title}</h1>
			<p>{subTitle}</p>
			<p>
				<a className="btn" href={(window.location.pathname).replace("/peruuta", "")}>{useT("backToEdit")}</a>
				<a className="page-update-cancel" href="/">{useT("backToFrontPage")}</a>
			</p>
		</div>
	);
};

export default PageError;
