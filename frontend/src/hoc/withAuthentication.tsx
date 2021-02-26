import React, { Fragment, useEffect, useState } from "react";

import keycloak from "../config/keycloak";

import axios from "axios";
import config from "../config";

import queryString from "querystring";
import Cookies from "universal-cookie";
import { AuthTypes } from "../components/authTypes";
import { useT } from "../i18n";

import "../styles/Auth.scss";

interface AuthResponse {
	access_token: string;
	refresh_token: string;
}

const requestTokenIntrospect = async (
	secret: string | undefined,
	clientId: string,
	username: string,
	token: string,
): Promise<boolean> => {
	const res = await axios.post(
		`${config.PUBLIC_FILES_URL}/auth/realms/hoivakodit/protocol/openid-connect/token/introspect`,
		queryString.stringify({
			// eslint-disable-next-line @typescript-eslint/camelcase
			client_secret: secret,
			// eslint-disable-next-line @typescript-eslint/camelcase
			client_id: clientId,
			username,
			token,
		}),
	);

	return res.data && res.data.roles.includes("valvonta-access");
};

const requestToken = async (
	username: string,
	password: string,
	type: string,
): Promise<AuthResponse | undefined> => {
	try {
		const res = await axios.post(`${config.API_URL}/auth/get-token`, {
			username,
			password,
			type,
		});

		console.log(res);

		return res.data;
	} catch (error) {
		console.error(error);
	}
};

const withAuthentication = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
	type: AuthTypes,
) => ({ ...props }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setIsLoading] = useState<boolean>(true);

	const [sessionCookies] = useState<Cookies>(new Cookies());

	const loadingText = useT("loadingText");

	useEffect(() => {
		const token = sessionCookies.get("keycloak-token");
		const refreshToken = sessionCookies.get("keycloak-refresh-token");

		if (token && refreshToken) {
			const refreshTokenData = {
				// eslint-disable-next-line @typescript-eslint/camelcase
				client_id: type,
				// eslint-disable-next-line @typescript-eslint/camelcase
				grant_type: "refresh_token",
				// eslint-disable-next-line @typescript-eslint/camelcase
				refresh_token: refreshToken,
				// eslint-disable-next-line @typescript-eslint/camelcase
				client_secret: keycloak.credentials.secret,
			};

			axios
				.post(
					`${config.API_URL}/auth/realms/hoivakodit/protocol/openid-connect/token`,
					queryString.stringify(refreshTokenData),
				)
				.then((res: { data: AuthResponse }) => {
					if (res.data) {
						const token = res.data["access_token"];
						const refreshToken = res.data["refresh_token"];

						sessionCookies.set("keycloak-token", token);
						sessionCookies.set(
							"keycloak-refresh-token",
							refreshToken,
						);

						setIsAuthenticated(true);
					}
				})
				.catch(err => {
					console.error(err);
				});
		}

		setIsLoading(false);
	}, [sessionCookies]);

	const handleLogin = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();

		const credentials = await requestToken(username, password, type);

		if (credentials) {
			const token = credentials["access_token"];
			const refreshToken = credentials["refresh_token"];

			sessionCookies.set("keycloak-token", token);
			sessionCookies.set("keycloak-refresh-token", refreshToken);

			setIsAuthenticated(true);
		}
	};

	const auth: JSX.Element | null = (
		<Fragment>
			{isAuthenticated ? (
				<WrappedComponent
					{...(props as P)}
					isAuthenticated={isAuthenticated}
				/>
			) : (
				<form className="login-form" onSubmit={handleLogin}>
					<h2>Kirjaudu työkaluun</h2>
					<div className="input-container">
						<label className="label" htmlFor="username">
							Käyttäjänimi
						</label>
						<input
							className="input"
							type="text"
							name="username"
							id="username"
							value={username}
							onChange={event => {
								setUsername(event.target.value);
							}}
						></input>
					</div>
					<div className="input-container">
						<label className="label" htmlFor="password">
							Salasana
						</label>
						<input
							className="input"
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={event => {
								setPassword(event.target.value);
							}}
						></input>
					</div>
					<div className="button-container">
						<button className="btn" type="submit">
							Kirjaudu sisään
						</button>
					</div>
				</form>
			)}
		</Fragment>
	);

	return (
		<div className="auth-container">
			{loading ? <h2>{loadingText}</h2> : auth}
		</div>
	);
};

export default withAuthentication;
