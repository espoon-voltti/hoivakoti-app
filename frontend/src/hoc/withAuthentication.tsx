import React, { useEffect, useState } from "react";

import Keycloak, { KeycloakConfig } from "keycloak-js";
import keycloakJson from "../keycloak.json";

const refreshRate = 30;

const withAuthentication = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
) => ({ ...props }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const keycloak = Keycloak({
			realm: keycloakJson.realm,
			clientId: "valvonta",
			url: keycloakJson["auth-server-url"],
		});

		keycloak
			.init({ onLoad: "login-required" })
			.then(authenticated => {
				setIsAuthenticated(authenticated);
			})
			.catch(err => {
				console.error(err);

				throw err;
			});

		keycloak.onTokenExpired = () => {
			keycloak
				.updateToken(refreshRate)
				.then(refreshed => {
					if (refreshed) {
						console.log("Succesfully refreshed token");
					}
				})
				.catch(err => {
					console.error(
						"Failed to retrieve an updated token or session has expired.",
					);

					throw err;
				});
		};
	}, []);

	return (
		<WrappedComponent {...(props as P)} isAuthenticated={isAuthenticated} />
	);
};

export default withAuthentication;
