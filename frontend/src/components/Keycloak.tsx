import React, { FC, useEffect, useState } from "react";

import Keycloak, { KeycloakConfig } from "keycloak-js";

const config: KeycloakConfig = {
	realm: "hoivakodit",
	url: "http://localhost:8080/auth/",
	clientId: "valvonta",
};

const keycloak = Keycloak(config);

const KeycloakContext = React.createContext({});

export const KeycloakProvider: FC = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		keycloak.init({ onLoad: "login-required" }).then(authenticated => {
			setIsAuthenticated(authenticated);
		});
	}, []);

	return (
		<KeycloakContext.Provider value={isAuthenticated}>
			{children}
		</KeycloakContext.Provider>
	);
};

export default KeycloakContext;
