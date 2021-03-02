import React, { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps } from "react-router-dom";

import { AuthContext } from "./auth-context";

import InputTypes from "../shared/types/input-types";

import "../styles/Auth.scss";
import Cookies from "universal-cookie";
import axios from "axios";
import config from "./config";

interface KeycloakAuthResponse {
	access_token: string;
	refresh_token: string;
	hash: string;
}

interface InputField {
	label: string;
	type: InputTypes;
	name: string;
	required: boolean;
	valid: boolean;
	touched: boolean;
	value: string;
}

interface ProtectedRouteProps extends RouteProps {
	authType: string;
	component: any;
}

const PrivateRoute: FC<ProtectedRouteProps> = props => {
	const { component: Component, authType, ...rest } = props;

	const { isAuthenticated, setIsAuthenticated, login } = useContext(
		AuthContext,
	);

	const [formIsValid, setFormIsValid] = useState(false);
	const [form, setForm] = useState<InputField[]>([
		{
			label: "Käyttäjänimi",
			type: InputTypes.text,
			name: "username",
			required: true,
			valid: false,
			touched: false,
			value: "",
		},
		{
			label: "Salasana",
			type: InputTypes.password,
			name: "password",
			required: true,
			valid: false,
			touched: false,
			value: "",
		},
	]);
	const [sessionCookies] = useState<Cookies>(new Cookies());

	useEffect(() => {
		const token = sessionCookies.get("keycloak-token");
		const refreshToken = sessionCookies.get("keycloak-refresh-token");
		const hash = sessionCookies.get("hoivakoti_session");

		if (token && refreshToken && hash) {
			axios
				.post(`${config.API_URL}/auth/refresh-token`, {
					token: refreshToken,
					hash,
					authType,
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
	}, [sessionCookies, setIsAuthenticated, authType]);

	const handleLogin = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();

		const formData: any = {};

		for (const field of form) {
			formData[field.name] = field.value;
		}

		login(formData, authType);
	};

	const validateForm = (): void => {
		let validForm = true;

		const validatedForm = [...form];

		for (const input of validatedForm) {
			const validField = input.value !== "";

			if (!validField) {
				validForm = false;
			}
		}

		setFormIsValid(validForm);
	};

	const handleInputChange = (input: InputField, newValue: string): void => {
		const { name } = input;

		const newInput = { ...input };

		newInput.valid = newValue !== "";
		newInput.touched = true;

		newInput.value = newValue;

		const updateForm = [...form];
		const index = updateForm.findIndex(field => field.name === name);

		updateForm[index] = newInput;

		setForm(updateForm);
	};

	return isAuthenticated ? (
		<Route {...rest} render={routeProps => <Component {...routeProps} />} />
	) : (
		<div className="auth-container">
			<form className="login-form" onSubmit={handleLogin}>
				<h2>Kirjaudu työkaluun</h2>
				{form.map((input: InputField, index: number) => {
					const inputInvalid =
						input.required && input.touched && !input.valid;

					return (
						<div className="field" key={`${input.name}_${index}`}>
							<label className="label" htmlFor={input.type}>
								{input.label}
								<span className="asterisk" aria-hidden="true">
									{" "}
									*
								</span>
							</label>
							<div className="control">
								<input
									className="input"
									type={input.type}
									name={input.name}
									id={input.name}
									value={input.value}
									required={input.required}
									aria-required={input.required}
									onChange={event => {
										handleInputChange(
											input,
											event.target.value,
										);
									}}
									onBlur={validateForm}
								></input>
								{inputInvalid ? (
									<span className="icon"></span>
								) : null}
							</div>
							{inputInvalid ? (
								<p className="help">Kenttä on pakollinen</p>
							) : null}
						</div>
					);
				})}
				<div className="button-container">
					<button
						className="btn"
						type="submit"
						disabled={!formIsValid}
					>
						Kirjaudu sisään
					</button>
				</div>
			</form>
		</div>
	);
};

export default PrivateRoute;
