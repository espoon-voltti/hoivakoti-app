import React, { FC } from "react";
import Helmet from "react-helmet";
import { useT, useCurrentLanguage } from "../i18n";

interface Props {
	title?: string;
}

const Title: FC<Props> = ({ title }) => {
	const defaultTitle = useT("appTitle");
	const titleTemplate = useT("titleTemplate");
	const currentLanguage = useCurrentLanguage();
	console.log(currentLanguage);
	return (
		<Helmet
			htmlAttributes={{ lang: currentLanguage }}
			defaultTitle={defaultTitle}
			titleTemplate={titleTemplate}
		>
			{title && <title>{title}</title>}
		</Helmet>
	);
};

export default Title;
