import React, { FC, useEffect, useState } from "react";
import { useT } from "../i18n";
import "../styles/PageUploadReport.scss";
import Radio from "./Radio";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { GetNursingHomeResponse } from "./PageNursingHome";
import { NursingHome } from "./types";
import Cookies from "universal-cookie";

interface NursingHomeStatus {
	status: string;
	date: string;
}

const formatDate = (dateStr: string | null): string => {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	const YYYY = String(date.getUTCFullYear());
	const MM = String(date.getUTCMonth() + 1);
	const DD = String(date.getUTCDate());
	return `${DD}.${MM}.${YYYY}`;
};

const requestReportStatusUpdate = async (
	id: string,
	key:string,
	reportStatus: string,
	reportDate: string,
	reportFile: string,
): Promise<void> => {
	await axios.post(
		`${config.API_URL}/nursing-homes/${id}/report-status/`,
		{ 
			status: reportStatus,
			date: reportDate,
			file: reportFile
		},
		{headers:{Authentication: key}}
	);
};

const PageUploadReport: FC = () => {
	const sessionCookies = new Cookies();

	const { id } = useParams();
	const key = sessionCookies.get("hoivakoti_session");
	const [nursingHome, setNursingHome] = useState<NursingHome | null>(null);
	const [popupState, setPopupState] = useState<null | "saving" | "saved" | "failed">(
		null,
	);

	const [nursingHomeState, setNursingHomeState] = useState<string>("");
	const [reportDate, setReportDate] = useState<string>("");
	const [reportFile, setReportFile] = useState<string>("");

	if (!id) throw new Error("Invalid URL!");

	useEffect(() => {
		axios
			.get(config.API_URL + "/admin/login", {headers:{Authentication: key}})
			.then(function() {
				
			})
			.catch((error: Error) => {
				console.error(error.message);
				window.location.href = "/valvonta";
			});

		axios
			.get(`${config.API_URL}/nursing-homes/${id}`)
			.then((response: GetNursingHomeResponse) => {
				setNursingHome(response.data);
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}, [id]);

	const title = useT("pageUploadReportTitle");
	const loadingText = useT("loadingText");
	const status = useT("status");
	const lastUpdate = useT("lastUpdate");
	const btnSave = useT("btnSave");


	const updatePopupSaved = useT("saved");
	const updatePopupFailed= useT("reportFailed");
	const updatePopupSaving = useT("saving");


	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		if(nursingHomeState && reportDate && reportFile){
			setPopupState("saving");
			const dateObj = new Date(reportDate);
			console.log(nursingHomeState);
			await requestReportStatusUpdate(id, key, nursingHomeState, dateObj.toISOString(), reportFile);
			axios
				.get(`${config.API_URL}/nursing-homes/${id}`)
				.then((response: GetNursingHomeResponse) => {
					setNursingHome(response.data);
				})
				.catch(e => {
					console.error(e);
					throw e;
			});
			setPopupState("saved");
		}else{
			setPopupState("failed");
		}
	};

	const cancelEdit = (e: React.FormEvent<HTMLButtonElement>):void => {
		e.preventDefault();
		window.location.href = "/valvonta";
	};

	const [reportFileName, setReportFileName] = useState<string>(useT("selectFile"));

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		): void => {
		let file = new Blob;
		
		if (event.target.files && event.target.files.length > 0) { 
			file = event.target.files[0]; 
			setReportFileName(event.target.files[0].name);

			const reader = new FileReader();
			reader.onloadend = e => {
				setReportFile(reader.result as string);
			}
			reader.readAsDataURL(file);
		}
	};

	const reportStatusOk = useT("status_ok");
	const reportStatusSmall = useT("status_small");
	const reportStatusSignificant = useT("status_significant");
	const reportStatusSurvaillance = useT("status_survaillance");
	const reportStatusNoInfo = useT("status_no_info");

	let reportStatus = useT("status_waiting");

	const getStatusTranslation = (statusStr: string): string => {
		if(nursingHome && nursingHome.report_status){

			switch (statusStr) {
				case "ok":
					reportStatus = reportStatusOk;
				break;
				case "small":
					reportStatus = reportStatusSmall;
				break;
				case "significant":
					reportStatus = reportStatusSignificant;
				break;
				case "survaillance":
					reportStatus = reportStatusSurvaillance;
				break;
				case "no-info":
					reportStatus = reportStatusNoInfo;
				break;
			}
		}
		return reportStatus;
	}

	return (
		<div className="page-update">
			<div className="page-update-content">
				{!nursingHome ? (
					<h1>{loadingText}</h1>
				) : (
					<>
					<h1 className="page-update-title">{title}</h1>
					<form
							className="page-update-controls"
							onSubmit={handleSubmit}
						>
					<div className="nav-save">
						<button className="page-update-cancel" onClick={cancelEdit}>Takaisin listaukseen</button>
						<button type="submit" className="btn">{btnSave}</button>

						{popupState && (
							<span className={popupState === "failed" ? "page-update-popup-failed" : "page-update-popup"}>
								{popupState === "saving"
									? updatePopupSaving
									: popupState === "failed"
									? updatePopupFailed
									: updatePopupSaved}
							</span>
						)}
					</div>
					<div className="page-update-section">
						
						<h3 className="page-update-data page-update-data-nursing-home-name">{nursingHome.name}</h3>
						<h4 className="page-update-data page-update-data-nursing-home-owner">{nursingHome.owner}</h4>
						<p className="page-update-data">
							<strong>Osoite: </strong>
							{nursingHome.address}
						</p>
						<p className="page-update-data">
							<strong>{status}: </strong>
							{nursingHome.report_status
								? getStatusTranslation(nursingHome.report_status.status)
									: getStatusTranslation("waiting")}
						</p>
						<p className="page-update-data">
							<strong>{lastUpdate}: </strong>
							{nursingHome.report_status
								? formatDate(nursingHome.report_status.date)
								: "-"}
						</p>
							</div>
							<div className="page-update-section">
								<h3 className="page-report-minor-title">{"Käyntipäivämäärä*:"}</h3>
								
								<input className="page-report-datepicker" type="date" value={reportDate} onChange={(event: React.ChangeEvent<HTMLInputElement>,): void => {setReportDate(event.target.value)}}></input>
								
								<h3 className="page-report-minor-title">{"Hoivakodin tilanne*:"}</h3>
								
								<Radio
									id="nursinghome-status-ok"
									name="update-vacancy-true"
									isSelected={nursingHomeState == "ok"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("ok");
									}}
								>
									{"Kaikki kunnossa"}
								</Radio>
								<Radio
									id="nursinghome-status-small"
									name="nursinghome-status-small"
									isSelected={nursingHomeState == "small"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("small");
									}}
								>
									{"Pientä parannettavaa"}
								</Radio>
								<Radio
									id="nursinghome-status-true-significant"
									name="nursinghome-status-significant"
									isSelected={nursingHomeState == "significant"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("significant");
									}}
								>
									{"Merkittävästi parannettavaa"}
								</Radio>
								<Radio
									id="nursinghome-status-surveillance"
									name="nursinghome-status-surveillance"
									isSelected={nursingHomeState == "surveillance"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("surveillance");
									}}
								>
									{"Tehostetussa valvonnassa"}
								</Radio>
								<Radio
									id="nursinghome-status-waiting"
									name="nursinghome-status-waiting"
									isSelected={nursingHomeState == "waiting"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("waiting");
									}}
								>
									{"Odottaa käyntiä"}
								</Radio>
								<Radio
									id="nursinghome-status-no-info"
									name="nursinghome-status-no-info"
									isSelected={nursingHomeState == "no-info"}
									onChange={isChecked => {
										if (isChecked) setNursingHomeState("no-info");
									}}
								>
									{"Sijaintikunta valvoo. Tietoja ei saatavilla."}
								</Radio>
							</div>
							<div className="page-update-section">
							<h3 className="page-report-minor-title">{"Lisää käyntiraportti (.pdf)*"}</h3>
								
								<div className="page-report-file">{reportFileName}</div>
								<div className="page-report-file-drop">
									<h1>Lataa liite</h1>
									<p>Selaa tiedostoja painamalla</p>
								</div>
								<input type="file" className="page-report-input-hidden" onChange={handleFileChange} title={"Lataa raportti"}/>
							</div>
						</form>
				
						
					</>
				)}
			</div>
		</div>
	);
};

export default PageUploadReport;