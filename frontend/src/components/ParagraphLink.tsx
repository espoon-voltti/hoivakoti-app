import React, { FC } from "react";

interface ParagraphLinkProps {
	text?: string;
	to?: string;
}

const ParagraphLink: FC<ParagraphLinkProps> = ({ text, to }) => {
	if (!to) return null;
	return (
		<p>
			<a href={to} target="_blank" rel="noreferrer noopener external">
				{text || to}
			</a>
		</p>
	);
};

export default ParagraphLink;
