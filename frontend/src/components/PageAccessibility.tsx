import React, { FC } from "react";
import { useT } from "../translations";
import "../styles/PageAccessibility.scss";

const PageAccessibility: FC = () => {
	const header = useT("pageAccessibilityHeader");
	const body = useT("pageAccessibilityBody");
	return (
		<div className="page-accessibility">
			<div className="page-accessibility-content">
				<h1 className="page-accessibility-title">{header}</h1>
				<div dangerouslySetInnerHTML={{ __html: body }}></div>
			</div>
		</div>
	);
};

export default PageAccessibility;
