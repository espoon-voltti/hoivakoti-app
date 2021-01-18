import React, { FC } from "react";

interface DefinitionItemProps {
	term?: string;
	definition?: string;
	classNameTerm?: string;
	classNameDefinition?: string;
}

const DefinitionItem: FC<DefinitionItemProps> = ({
	term,
	definition,
	classNameTerm,
	classNameDefinition,
}) => {
	if (!definition) return null;

	return (
		<>
			{term && <dt className={classNameTerm}>{term}</dt>}
			<dd className={classNameDefinition}>{definition}</dd>
		</>
	);
};

export default DefinitionItem;
