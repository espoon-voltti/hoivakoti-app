import React, { FC } from "react";
import { ReactComponent as Caret } from "./Caret.svg";
import "../styles/ButtonDropdown.scss";
import { ReactComponent as CloseX } from "./CloseX.svg";

interface Props {
	isExpanded: boolean;
	onExpandedChange: (isExpanded: boolean) => void;
	label: string;
	active: boolean;
}

const ButtonDropdown: FC<Props> = ({
	isExpanded,
	onExpandedChange,
	label,
	active,
	children,
}) => {
	return (
		<>
			{isExpanded && (
				<div
					className="button-dropdown-background"
					onClick={() => onExpandedChange(false)}
				/>
			)}
			<div
				className="button-dropdown-container"
				aria-expanded={isExpanded}
			>
				<button
					onClick={() => onExpandedChange(!isExpanded)}
					className={`button-dropdown ${
						active ? "button-dropdown-active" : ""
					}`}
				>
					{label}
					<Caret className="button-dropdown-caret" />
				</button>
				{isExpanded && (
					<div className="button-dropdown-items">
						<div
							className="button-dropdown-items-close"
							onClick={() => onExpandedChange(false)}
						>
							<CloseX />
						</div>
						{children}
					</div>
				)}
			</div>
		</>
	);
};

export default ButtonDropdown;
