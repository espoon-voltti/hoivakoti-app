import React, { useEffect, useState } from "react";

import Keycloak, { KeycloakConfig } from "keycloak-js";

const config: KeycloakConfig = {
	realm: "hoivakodit",
	url: "http://localhost:8080/auth/",
	clientId: "valvonta",
};

const keycloak = Keycloak(config);

const withAuthentication = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
) => ({ ...props }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		keycloak.init({ onLoad: "login-required" }).then(authenticated => {
			setIsAuthenticated(authenticated);
		});
	}, []);

	return (
		<WrappedComponent {...(props as P)} isAuthenticated={isAuthenticated} />
	);
};

export default withAuthentication;
