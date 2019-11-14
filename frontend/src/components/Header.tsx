import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import * as config from "./config";

const Header: FC = () => (
	<header className="header">
		<div className="logo-container">
			<a href="/">
				<img className="logo" src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"} alt="Espoo logo" />
				<h1 className="title">Espoon hoivakodit</h1>
			</a>
		</div>

		<nav id="page-nav">
			<input type="checkbox" role="button" aria-haspopup="true" id="hamburger" />
			<label htmlFor="hamburger" className="menu-btn">
				&#9776; valikko
			</label>
			<div className="nav-menus">
				<ul className="nav-menu" role="menu">
					<li>
						<NavLink activeClassName="selected" exact to="/">
							Etusivu
						</NavLink>
					</li>
					<li>
						<NavLink
							activeClassName="selected"
							exact
							to="/hoivakodit"
							isActive={(match, location) => location.pathname.startsWith("/hoivakodit")}
						>
							Hoivakodit
						</NavLink>
					</li>
				</ul>
			</div>
			<ul className="nav-menu--language" role="menu">
				<li className="selected link-fi"></li>
				<li className="separator">|</li>
				<li>
					<NavLink to="#" lang="sv" className="link-sv"></NavLink>
				</li>
			</ul>
		</nav>
	</header>
);

export default Header;
