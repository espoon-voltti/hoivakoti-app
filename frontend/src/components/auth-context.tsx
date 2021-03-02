import axios from "axios";
import React, { createContext, FC, useState } from "react";
import Cookies from "universal-cookie";
import AuthTypes from "../shared/types/auth-types";
import config from "./config";

interface KeycloakAuthResponse {
	access_token: string;
	refresh_token: string;
	hash: string;
}

interface LoginRequestData {
	username: string;
	password: string;
}

interface LogoutRequestData {
	token: string;
	hash: string;
}

interface AuthContextState {
	isAuthenticated: boolean;
	login: (data: LoginRequestData, type: AuthTypes) => Promise<void>;
	logout: (data: LogoutRequestData, type: AuthTypes) => Promise<void>;
	refreshToken: (type: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextState>(
	{} as AuthContextState,
);

const AuthContextProvider: FC = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [sessionCookies] = useState<Cookies>(new Cookies());

	const login = async (
		data: LoginRequestData,
		type: AuthTypes,
	): Promise<void> => {
		try {
			const { username, password } = data;

			const res = await axios.post(`${config.API_URL}/auth/get-token`, {
				username,
				password,
				type,
			});

			const credentials = res.data as KeycloakAuthResponse;

			if (credentials) {
				const token = credentials["access_token"];
				const refreshToken = credentials["refresh_token"];
				const hash = credentials["hash"];

				sessionCookies.set("keycloak-token", token, {
					path: "/",
					maxAge: 36000,
				});
				sessionCookies.set("keycloak-refresh-token", refreshToken, {
					path: "/",
					maxAge: 36000,
				});

				sessionCookies.set("hoivakoti_session", hash, {
					path: "/",
					maxAge: 36000,
				});

				setIsAuthenticated(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const logout = async (
		data: LogoutRequestData,
		type: AuthTypes,
	): Promise<void> => {
		try {
			const { token, hash } = data;

			await axios.post(`${config.API_URL}/auth/logout-token`, {
				token,
				hash,
				type,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const refreshToken = async (type: string): Promise<void> => {
		const token = sessionCookies.get("keycloak-token");
		const refreshToken = sessionCookies.get("keycloak-refresh-token");
		const hash = sessionCookies.get("hoivakoti_session");

		if (token && refreshToken && hash) {
			axios
				.post(`${config.API_URL}/auth/refresh-token`, {
					token: refreshToken,
					hash,
					type,
				})
				.then((res: { data: KeycloakAuthResponse }) => {
					if (res.data) {
						const token = res.data["access_token"];
						const refreshToken = res.data["refresh_token"];

						sessionCookies.set("keycloak-token", token, {
							path: "/",
							maxAge: 36000,
						});
						sessionCookies.set(
							"keycloak-refresh-token",
							refreshToken,
							{
								path: "/",
								maxAge: 36000,
							},
						);

						sessionCookies.set("hoivakoti_session", hash, {
							path: "/",
							maxAge: 36000,
						});

						setIsAuthenticated(true);
					}
				})
				.catch(err => {
					console.error(err);
				});
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, refreshToken }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
