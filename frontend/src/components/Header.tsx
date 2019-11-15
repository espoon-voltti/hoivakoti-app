import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import * as config from "./config";
import { useT, Language, useCurrentLanguage } from "../translations";
import i18next from "i18next";

const setLanguage = (lng: Language): void => {
	i18next.changeLanguage(lng);
};

const Header: FC = () => {
	const currentLanguage = useCurrentLanguage();
	return (
		<header className="header">
			<div className="logo-container">
				<a href="/">
					<img className="logo" src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"} alt="Espoo logo" />
					<h1 className="title">{useT("appTitle")}</h1>
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
								{useT("navHome")}
							</NavLink>
						</li>
						<li>
							<NavLink activeClassName="selected" to="/hoivakodit">
								{useT("navNursingHomes")}
							</NavLink>
						</li>
					</ul>
				</div>
				<ul className="nav-menu--language" role="menu">
					<li>
						<NavLink
							to="#"
							lang="fi"
							className="lang-link"
							onClick={e => {
								e.preventDefault();
								setLanguage("fi");
							}}
							isActive={() => currentLanguage === "fi"}
						>
							Suomeksi
						</NavLink>
					</li>
					<li className="separator">|</li>
					<li>
						<NavLink
							to="#"
							lang="sv"
							className="lang-link"
							onClick={e => {
								e.preventDefault();
								setLanguage("sv");
							}}
							isActive={() => currentLanguage === "sv"}
						>
							På svenska
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
