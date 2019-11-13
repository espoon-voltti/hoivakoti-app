import React, { useState, FC, ChangeEvent } from "react";
import "../styles/FilterItem.scss";
import ButtonDropdown from "./ButtonDropdown";

export type Props = {
	prefix: string;
	value: string | null;
	values: Array<any>;
	ariaLabel: string;
	onChange: (target: EventTarget & HTMLInputElement) => void;
	onReset: () => void;
};

const FilterItem: FC<Props> = ({ prefix, value, values, onChange, onReset }) => {
	const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		onChange(event.target);
	};

	const subMenu = (
		<div>
			{values.map((value: any, index) => {
				if (value.type === "checkbox") {
					return (
						<div className="checkbox-item" key={index}>
							<input
								type="checkbox"
								name={value.text}
								value={value.text}
								defaultChecked={value.checked}
								onChange={handleChange}
							/>{" "}
							{value.text}
						</div>
					);
				} else if (value.type === "radio") {
					return (
						<div className="radio-item" key={index}>
							<input
								type="radio"
								name={prefix + "-radio-group"}
								defaultChecked={value.checked}
								value={value.text}
								onChange={handleChange}
							/>{" "}
							{value.text}
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
				}
			})}

			<div className="save-and-empty-container">
				<button
					onClick={(): void => {
						onReset();
						setIsDropdownExpanded(false);
					}}
					className="menu-empty-button"
				>
					Tyhjennä
				</button>

				<button onClick={() => setIsDropdownExpanded(false)} className="menu-save-button">
					Tallenna
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
