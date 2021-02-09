import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	// GetAllRatings,
	GetNursingHome as GetNursingHomeDB,
	DeleteAllNursingHomes,
	DropAndRecreateNursingHomeTable,
	DropAndRecreateNursingHomePicturesTable,
	DropAndRecreateNursingHomeSurveyAnswersTable,
	DropAndRecreateNursingHomeSurveyScoresTable,
	DropAndRecreateNursingHomeSurveyTotalScoresTable,
	DropAndRecreateNursingHomeSurveyQuestionsTable,
	DropAndRecreateReportsTable,
	GetAllPicturesAndDescriptions,
	GetPicturesAndDescriptions,
	GetPicData,
	GetPdfData,
	GetNursingHomeStatus,
	GetNursingHomeRating,
	GetPicCaptions,
	GetPicDigests,
	GetAllPicDigests,
	GetAllNursingHomeStatus,
	GetAllNursingHomeRatings,
	GetNursingHomeSurveyResults,
	GetDistinctCities,
	GetNursingHomeVacancyStatus as GetNursingHomeVacancyStatusDB,
	UpdateNursingHomeInformation as UpdateNursingHomeInformationDB,
	UpdateNursingHomeVacancyStatus as UpdateNursingHomeVacancyStatusDB,
	UploadNursingHomeReport as UploadNursingHomeReportDB,
	UpdateNursingHomeImage as UpdateNursingHomeImageDB,
	GetAllBasicUpdateKeys,
	GetLoginCookieHash,
	GetHasLogin,
	GetIsValidSurveyKey,
	BasicUpdateKeyEntry,
	AddNursingHomeSurveyKeys as AddNursingHomeSurveyKeysDB,
	DeleteNursingHome as DeleteNursingHomeDB,
	DeleteNursingHomePics,
	AddNursingHomeSurveyQuestion as AddNursingHomeSurveyQuestionDB,
	UpdateNursingHomeSurveyQuestion as UpdateNursingHomeSurveyQuestionDB,
	SubmitSurveyData as SubmitSurveyDataDB,
	SubmitSurveyResponse as SubmitSurveyResponseDB,
	GetSurvey as GetSurveyDB,
	GetCommunesForNursingHome,
	UpdateCommunesForNursingHome,
} from "./models";

import { NursingHomesFromCSV, FetchAndSaveImagesFromCSV } from "./services";
import Knex = require("knex");
import { Context } from "koa";
import { Commune, NursingHome } from "./nursinghome-typings";

export async function AddNursingHome(ctx: any): Promise<string> {
	await InsertNursingHomeToDB({
		name: ctx.request.body.name,
		owner: ctx.request.body.name,
		address: ctx.request.body.address,
		city: ctx.request.body.city,
		postal_code: ctx.request.body.postal_code,
	});
	return "inserted";
}

export async function ListNursingHomes(ctx: any): Promise<Knex.Table> {
	const nursing_homes = await GetAllNursingHomes();
	nursing_homes.sort((a: NursingHome, b: NursingHome) => {
		if (a.has_vacancy && !b.has_vacancy) return -1;
		if (!a.has_vacancy && b.has_vacancy) return 1;
		return a.name.localeCompare(b.name);
	});

	const pic_digests = await GetAllPicDigests();
	const report_status = await GetAllNursingHomeStatus();
	const ratings = await GetAllNursingHomeRatings();

	nursing_homes.map((nursinghome: any) => {
		nursinghome.pic_digests = {};
		nursinghome.pics = [];
		pic_digests.map((digests: any) => {
			if (digests.nursinghome_id === nursinghome.id) {
				nursinghome.pic_digests = digests;

				const available_pics = Object.keys(digests)
					.filter((item: any) =>
						digests[item] != null ? true : false,
					)
					.map((item: any) => item.replace("_hash", ""));
				nursinghome.pics = available_pics;
			}
		});

		nursinghome.report_status = [];
		report_status.map((status: any) => {
			if (status.nursinghome_id === nursinghome.id) {
				nursinghome.report_status = [status];
			}
		});

		nursinghome.rating = {};
		nursinghome.rating.average_relatives = null;
		nursinghome.rating.average_customers = null;
		nursinghome.rating.answers_relatives = 0;
		nursinghome.rating.answers_customers = 0;
		ratings.map((rating: any) => {
			if (rating.nursinghome_id === nursinghome.id) {
				nursinghome.rating.average_relatives = rating.average_relatives;
				nursinghome.rating.answers_relatives = rating.answers_relatives;
				nursinghome.rating.average_customers = rating.average_customers;
				nursinghome.rating.answers_customers = rating.answers_customers;
			}
		});

		delete nursinghome.vacancy_last_updated_at;
		delete nursinghome.basic_update_key;
	});

	return nursing_homes;
}

export async function GetNursingHome(ctx: any): Promise<any> {
	const nursing_home_data = (await GetNursingHomeDB(ctx.params.id))[0];
	const pic_digests = (await GetPicDigests(ctx.params.id))[0];
	const pic_captions = (await GetPicCaptions(ctx.params.id))[0];
	const nursing_home_status = await GetNursingHomeStatus(ctx.params.id);
	const rating = (await GetNursingHomeRating(ctx.params.id))[0];
	const available_pics = Object.keys(pic_digests || {})
		.filter((item: any) => (pic_digests[item] != null ? true : false))
		.map((item: any) => item.replace("_hash", ""));
	Object.keys(pic_digests || {})
		.filter((item: any) => (pic_digests[item] != null ? true : false))
		.map((item: any) => item.replace("_hash", ""));

	delete nursing_home_data.vacancy_last_updated_at;
	delete nursing_home_data.basic_update_key;

	nursing_home_data["pic_digests"] = pic_digests;
	nursing_home_data["pics"] = available_pics;
	nursing_home_data["pic_captions"] = pic_captions;
	nursing_home_data["report_status"] =
		nursing_home_status.length > 0 ? nursing_home_status : null;
	nursing_home_data["rating"] = rating;
	return nursing_home_data;
}

export async function AddNursingHomesFromCSV(ctx: any): Promise<string | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const csv: string = ctx.request.body.csv;

	const records = await NursingHomesFromCSV(csv);

	return records;
}

export async function DeleteNursingHomes(ctx: any): Promise<number | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const result = await DeleteAllNursingHomes();
	return result;
}

export async function DeleteNursingHome(ctx: any): Promise<number | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	console.log(adminPw);
	console.log(requestPw);
	if (!isPwValid) return null;

	const id = ctx.params.id;

	const result = await DeleteNursingHomeDB(id);
	await DeleteNursingHomePics(id);
	return result;
}

export async function UpdateNursingHomeInformation(
	ctx: Context,
): Promise<boolean> {
	const { id, key } = ctx.params;

	const body: NursingHome = ctx.request.body;

	return await UpdateNursingHomeInformationDB(id, key, body);
}

export async function DropAndRecreateTables(ctx: any): Promise<void | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const result1 = await DropAndRecreateNursingHomeTable();
	const result2 = await DropAndRecreateNursingHomePicturesTable();
	return result1;
}

export async function DropAndRecreateSurveyAnswerTables(
	ctx: any,
): Promise<void | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const result1 = await DropAndRecreateNursingHomeSurveyAnswersTable();
	const result2 = await DropAndRecreateNursingHomeSurveyScoresTable();
	const result3 = await DropAndRecreateNursingHomeSurveyTotalScoresTable();
	return result1;
}

export async function DropAndRecreateSurveyTotalScoreTable(
	ctx: any,
): Promise<void | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;
	const result = await DropAndRecreateNursingHomeSurveyTotalScoresTable();
	return result;
}

export async function DropAndRecreateSurveyTables(ctx: any): Promise<void | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const result1 = await DropAndRecreateNursingHomeSurveyAnswersTable();
	const result2 = await DropAndRecreateNursingHomeSurveyScoresTable();
	const result3 = await DropAndRecreateNursingHomeSurveyTotalScoresTable();
	const result4 = await DropAndRecreateNursingHomeSurveyQuestionsTable();
	return result1;
}

export async function DropAndRecreateReportsTables(
	ctx: any,
): Promise<void | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const result1 = await DropAndRecreateReportsTable();
	return result1;
}

export async function UploadPics(ctx: any): Promise<string | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const csv: string = ctx.request.body.csv;

	const result = await FetchAndSaveImagesFromCSV(csv);

	return result;
}

export async function GetAllPicsAndDescriptions(ctx: any): Promise<Knex.Table> {
	return await GetAllPicturesAndDescriptions();
}

export async function GetPicsAndDescriptions(ctx: any): Promise<any[]> {
	return await GetPicturesAndDescriptions(ctx.params.id);
}

export async function GetPic(ctx: any): Promise<any> {
	const pic_and_hash = (await GetPicData(ctx.params.id, ctx.params.pic))[0];
	const pic_data = pic_and_hash[ctx.params.pic];
	if (pic_data) {
		ctx.response.set("Content-Type", "image/jpeg");
		ctx.response.set("Content-Length", pic_data.length);
		ctx.response.set(
			"Digest",
			"sha-256=" + pic_and_hash[ctx.params.pic + "_hash"],
		);
		if (ctx.params.digest)
			ctx.response.set(
				"Cache-Control",
				"public,max-age=31536000,immutable",
			);

		return pic_data;
	} else {
		// eslint-disable-next-line require-atomic-updates
		ctx.response.status = 404;
		return "No image found";
	}
}

export async function GetCaptions(ctx: any): Promise<any> {
	const captions = (await GetPicCaptions(ctx.params.id))[0];
	return captions;
}

export async function GetPdf(ctx: any): Promise<any> {
	const document = (await GetPdfData(ctx.params.id))[ctx.params.key];
	if (document) {
		ctx.response.set("Content-Type", "application/pdf");
		ctx.response.set("Content-Length", document.length);

		if (ctx.params.digest)
			ctx.response.set(
				"Cache-Control",
				"public,max-age=31536000,immutable",
			);

		return document.report_file;
	} else {
		// eslint-disable-next-line require-atomic-updates
		ctx.response.status = 404;
		return "No document found";
	}
}

export async function GetCities(ctx: any): Promise<any> {
	const cities = await GetDistinctCities();
	return cities.map((item: any) => item.city);
}

export async function GetNursingHomeVacancyStatus(
	ctx: Context,
): Promise<{
	has_vacancy: boolean;
	vacancy_last_updated_at: string | null;
} | null> {
	const { id, key } = ctx.params;
	return await GetNursingHomeVacancyStatusDB(id, key);
}

export async function UpdateNursingHomeVacancyStatus(
	ctx: Context,
): Promise<boolean> {
	const { id, key } = ctx.params;
	const has_vacancy: boolean = ctx.request.body.has_vacancy;
	if (typeof has_vacancy !== "boolean")
		throw new Error("Invalid value in field 'has_vacancy'!");

	return await UpdateNursingHomeVacancyStatusDB(id, key, has_vacancy);
}

export async function UpdateNursingHomeImage(ctx: Context): Promise<boolean> {
	const { id, key } = ctx.params;
	const image: any = ctx.request.body.image;

	return await UpdateNursingHomeImageDB(id, key, image);
}

export async function UploadNursingHomeReport(ctx: Context): Promise<boolean> {
	const loggedIn = await GetHasLogin(ctx.get("authentication") as string);

	if (loggedIn) {
		const { id } = ctx.params;
		const date: string = ctx.request.body.date;
		const type: string = ctx.request.body.type;
		const status: string = ctx.request.body.status;
		const file: any = ctx.request.body.file;

		return await UploadNursingHomeReportDB(id, date, type, status, file);
	}
	return false;
}

interface Secrets {
	basicUpdateKeys: BasicUpdateKeyEntry[];
}

export async function AdminRevealSecrets(
	ctx: Context,
): Promise<Secrets | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;
	const basicUpdateKeys = await GetAllBasicUpdateKeys();
	return {
		basicUpdateKeys,
	};
}

export async function AdminLogin(ctx: Context): Promise<string | null> {
	const adminPw = process.env.VALVONTA_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) {
		ctx.response.status = 401;
		return "";
	}

	const hash = await GetLoginCookieHash();
	console.log(hash);
	return hash;
}

export async function CheckLogin(ctx: Context): Promise<string | null> {
	const loggedIn = await GetHasLogin(ctx.get("authentication") as string);
	if (loggedIn) {
		return "OK";
	} else {
		ctx.response.status = 401;
		return "";
	}
}

export async function CheckSurveyKey(ctx: Context): Promise<string | null> {
	const valid = await GetIsValidSurveyKey(ctx.request.body.surveyKey);
	if (valid) {
		return "OK";
	} else {
		ctx.response.status = 401;
		return "";
	}
}

export async function AddNursingHomeSurveyQuestion(
	ctx: Context,
): Promise<string | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	for (const question of ctx.request.body.questions) {
		const res = await AddNursingHomeSurveyQuestionDB(
			question.survey_id,
			question.order,
			question.question_type,
			question.question_fi,
			question.question_sv,
			question.question_description_fi,
			question.question_description_sv,
			question.question_icon,
			question.active,
		);
	}
	return "inserted";
}

export async function UpdateNursingHomeSurveyQuestion(
	ctx: Context,
): Promise<string | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const res = await UpdateNursingHomeSurveyQuestionDB(
		ctx.request.body.id,
		ctx.request.body.survey_id,
		ctx.request.body.order,
		ctx.request.body.question_type,
		ctx.request.body.question_fi,
		ctx.request.body.question_sv,
		ctx.request.body.question_description_fi,
		ctx.request.body.question_description_sv,
		ctx.request.body.question_icon,
		ctx.request.body.active,
	);
	return "updated";
}

export async function AddNursingHomeSurveyKeys(
	ctx: Context,
): Promise<any[] | null> {
	const adminPw = process.env.ADMIN_PASSWORD;
	const requestPw = ctx.request.body && ctx.request.body.adminPassword;
	const isPwValid =
		typeof adminPw === "string" &&
		adminPw.length > 0 &&
		requestPw === adminPw;
	if (!isPwValid) return null;

	const res = await AddNursingHomeSurveyKeysDB(ctx.request.body.amount);
	return res;
}

export async function SubmitSurveyData(
	ctx: Context
):Promise<string | null>{
	const loggedIn = await GetHasLogin(ctx.get('authentication') as string);

	if (loggedIn) {
		const { id } = ctx.params;
		const surveyData = ctx.request.body.survey;

		return await SubmitSurveyDataDB(id, surveyData);
	}
	return null;
}

export async function SubmitSurveyResponse(
	ctx: Context,
): Promise<string | null> {
	const { id } = ctx.params;
	const res = await SubmitSurveyResponseDB(
		ctx.request.body.survey,
		id,
		ctx.request.body.surveyKey,
	);
	return "";
}

export async function GetSurvey(surveyId: string): Promise<any> {
	const survey = await GetSurveyDB(surveyId);
	return survey;
}

export async function GetSurveyWithNursingHomeResults(
	surveyId: string,
	nursingHomeId: string,
): Promise<any> {
	const survey = await GetSurveyDB(surveyId);
	const results = await GetNursingHomeSurveyResults(nursingHomeId);

	survey.map((question: any) => {
		question.average = 0;
		question.answers = 0;
		results.map((result: any) => {
			if (result.question_id === question.id) {
				question.average = result.average;
				question.answers = result.answers;
			}
		});
	});

	return survey;
}

export async function GetNursingHomeCommunes(ctx: Context): Promise<any> {
	const { id } = ctx.params;

	const result = await GetCommunesForNursingHome(id);

	return result[0] ? result[0].communes : [];
}

export async function UpdateNursingHomeCommunes(ctx: Context): Promise<any> {
	const { id } = ctx.params;
	const communes = ctx.request.body.communes;

	const result = await UpdateCommunesForNursingHome(id, communes);

	return result;
}
