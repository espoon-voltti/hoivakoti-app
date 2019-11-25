import React, { FC } from "react";
import Helmet from "react-helmet";
import { useT } from "../translations";

interface Props {
	title?: string;
}

const Title: FC<Props> = ({ title }) => {
	const defaultTitle = useT("appTitle");
	const titleTemplate = useT("titleTemplate");
	return (
		<Helmet defaultTitle={defaultTitle} titleTemplate={titleTemplate}>
			{title && <title>{title}</title>}
		</Helmet>
	);
};

export default Title;
