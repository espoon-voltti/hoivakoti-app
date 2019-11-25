import React, { FC } from "react";
import { ReactComponent as Caret } from "./Caret.svg";
import "../styles/ButtonDropdown.scss";
import { ReactComponent as CloseX } from "./CloseX.svg";

export type DropdownVariant = "primary" | "subtle";

interface Props {
	isExpanded: boolean;
	onExpandedChange: (isExpanded: boolean) => void;
	variant: DropdownVariant;
	label: string;
	active: boolean;
	disabled?: boolean;
}

const ButtonDropdown: FC<Props> = ({
	isExpanded,
	onExpandedChange,
	variant,
	label,
	active,
	children,
	disabled,
}) => {
	return (
		<>
			{/* {isExpanded && (
				<div
					className="button-dropdown-background"
					onClick={() => onExpandedChange(false)}
				/>
			)} */}
			<div
				className={`button-dropdown-container button-dropdown-variant-${variant}`}
				aria-expanded={isExpanded}
			>
				<button
					onClick={() => {
						if (!disabled) onExpandedChange(!isExpanded);
					}}
					disabled={disabled}
					className={`button-dropdown ${
						active ? "button-dropdown-active" : ""
					}`}
				>
					<span className="button-dropdown-label">{label}</span>
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
