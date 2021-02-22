import React, { FC, useEffect, useState } from "react";
import keycloak from "../keycloak";

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
