import React, { FC, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import config from "./config";
import { useT, Language, useCurrentLanguage } from "../i18n";
import i18next from "i18next";

const setLanguage = (lng: Language): void => {
	i18next.changeLanguage(lng);
};

const Header: FC = () => {
	const currentLanguage = useCurrentLanguage();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	return (
		<header className="header">
			<div className="logo-container">
				<Link to="/">
					<img
						className="logo"
						src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"}
						alt="Espoo – Esbo"
					/>
					<h1 className="title">{useT("appTitle")}</h1>
				</Link>
			</div>

			<nav id="page-nav">
				<input
					type="checkbox"
					checked={isMobileMenuOpen}
					onChange={e => setIsMobileMenuOpen(e.target.checked)}
					role="button"
					aria-haspopup="true"
					id="hamburger"
				/>
				<label htmlFor="hamburger" className="menu-btn">
					&#9776; valikko
				</label>
				<div className="nav-menus">
					<ul className="nav-menu" role="menu">
						<li role="menuitem">
							<NavLink
								activeClassName="selected"
								exact
								to="/"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{useT("navHome")}
							</NavLink>
						</li>
						<li role="menuitem">
							<NavLink
								activeClassName="selected"
								to="/hoivakodit"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{useT("navNursingHomes")}
							</NavLink>
						</li>
					</ul>
				</div>
				<ul className="nav-menu--language" role="menu">
					<li role="menuitem">
						<NavLink
							to="#"
							lang="fi-FI"
							className="lang-link"
							onClick={e => {
								e.preventDefault();
								setLanguage("fi-FI");
							}}
							isActive={() => currentLanguage === "fi-FI"}
						>
							<span className="lang-link-short">FI</span>
							<span className="lang-link-long">Suomeksi</span>
						</NavLink>
					</li>
					<li className="separator">|</li>
					<li role="menuitem">
						<NavLink
							to="#"
							lang="sv-SV"
							className="lang-link"
							onClick={e => {
								e.preventDefault();
								setLanguage("sv-FI");
							}}
							isActive={() => currentLanguage === "sv-FI"}
						>
							<span className="lang-link-short">SV</span>
							<span className="lang-link-long">På svenska</span>
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
