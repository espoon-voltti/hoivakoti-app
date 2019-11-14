import React, { useState, FC } from "react";
import "../styles/FilterItem.scss";
import ButtonDropdown from "./ButtonDropdown";
import Checkbox from "./Checkbox";
import Radio from "./Radio";

export type Props = {
	prefix: string;
	value: string | null;
	values: Array<any>;
	ariaLabel: string;
	onChange: (newValue: any) => void;
	onReset: () => void;
};

const FilterItem: FC<Props> = ({ prefix, value, values, onChange, onReset }) => {
	const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);

	const handleChange = (newValue: any): void => {
		onChange(newValue);
	};

	const subMenu = (
		<div>
			{values.map((value: any, index) => {
				if (value.type === "checkbox") {
					return (
						<div className="checkbox-item" key={index}>
							<Checkbox
								id={`filter-${index}`}
								name={value.text}
								isChecked={value.checked}
								onChange={newValue => handleChange({ newValue, name: value.text })}
							>
								<div className={`option-header ${value.subText ? "option-text-has-subtext" : ""}`}>
									{value.text}
								</div>
								{value.subText && <div className="option-subtext">{value.subText}</div>}
							</Checkbox>
						</div>
					);
				} else if (value.type === "radio") {
					return (
						<div className="radio-item" key={index}>
							<Radio
								id={`filter-${index}`}
								name={prefix + "-radio-group"}
								isSelected={value.checked}
								onChange={newValue => handleChange({ newValue, name: value.text })}
							>
								<div className={`option-header ${value.subText ? "option-text-has-subtext" : ""}`}>
									{value.text}
								</div>
								{value.subText && <div className="option-subtext">{value.subText}</div>}
							</Radio>
						</div>
					);
				} else if (value.type === "text") {
					return (
						<div className="text-item" key={index}>
							{value.text}
						</div>
					);
				} else if (value.type === "header") {
					return (
						<div className="header-item" key={index}>
							{value.text}
						</div>
					);
				} else {
					console.warn("[FilterItem] Unknown value: ", value);
					return null;
				}
			})}

			<div className="save-and-empty-container">
				<button onClick={() => setIsDropdownExpanded(false)} className="menu-save-button">
					Tallenna
				</button>

				<button
					onClick={(): void => {
						onReset();
						setIsDropdownExpanded(false);
					}}
					className="menu-empty-button"
				>
					Tyhjennä
				</button>
			</div>
		</div>
	);

	const label = `${prefix}${value ? `: ${value}` : ""}`;
	const filterActive = value !== null;

	return (
		<ButtonDropdown
			isExpanded={isDropdownExpanded}
			onExpandedChange={setIsDropdownExpanded}
			label={label}
			active={filterActive}
		>
			{subMenu}
		</ButtonDropdown>
	);
};

export default FilterItem;