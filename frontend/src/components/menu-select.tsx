import React, { useState, useEffect } from "react"
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuGroup
} from "reakit/Menu";
import { useCheckboxState } from "reakit/Checkbox";
import "../styles/menu-select.scss";

export type MenuSelectProps = {
	prefix: string,
	values: any,
	aria_label: string,
	on_changed: any
}

function MenuSelect({prefix, values, aria_label, on_changed}: MenuSelectProps) {
	// Declare a new state variable, which we'll call "count"
	const [selected, SetSelected] = useState("")
	const [checked, setChecked] = useState([]);

	const checked_values: string[] = [];
	values.forEach((value: any)  => {
		if (value.checked)
			checked_values.push(value.text);
	});

	console.log("Checked:");
	console.log(checked_values);

	const select_menu = useMenuState({unstable_values: {items: checked_values}});

	const items_dom: object[] = values.map((value: any, index: any) => {
		const name = "valitse " + value;
		console.log("Recreating..");
		if (typeof value !== "object")
			return	(
				<MenuItem {...select_menu} name={name} value={value} className="text-item" key={index} onClick={(event: any) => {
						SetSelected(event.target.value);
						on_changed(event.target);
						select_menu.hide();
					}
				}>
					{value}
				</MenuItem>
			)
		else if (value.type === "checkbox")
		{
			const checkbox = (
				<MenuItemCheckbox {...select_menu} name="items" value={value.text} className="checkbox-item" key={index} onChange={(event: any) => {
						console.log(event.target.checked);
						SetSelected(event.target.value);
						on_changed(event.target);
						select_menu.hide();
					}
				}>
					{value.text}
				</MenuItemCheckbox>
			)
			return checkbox
		}
		else if (value.type === "radio")
		{
			const radio = (
				<MenuItemRadio {...select_menu} name={name} value={value.text} className="radio-item" key={index} onChange={(event: any) => {
						console.log(event.target.checked);
						SetSelected(event.target.value);
						on_changed(event.target);
						select_menu.hide();
					}
				}>
					{value.text}
				</MenuItemRadio>
			)
			return radio
		}
	});

	const selected_text = prefix + selected;

	const menu_dom = (
	<div className="menu">
		<MenuDisclosure {...select_menu}>{selected_text}</MenuDisclosure>
		<Menu {...select_menu} aria-label={aria_label} className="menu-item-container">
			<MenuGroup {...select_menu}>
				{items_dom}
			</MenuGroup>
		</Menu>
	</div>
	);

	return (
		<>
		{menu_dom}
		</>
	)
}

export { MenuSelect }