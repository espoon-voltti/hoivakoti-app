import React, { useState, FC, ChangeEvent } from "react";
import "../styles/FilterItem.scss";
import { ReactComponent as ImageFilterCaret } from "./filter-caret.svg";

export type Props = {
	prefix: string;
	value: string | null;
	values: Array<any>;
	ariaLabel: string;
	onChange: (target: EventTarget & HTMLInputElement) => void;
	onReset: () => void;
};

const FilterItem: FC<Props> = ({ prefix, value, values, onChange, onReset }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleToggleExpand = (): void => {
		setIsExpanded(!isExpanded);
	};

	const background = <div className="background" onClick={handleToggleExpand}></div>;

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		onChange(event.target);
	};

	const subMenu = (
		<div className="items">
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
						setIsExpanded(false);
					}}
					className="menu-empty-button"
				>
					Tyhjennä
				</button>

				<button onClick={handleToggleExpand} className="menu-save-button">
					Tallenna
				</button>
			</div>
		</div>
	);

	return (
		<>
			{isExpanded && background}
			<div className="filter-menu" aria-expanded={isExpanded}>
				<button
					onClick={handleToggleExpand}
					className={`filter-button ${value !== null ? "filter-button-has-value" : ""}`}
				>
					{prefix}
					{value ? `: ${value}` : null}
					<ImageFilterCaret className="filter-button-caret" />
				</button>
				{isExpanded && subMenu}
			</div>
		</>
	);
};

export default FilterItem;
