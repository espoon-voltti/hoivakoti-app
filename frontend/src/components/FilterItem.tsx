import React, { useState, FC } from "react";
import "../styles/FilterItem.scss";
import ButtonDropdown, { DropdownVariant } from "./ButtonDropdown";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import { useT } from "../i18n";

export type Alignment = "left" | "right";

export type FilterOption =
	| { type: "header"; text: string }
	| { type: "text"; text: string }
	| {
			type: "radio";
			name: string;
			label: string;
			subLabel?: string;
			checked: boolean;
	  }
	| {
			type: "checkbox";
			name: string;
			label: string;
			subLabel?: string;
			checked: boolean;
			withMargin?: boolean;
			bold?: boolean;
			alignment?: Alignment;
	  };

export type Props = {
	prefix: string;
	value: string | null;
	values: FilterOption[];
	ariaLabel: string;
	disabled?: boolean;
	dropdownVariant?: DropdownVariant;
	onChange: (newValue: { name: string; newValue: boolean }) => void;
	onReset: () => void;
};

function CreateFilterItems(
	options: FilterOption[],
	handleChange: any,
	prefix: string,
): any {
	return (
		<>
			{options.map((option: FilterOption, index) => {
				if (option.type === "checkbox") {
					let className = "checkbox-item";
					if (option.withMargin === true) className += " with-margin";
					if (option.bold === true) className += " with-bold";
					if (option.alignment === "right")
						className += " align-right";
					return (
						<div className={className} key={index}>
							<Checkbox
								id={`filter-${index}`}
								name={option.name}
								isChecked={option.checked}
								onChange={newValue =>
									handleChange({
										newValue,
										name: option.name,
									})
								}
							>
								<div
									className={`option-header ${
										option.subLabel
											? "option-text-has-subtext"
											: ""
									}`}
								>
									{option.label}
								</div>
								{option.subLabel && (
									<div className="option-subtext">
										{option.subLabel}
									</div>
								)}
							</Checkbox>
						</div>
					);
				} else if (option.type === "radio") {
					return (
						<div className="radio-item" key={index}>
							<Radio
								id={`filter-${index}`}
								name={prefix + "-radio-group"}
								isSelected={option.checked}
								onChange={newValue =>
									handleChange({
										newValue,
										name: option.name,
									})
								}
							>
								<div
									className={`option-header ${
										option.subLabel
											? "option-text-has-subtext"
											: ""
									}`}
								>
									{option.label}
								</div>
								{option.subLabel && (
									<div className="option-subtext">
										{option.subLabel}
									</div>
								)}
							</Radio>
						</div>
					);
				} else if (option.type === "text") {
					return (
						<p className="text-item" key={index}>
							{option.text}
						</p>
					);
				} else if (option.type === "header") {
					return (
						<div className="header-item" key={index}>
							{option.text}
						</div>
					);
				} else {
					console.warn("[FilterItem] Unknown value: ", option);
					return null;
				}
			})}
		</>
	);
}

const FilterItem: FC<Props> = ({
	prefix,
	value,
	values,
	disabled,
	dropdownVariant = "primary",
	onChange,
	onReset,
}) => {
	const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
	const canEmpty = value !== null;

	const handleChange = (newValue: {
		name: string;
		newValue: boolean;
	}): void => {
		onChange(newValue);
	};

	const btnClear = useT("btnClear");
	const btnSave = useT("btnSave");

	// Atm only checkboxes support aligning on left or right...
	const leftSideOptions = values.filter((option: FilterOption) => {
		if (option.type !== "checkbox" || option.alignment !== "right")
			return true;
		return false;
	});
	const rightSideOptions = values.filter((option: FilterOption) => {
		if (option.type === "checkbox" && option.alignment === "right")
			return true;
		return false;
	});

	const leftSideItems = CreateFilterItems(
		leftSideOptions,
		handleChange,
		prefix,
	);
	const rightSideItems = CreateFilterItems(
		rightSideOptions,
		handleChange,
		prefix,
	);

	const subMenu = (
		<div>
			<div className="option-container">
				<div className="align-left">{leftSideItems}</div>
				<div className="align-right">{rightSideItems}</div>
			</div>

			<div className="save-and-empty-container">
				<button
					onClick={() => setIsDropdownExpanded(false)}
					className="btn"
				>
					{btnSave}
				</button>

				<button
					onClick={(): void => {
						onReset();
					}}
					disabled={!canEmpty}
					className="menu-empty-button"
				>
					{btnClear}
				</button>
			</div>
		</div>
	);

	const label = `${prefix}${value ? `${prefix ? ": " : ""}${value}` : ""}`;
	const filterActive = value !== null;

	return (
		<ButtonDropdown
			isExpanded={isDropdownExpanded}
			onExpandedChange={setIsDropdownExpanded}
			variant={dropdownVariant}
			label={label}
			active={filterActive}
			disabled={disabled}
		>
			{subMenu}
		</ButtonDropdown>
	);
};

export default FilterItem;
