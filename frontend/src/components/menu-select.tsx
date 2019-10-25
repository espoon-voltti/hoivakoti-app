import React, { useState, useEffect } from "react"
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuItemCheckbox
} from "reakit/Menu";

export type MenuSelectProps = {
	prefix: string,
	values: string[],
	aria_label: string,
	on_changed: any
}

function MenuSelect({prefix, values, aria_label, on_changed}: MenuSelectProps) {
	// Declare a new state variable, which we'll call "count"
	const [selected, SetSelected] = useState("")

	useEffect(() => {
	}, [])

	const select_menu = useMenuState();

	const items_dom: object[] = values.map((value, index) => {
		const name = "valitse " + value;
		return	(
			<MenuItem {...select_menu} name={name} value={value} key={index} onClick={(event: any) => {
					SetSelected(event.target.value);
					on_changed(event.target.value);
					select_menu.hide();
				}
			}>
				{value}
			</MenuItem>
		)
	});

	const selected_text = prefix + selected;

	const menu_dom = (
	<>
		<MenuDisclosure {...select_menu}>{selected_text}</MenuDisclosure>
		<Menu {...select_menu} aria-label={aria_label}>
			{items_dom}
		</Menu>
	</>
	);

	return (
		<>
		{menu_dom}
		</>
	)
}

export { MenuSelect }