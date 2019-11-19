import React, { FC } from "react";
import config from "./config";

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

		<nav id="page-nav">
			<span>
				Rekisteriseloste &nbsp;&nbsp;|&nbsp;&nbsp; Tietosuojaseloste
			</span>
		</nav>
	</footer>
);

export default Footer;
