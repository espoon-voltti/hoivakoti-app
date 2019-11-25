import React, { FC } from "react";
import config from "./config";
import { Link } from "react-router-dom";
import { useT } from "../translations";

const Footer: FC = () => (
	<footer className="header" style={{ borderTop: "1px solid #e8e8e8" }}>
		<div className="logo-container">
			<a href="/">
				<img
					className="logo"
					src={config.PUBLIC_FILES_URL + "/logo-espoo.svg"}
					alt="Espoo logo"
				/>
			</a>
		</div>

		<nav className="footer-links">
			<span className="footer-link">
				<a
					href="https://www.espoo.fi/fi-FI/Asioi_verkossa/Tietosuoja/Tietosuojaselosteet"
					target="_blank"
					rel="noopener noreferrer"
				>
					{useT("footerLinkPrivacy")}
				</a>
			</span>
			<span className="footer-link">
				<Link to="/saavutettavuus">
					{useT("footerLinkAccessibility")}
				</Link>
			</span>
			<span className="footer-link">
				<a
					href="https://easiointi.espoo.fi/eFeedback/fi/Home"
					target="_blank"
					rel="noopener noreferrer"
				>
					{useT("footerLinkFeedback")}
				</a>
			</span>
		</nav>
	</footer>
);

export default Footer;
