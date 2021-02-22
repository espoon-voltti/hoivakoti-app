import Keycloak, { KeycloakConfig } from "keycloak-js";

const config: KeycloakConfig = {
	realm: "Hoivakodit",
	url: "http://localhost:8080/auth/",
	clientId: "valvonta",
};

const keycloak = Keycloak(config);

export default keycloak;
