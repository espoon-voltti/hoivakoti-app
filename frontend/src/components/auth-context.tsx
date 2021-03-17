import axios from "axios";
import React, { createContext, FC, useState } from "react";
import Cookies from "universal-cookie";
import AuthTypes from "../shared/types/auth-types";
import config from "./config";

interface KeycloakAuthResponse {
	access_token: string;
	refresh_token: string;
	roles: string[];
	hash?: string;
}

interface LoginRequestData {
	username: string;
	password: string;
}

interface LogoutRequestData {
	token: string;
	hash: string;
}

interface KeycloakSession {
	token: string;
	refreshToken: string;
	username: string;
}

interface AuthContextState {
	isAuthenticated: boolean;
	userRoles: string[];
	isAdmin: boolean;
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
	const [userRoles, setUserRoles] = useState<Array<string>>([]);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
				const roles = credentials.roles;

				const sessionData: KeycloakSession = {
					token,
					refreshToken,
					username,
				};

				sessionCookies.set(
					"keycloak_session",
					JSON.stringify(sessionData),
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

				if (roles.includes("administrator")) {
					setIsAdmin(true);
				} else {
					setUserRoles(roles);
				}
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
		try {
			const keycloakSession: KeycloakSession = sessionCookies.get(
				"keycloak_session",
			);

			const token = keycloakSession.token;
			const refreshToken = keycloakSession.refreshToken;
			const username = keycloakSession.username;

			const hash = sessionCookies.get("hoivakoti_session");

			if (token && refreshToken && username && hash) {
				const res = await axios.post(
					`${config.API_URL}/auth/refresh-token`,
					{
						token: refreshToken,
						hash,
						type,
						username,
					},
				);

				const credentials = res.data as KeycloakAuthResponse;

				if (credentials) {
					const token = credentials["access_token"];
					const refreshToken = credentials["refresh_token"];
					const roles = credentials.roles;

					const sessionData: KeycloakSession = {
						token,
						refreshToken,
						username,
					};

					sessionCookies.set(
						"keycloak_session",
						JSON.stringify(sessionData),
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

					if (roles.includes("administrator")) {
						setIsAdmin(true);
					} else {
						setUserRoles(roles);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				userRoles,
				isAdmin,
				login,
				logout,
				refreshToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
