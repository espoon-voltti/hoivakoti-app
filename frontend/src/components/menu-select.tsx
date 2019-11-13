import React, { useState, FC } from "react";
import {
	useMenuState,
	Menu,
	MenuItem,
	MenuDisclosure,
	MenuItemCheckbox,
	MenuItemRadio,
	MenuGroup,
	MenuSeparator,
} from "reakit/Menu";
import "../styles/menu-select.scss";

export type MenuSelectProps = {
	prefix: string;
	values: any;
	aria_label: string;
	on_changed: any;
	on_emptied: any;
};

const MenuSelect: FC<MenuSelectProps> = ({ prefix, values, aria_label, on_changed, on_emptied }) => {
	const [selected, SetSelected] = useState("");
	const [checked, setChecked] = useState([]);

	const checked_values: string[] = [];
	values.forEach((value: any) => {
		if (value.checked) checked_values.push(value.text);
	});

	const select_menu = useMenuState({ unstable_values: { items: checked_values } });

	const items_dom: object[] = values.map((value: any, index: any) => {
		const name = "valitse " + value;
		console.log("Recreating..");
		if (value.type === "header")
			return (
				<MenuItem
					{...select_menu}
					name={name}
					value={value.text}
					className="header-item"
					key={index}
					disabled={true}
				>
					{value.text}
				</MenuItem>
			);
		else if (value.type === "button")
			return (
				<MenuItem
					{...select_menu}
					name={name}
					value={value.text}
					className="text-item"
					key={index}
					onClick={(event: any) => {
						on_changed(event.target);
						select_menu.hide();
					}}
				>
					{value.text}
				</MenuItem>
			);
		else if (value.type === "checkbox") {
			const checkbox = (
				<MenuItemCheckbox
					{...select_menu}
					name="items"
					value={value.text}
					className="checkbox-item"
					key={index}
					onChange={(event: any) => {
						console.log(event.target.checked);
						on_changed(event.target);
						select_menu.hide();
					}}
				>
					{value.text}
				</MenuItemCheckbox>
			);
			return checkbox;
		} else if (value.type === "radio") {
			const radio = (
				<MenuItemRadio
					{...select_menu}
					name={name}
					value={value.text}
					className="radio-item"
					key={index}
					onChange={(event: any) => {
						console.log(event.target.checked);
						on_changed(event.target);
						select_menu.hide();
					}}
				>
					{value.text}
				</MenuItemRadio>
			);
			return radio;
		} else if (value.type === "text") {
			return (
				<MenuItem
					{...select_menu}
					name={name}
					value={value.text}
					className="text-item"
					key={index}
					disabled={true}
				>
					{value.text}
				</MenuItem>
			);
		} else if (value.type === "separator") {
			return <MenuSeparator {...select_menu}></MenuSeparator>;
		}
	});

	const empty_values: object = { items: [] };

	items_dom.push(
		<MenuItem
			{...select_menu}
			name="Tyhjennä"
			value={"Tyhjennä"}
			className="empty-selections-item"
			key={"Tyhjennä"}
			onClick={(event: any) => {
				select_menu.unstable_setValue("items", []);
				select_menu.hide();
				on_emptied();
			}}
		>
			Tyhjennä
		</MenuItem>,
	);

	items_dom.push(
		<MenuItem
			{...select_menu}
			name="Tallenna"
			value={"Tallenna"}
			className="save-selections-item"
			key={"Tallenna"}
			onClick={(event: any) => {
				select_menu.hide();
			}}
		>
			Tallenna
		</MenuItem>,
	);

	const selected_text = prefix + selected;

	const menu_dom = (
		<div className="menu">
			<MenuDisclosure {...select_menu}>{selected_text}</MenuDisclosure>
			<Menu {...select_menu} aria-label={aria_label} className="menu-item-container">
				<MenuGroup {...select_menu}>{items_dom}</MenuGroup>
			</Menu>
		</div>
	);

	return <>{menu_dom}</>;
};

export { MenuSelect };
