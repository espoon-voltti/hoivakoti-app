import React, { useState, FC } from "react";
import "../styles/FilterItem.scss";
import ButtonDropdown, { DropdownVariant } from "./ButtonDropdown";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import { useT } from "../translations";

export type FilterOption =
	| { type: "header"; text: string }
	| { type: "text"; text: string }
	| { type: "radio"; text: string; subText?: string; checked: boolean }
	| { type: "checkbox"; text: string; subText?: string; checked: boolean };

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

	const subMenu = (
		<div>
			{values.map((option: FilterOption, index) => {
				if (option.type === "checkbox") {
					return (
						<div className="checkbox-item" key={index}>
							<Checkbox
								id={`filter-${index}`}
								name={option.text}
								isChecked={option.checked}
								onChange={newValue =>
									handleChange({
										newValue,
										name: option.text,
									})
								}
							>
								<div
									className={`option-header ${
										option.subText
											? "option-text-has-subtext"
											: ""
									}`}
								>
									{option.text}
								</div>
								{option.subText && (
									<div className="option-subtext">
										{option.subText}
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
										name: option.text,
									})
								}
							>
								<div
									className={`option-header ${
										option.subText
											? "option-text-has-subtext"
											: ""
									}`}
								>
									{option.text}
								</div>
								{option.subText && (
									<div className="option-subtext">
										{option.subText}
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
