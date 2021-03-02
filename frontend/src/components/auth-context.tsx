import axios from "axios";
import React, { createContext, FC, useState } from "react";
import Cookies from "universal-cookie";
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

export const AuthContext = createContext({
	isAuthenticated: false,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setIsAuthenticated: (isAutenticated: boolean): void => {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	login: (data: LoginRequestData, type: string) => {},
});

const AuthContextProvider: FC = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [sessionCookies] = useState<Cookies>(new Cookies());

	const login = async (
		data: LoginRequestData,
		type: string,
	): Promise<void> => {
		try {
			const { username, password } = data;

			const res = await axios.post(`${config.API_URL}/auth/get-token`, {
				username,
				password,
				type,
			});

			const credentials = res.data;

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

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, setIsAuthenticated, login }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
