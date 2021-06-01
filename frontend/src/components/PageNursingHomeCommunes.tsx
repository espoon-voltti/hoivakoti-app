import axios from "axios";
import React, { FormEvent, Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCurrentLanguage, useT } from "../i18n";
import Commune from "../shared/types/commune";
import { Translation } from "../shared/types/translation";
import Checkbox from "./Checkbox";
import config from "./config";
import { GetNursingHomeResponse, NursingHome } from "./types";

import "../styles/PageUpdate.scss";

interface ParamsTypes {
	id: string;
}

const requestCommunesUpdate = async (
	id: string,
	communes: Commune[],
): Promise<void> => {
	try {
		await axios.post(`${config.API_URL}/nursing-homes/${id}/communes`, {
			// eslint-disable-next-line @typescript-eslint/camelcase
			customer_commune: communes,
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const PageNursingHomeCommunes: React.FC = () => {
	const { id } = useParams<ParamsTypes>();

	if (!id) throw new Error("Invalid URL!");

	const currentLanguage = useCurrentLanguage();

	const [nursingHome, setNursingHome] = useState<NursingHome>();
	const [communes, setCommunes] = useState<Commune[]>([]);
	const [popupState, setPopupState] = useState<
		null | "saving" | "saved" | "failed"
	>(null);

	const LUCommunes: Translation = {
		[Commune.EPO]: useT("espoo"),
		[Commune.HNK]: useT("hanko"),
		[Commune.INK]: useT("inkoo"),
		[Commune.KAU]: useT("kauniainen"),
		[Commune.PKA]: useT("karviainen"),
		[Commune.KRN]: useT("kirkkonummi"),
		[Commune.LHJ]: useT("lohja"),
		[Commune.RPO]: useT("raasepori"),
		[Commune.STO]: useT("siuntio"),
	};

	const updatePopupSaved = useT("saved");
	const updatePopupSaving = useT("saving");
	const cancel = useT("cancel");
	const btnSave = useT("btnSave");
	const customerCommune = useT("customerCommune");

	useEffect(() => {
		axios
			.get(`${config.API_URL}/nursing-homes/${id}`)
			.then((response: GetNursingHomeResponse) => {
				const data = response.data;

				if (data) {
					setNursingHome(data);

					const communes = data.customer_commune;

					if (communes && communes.length) {
						setCommunes(communes);
					}
				}
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>): void => {
		e.preventDefault();

		window.location.href = `/${currentLanguage}/valvonta`;
	};

	const onSubmitHandler = async (event: FormEvent): Promise<void> => {
		event.preventDefault();
		try {
			setPopupState("saving");

			await requestCommunesUpdate(id, communes);

			setPopupState("saved");
		} catch (error) {
			console.log(error);

			throw error;
		}
	};

	const onCommuneChangedHandler = (
		checked: boolean,
		commune: Commune,
	): void => {
		let newCommunes = [...communes];

		if (checked) {
			if (!newCommunes.includes(commune)) {
				newCommunes.push(commune);
			}
		} else {
			newCommunes = newCommunes.filter(item => {
				return item !== commune;
			});
		}

		setCommunes(newCommunes);
	};

	return (
		<Fragment>
			{nursingHome && communes ? (
				<div className="page-update">
					<div className="page-update-content">
						<form
							className="page-update-controls"
							onSubmit={onSubmitHandler}
						>
							<div className="nav-save">
								{popupState && (
									<span className="page-update-popup">
										{popupState === "saving"
											? updatePopupSaving
											: updatePopupSaved}
									</span>
								)}
								<button
									className="page-update-cancel"
									onClick={cancelEdit}
								>
									{cancel}
								</button>
								<button
									type="submit"
									className="btn page-update-submit"
								>
									{btnSave}
								</button>
							</div>
							<h1 className="page-update-title">
								{nursingHome.name}
							</h1>
							<div className="page-update-section">
								<div className="checkbox-columns">
									<fieldset className="field">
										<legend>{customerCommune}</legend>
										<div className="control">
											{[...Object.keys(LUCommunes)].map(
												communeKey => {
													return (
														<Checkbox
															key={communeKey}
															id={communeKey}
															name={
																LUCommunes[
																	communeKey
																]
															}
															onChange={(
																checked: boolean,
															) => {
																onCommuneChangedHandler(
																	checked,
																	communeKey as Commune,
																);
															}}
															isChecked={
																communes
																	? communes.includes(
																			communeKey as Commune,
																	  )
																	: false
															}
														>
															{
																LUCommunes[
																	communeKey
																]
															}
														</Checkbox>
													);
												},
											)}
										</div>
									</fieldset>
								</div>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</Fragment>
	);
};

export default PageNursingHomeCommunes;
