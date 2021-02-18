import React, { FC, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import config from "./config";
import { useT, Language, useCurrentLanguage } from "../i18n";
import i18next from "i18next";

const setLanguage = (lng: Language): void => {
	i18next.changeLanguage(lng);
};

const Header: FC = () => {
	const linkJumpToContent = useT("linkJumpToContent");
	const currentLanguage = useCurrentLanguage();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname, location.search]);

	const navHome = useT("navHome");
	const navNursingHomes = useT("navNursingHomes");
	const headingFeedback = useT("headingFeedback");

	const updatePage =
		location.pathname.indexOf("paivita") == -1 &&
		location.pathname.indexOf("valvonta") == -1
			? false
			: true;

	const surveillancePage =
		location.pathname.indexOf("valvonta") == -1 ? false : true;

	let minorHeader: JSX.Element | null = null;
	let navItems: JSX.Element | null = <div className="nav-menus"></div>;

	if (!surveillancePage && !updatePage) {
		navItems = (
			<div className="nav-menus">
				<ul className="nav-menu" role="menu">
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							exact
							to="/"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{navHome}
						</NavLink>
					</li>
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							to="/hoivakodit"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{navNursingHomes}
						</NavLink>
					</li>
				</ul>
			</div>
		);
	}

	if (surveillancePage) {
		minorHeader = (
			<div className="minor-header">Valvontatiimin työkalu</div>
		);

		navItems = (
			<div className="nav-menus">
				<ul className="nav-menu" role="menu">
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							exact
							to="/valvonta"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{navNursingHomes}
						</NavLink>
					</li>
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							to="/valvonta/palaute"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{headingFeedback}
						</NavLink>
					</li>
				</ul>
			</div>
		);
	}

	let languageSelection: JSX.Element | null = null;

	if (!surveillancePage) {
		languageSelection = (
			<ul
				className={
					"nav-menu--language" +
					(surveillancePage ? " nav-hidden" : "")
				}
				role="menu"
			>
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
		);
	}

	return (
		<header className={"header " + (updatePage ? "header-fixed" : "")}>
			<a className="jump-to-content" href="#content">
				{linkJumpToContent}
			</a>
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

			{minorHeader}

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
					&#9776; {useT("menu")}
				</label>

				{navItems}

				{languageSelection}
			</nav>
		</header>
	);
};

export default Header;
