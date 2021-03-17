import React, { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps } from "react-router-dom";

import { AuthContext } from "./auth-context";

import InputTypes from "../shared/types/input-types";

import "../styles/Auth.scss";
import AuthTypes from "../shared/types/auth-types";

import { useT } from "../i18n";

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

	const { isAuthenticated, login, refreshToken } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [formIsValid, setFormIsValid] = useState<boolean>(false);
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

	useEffect(() => {
		refreshToken(authType).then(() => {
			setIsLoading(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadingText = useT("loadingText");

	const handleLogin = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();

		const formData: any = {};

		for (const field of form) {
			formData[field.name] = field.value;
		}

		await login(formData, authType as AuthTypes);
	};

	const validateForm = (): void => {
		let validForm = true;

		for (const input of form) {
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

	const auth: JSX.Element | null = isAuthenticated ? (
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

	return isLoading ? (
		<div className="auth-container">
			<h2>{loadingText}</h2>
		</div>
	) : (
		auth
	);
};

export default PrivateRoute;
