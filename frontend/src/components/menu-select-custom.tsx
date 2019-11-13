import React, { useState, FC } from "react";
import "../styles/menu-select-custom.scss";
import { ReactComponent as ImageFilterCaret } from "./filter-caret.svg";

export type MenuSelectProps = {
	prefix: string;
	value: string | null;
	values: any;
	aria_label: string;
	on_changed: any;
	on_emptied: any;
};

const MenuSelect: FC<MenuSelectProps> = ({ prefix, value, values, aria_label, on_changed, on_emptied }) => {
	const [expanded, SetExpanded] = useState(false);

	const OnToggleExpand = (): void => {
		SetExpanded(!expanded);
	};

	const background_dom = <div className="background" onClick={OnToggleExpand}></div>;

	const handle_item_click = (event: any) => {
		on_changed(event.target);
	};

	const items_dom = (
		<div className="items">
			{values.map((value: any, index: number) => {
				if (value.type === "checkbox") {
					return (
						<div className="checkbox-item" key={index}>
							<input
								type="checkbox"
								name={value.text}
								value={value.text}
								defaultChecked={value.checked}
								onClick={handle_item_click}
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
								onClick={handle_item_click}
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
					onClick={() => {
						on_emptied();
						OnToggleExpand();
					}}
					className="menu-empty-button"
				>
					Tyhjennä
				</button>

				<button onClick={OnToggleExpand} className="menu-save-button">
					Tallenna
				</button>
			</div>
		</div>
	);

	console.log({ prefix, value });

	const menu_dom = (
		<div className="filter-menu" aria-expanded={expanded}>
			<button
				onClick={OnToggleExpand}
				className={`filter-button ${value !== null ? "filter-button-has-value" : ""}`}
			>
				{prefix}
				{value ? `: ${value}` : null}
				<ImageFilterCaret className="filter-button-caret" />
			</button>
			{expanded && items_dom}
		</div>
	);

	return (
		<>
			{expanded && background_dom}
			{menu_dom}
		</>
	);
};

export { MenuSelect };
