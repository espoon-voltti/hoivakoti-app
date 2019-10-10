import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "./landing.css"

import {
	useMenuState,
	Menu,
	MenuItem,
	MenuDisclosure,
	MenuSeparator
} from "reakit/Menu";


function Landing() {

	const menu = useMenuState();

	return (
		<div id="landing">
			<b>Miltä alueelta etsit hoivakotia?</b>

			      <MenuDisclosure {...menu}>Menu</MenuDisclosure>
      <Menu {...menu} aria-label="Example">
        <MenuItem
          {...menu}
          onClick={() => {
            menu.hide();
            console.log("clicked on button");
          }}
        >
          Button
        </MenuItem>
        <MenuItem {...menu} as="a" href="#" onClick={menu.hide}>
          Link
        </MenuItem>
      </Menu>

		</div>
	)
}
//			<p className="nurseryhome-container-child" id="nurseryhome-summary">{this.nurseryhome.summary}</p>

export { Landing }
