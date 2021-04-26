import React, { FC, useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation, useHistory } from "react-router-dom";
import config from "./config";
import { useT, Language, useCurrentLanguage } from "../i18n";
import i18next from "i18next";

import Cookies from "universal-cookie";
import AuthTypes from "../shared/types/auth-types";
import { AuthContext } from "./auth-context";

const setLanguage = (lng: Language): void => {
	i18next.changeLanguage(lng);
};

interface KeycloakSession {
	token: string;
	refreshToken: string;
	username: string;
}

const Header: FC = () => {
	const linkJumpToContent = useT("linkJumpToContent");
	const currentLanguage = useCurrentLanguage();
	const location = useLocation();
	const history = useHistory();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [sessionCookies] = useState<Cookies>(new Cookies());

	const { isAuthenticated, logout } = useContext(AuthContext);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname, location.search]);

	const navHome = useT("navHome");
	const navNursingHomes = useT("navNursingHomes");
	const navInformation = useT("navInformation");
	const headingFeedback = useT("headingFeedback");

	const updatePage =
		location.pathname.indexOf("paivita") == -1 ? false : true;

	const surveillancePage =
		location.pathname.indexOf("valvonta") == -1 ? false : true;

	const surveillanceLogout = async (): Promise<void> => {
		try {
			if (isAuthenticated) {
				const keycloakSession: KeycloakSession = sessionCookies.get(
					"keycloak_session",
				);

				const refreshToken = keycloakSession.refreshToken;

				const hash = sessionCookies.get("hoivakoti_session");

				await logout({ token: refreshToken, hash }, AuthTypes.VALVONTA);

				sessionCookies.remove("keycloak_session");
				sessionCookies.remove("hoivakoti_session");

				history.go(0);
			}
		} catch (error) {
			console.error(error);
		}
	};

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

	if (surveillancePage && isAuthenticated) {
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
				<button className="btn" onClick={surveillanceLogout}>
					Kirjaudu ulos
				</button>
			</div>
		);
	}

	if (updatePage) {
		navItems = (
			<div className="nav-menus">
				<ul className="nav-menu" role="menu">
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							exact
							to="./tiedot"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{navInformation}
						</NavLink>
					</li>
					<li role="menuitem">
						<NavLink
							activeClassName="selected"
							to="./palaute"
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
		<header
			className={
				"header " +
				(updatePage || surveillancePage ? "header-shadow" : "")
			}
		>
			<a className="jump-to-content" href="#content">
				{linkJumpToContent}
			</a>
			<div className="logo-container">
				<Link to="/">
					<img
						className="logo"
						src={
							config.PUBLIC_FILES_URL + "/logo-lu-sote-black.svg"
						}
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
