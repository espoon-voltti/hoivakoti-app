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
			disabled?: boolean;
	  };

export type Props = {
	prefix: string;
	label: string;
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
	indexStart: number,
): any {
	return (
		<>
			{options.map((option: FilterOption, i) => {
				const index = indexStart + i;
				if (option.type === "checkbox") {
					let className = "checkbox-item";
					if (option.withMargin === true) className += " with-margin";
					if (option.bold === true) className += " with-bold";
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
								disabled={option.disabled as boolean}
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
	label,
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
	const btnSelect = useT("btnSelect");

	const header = values.filter((option: FilterOption) => {
		if (option.type === "header") return true;
		return false;
	});

	// Atm only checkboxes support aligning on left or right...
	const leftSideOptions = values.filter((option: FilterOption) => {
		if (
			(option.type !== "checkbox" || option.alignment !== "right") &&
			option.type !== "header"
		)
			return true;
		return false;
	});
	const rightSideOptions = values.filter((option: FilterOption) => {
		if (option.type === "checkbox" && option.alignment === "right")
			return true;
		return false;
	});

	const headerItem = CreateFilterItems(header, handleChange, prefix, 0);
	const leftSideItems = CreateFilterItems(
		leftSideOptions,
		handleChange,
		prefix,
		1,
	);
	const rightSideItems = CreateFilterItems(
		rightSideOptions,
		handleChange,
		prefix,
		1 + leftSideOptions.length,
	);

	const subMenu = (
		<div>
			{headerItem}
			{rightSideOptions.length <= 0 ? (
				<>
					<div>{leftSideItems}</div>
					<div>{rightSideItems}</div>
				</>
			) : (
				<div className="option-container">
					{leftSideItems}
					{rightSideItems}
				</div>
			)}

			<div className="save-and-empty-container">
				<button
					onClick={() => setIsDropdownExpanded(false)}
					className="btn"
				>
					{btnSelect}
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

	const labelText = `${label}${value ? `${label ? ": " : ""}${value}` : ""}`;
	const filterActive = value !== null;

	return (
		<ButtonDropdown
			isExpanded={isDropdownExpanded}
			onExpandedChange={setIsDropdownExpanded}
			variant={dropdownVariant}
			label={labelText}
			active={filterActive}
			disabled={disabled}
		>
			{subMenu}
		</ButtonDropdown>
	);
};

export default FilterItem;
