/* eslint-disable require-atomic-updates */
import Router from "@koa/router";

import {
	AddNursingHome,
	ListNursingHomes,
	// ListRatings,
	GetNursingHome,
	AddNursingHomesFromCSV,
	DeleteNursingHomes,
	DeleteNursingHome,
	DropAndRecreateTables,
	DropAndRecreateSurveyAnswerTables,
	DropAndRecreateSurveyTables,
	DropAndRecreateSurveyTotalScoreTable,
	DropAndRecreateReportsTables,
	UploadPics,
	GetAllPicsAndDescriptions,
	GetPicsAndDescriptions,
	GetPic,
	GetPdf,
	GetCaptions,
	GetCities,
	GetNursingHomeVacancyStatus,
	UpdateNursingHomeInformation,
	UpdateNursingHomeImage,
	UploadNursingHomeReport,
	AdminRevealSecrets,
	AddNursingHomeSurveyQuestion,
	UpdateNursingHomeSurveyQuestion,
	SubmitSurveyData,
	SubmitSurveyResponse,
	SubmitFeedbackResponse,
	GetSurveyWithNursingHomeResults,
	GetSurveyTextResults,
	AddNursingHomeSurveyKeys,
	GetSurvey,
	AdminLogin,
	CheckLogin,
	CheckSurveyKey,
	UpdateNursingHomeVacancyStatus,
	UpdateNursingHomeCustomerCommunes,
	GetAllSurveyTextResults,
	UpdateSurveyTextState,
	DeleteRejectedSurveyTextResults,
	GetSurveyApprovedResults,
} from "./controllers";
import config from "./config";

const router = new Router();

router.get("/api", async ctx => {
	ctx.body = "maybe docs here";
});

router.get("/api/version", async ctx => {
	ctx.body = "v2";
});

router.get("/api/nursing-homes", async ctx => {
	ctx.body = await ListNursingHomes(ctx);
});

router.get("/api/nursing-homes/cities", async ctx => {
	ctx.body = await GetCities(ctx);
});

/* DON'T ENABLE WITHOUT ADDING AUTHORIZATION TO ADDNURSINGHOME CONTROLLER
router.post("/api/nursing-homes", async ctx => {
	ctx.body = await AddNursingHome(ctx);
});*/

router.post("/api/nursing-homes/csv", async ctx => {
	ctx.body = await AddNursingHomesFromCSV(ctx);
});

router.get("/api/nursing-homes/delete-all", async ctx => {
	ctx.body = await DeleteNursingHomes(ctx);
});

router.post("/api/nursing-homes/drop-table", async ctx => {
	ctx.body = await DropAndRecreateTables(ctx);
});

router.post("/api/nursing-homes/drop-survey-answers", async ctx => {
	ctx.body = await DropAndRecreateSurveyAnswerTables(ctx);
});

router.post("/api/nursing-homes/recalculate-survey-total-scores", async ctx => {
	ctx.body = await DropAndRecreateSurveyTotalScoreTable(ctx);
});

router.post("/api/nursing-homes/drop-surveys", async ctx => {
	ctx.body = await DropAndRecreateSurveyTables(ctx);
});

router.post("/api/nursing-homes/drop-reports", async ctx => {
	ctx.body = await DropAndRecreateReportsTables(ctx);
});

router.post("/api/nursing-homes/upload-pics", async ctx => {
	ctx.body = await UploadPics(ctx);
});

router.get("/api/nursing-homes/:id", async ctx => {
	ctx.body = await GetNursingHome(ctx);
});

router.del("/api/nursing-homes/:id", async ctx => {
	ctx.body = await DeleteNursingHome(ctx);
});

router.post("/api/nursing-homes/:id/update/:key", async ctx => {
	const success = await UpdateNursingHomeInformation(ctx);
	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or key" };
	} else {
		ctx.body = { success };
	}
});

router.get("/api/nursing-homes/:id/pics", async ctx => {
	ctx.body = await GetPicsAndDescriptions(ctx);
});

router.get("/api/nursing-homes/:id/pics/captions", async ctx => {
	ctx.body = await GetCaptions(ctx);
});

router.get("/api/nursing-homes/:id/pics/:pic/:digest", async ctx => {
	ctx.body = await GetPic(ctx);
});

router.get("/api/nursing-homes/:id/vacancy-status/:key", async ctx => {
	const status = await GetNursingHomeVacancyStatus(ctx);
	if (status === null) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or key" };
	} else {
		ctx.body = status;
	}
});

router.post("/api/nursing-homes/:id/vacancy-status/:key", async ctx => {
	const success = await UpdateNursingHomeVacancyStatus(ctx);
	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or key" };
	} else {
		ctx.body = { success };
	}
});

router.get("/api/nursing-homes/:id/raportti/:key/:file", async ctx => {
	ctx.body = await GetPdf(ctx);
});

router.post("/api/nursing-homes/:id/update-image/:key", async ctx => {
	const success = await UpdateNursingHomeImage(ctx);
	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or key" };
	} else {
		ctx.body = { success };
	}
});

router.post("/api/nursing-homes/:id/report-status", async ctx => {
	const success = await UploadNursingHomeReport(ctx);
	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or session key" };
	} else {
		ctx.body = { success };
	}
});

router.post("/api/nursing-homes/:id/communes", async ctx => {
	const res = await UpdateNursingHomeCustomerCommunes(ctx);

	ctx.body = { success: res };
});

router.get("/api/health", async ctx => {
	ctx.body = "healthy";
});

router.get("/api/node-env-test", async ctx => {
	ctx.body = config.nodeEnv;
});

router.get("/api/all-pics", async ctx => {
	ctx.body = await GetAllPicsAndDescriptions(ctx);
});

router.post("/api/admin/reveal-secrets", async ctx => {
	const secrets = await AdminRevealSecrets(ctx);
	ctx.body = { secrets };
});

router.get("/api/admin/login", async ctx => {
	ctx.body = await CheckLogin(ctx);
});

router.post("/api/admin/login", async ctx => {
	const secrets = await AdminLogin(ctx);
	ctx.body = secrets;
});

router.post("/api/admin/add-keys", async ctx => {
	const keys = await AddNursingHomeSurveyKeys(ctx);
	ctx.body = keys;
});

router.post("/api/survey/add-questions", async ctx => {
	const res = await AddNursingHomeSurveyQuestion(ctx);
	ctx.body = res;
});

router.post("/api/survey/update-question", async ctx => {
	const res = await UpdateNursingHomeSurveyQuestion(ctx);
	ctx.body = res;
});

router.post("/api/survey/check-key", async ctx => {
	const res = await CheckSurveyKey(ctx);
	ctx.body = res;
});

router.get("/api/survey/text-results", async ctx => {
	const success = await GetAllSurveyTextResults(ctx);

	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or session key" };
	} else {
		ctx.body = success;
	}
});

router.delete("/api/survey/text-results", async ctx => {
	const res = await DeleteRejectedSurveyTextResults(ctx);

	if (!res.authenticated) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or session key" };
	} else {
		ctx.body = { success: res.success };
	}
});

router.post("/api/survey/text-results", async ctx => {
	const success = await UpdateSurveyTextState(ctx);

	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or session key" };
	} else {
		ctx.body = { success };
	}
});

router.post("/api/survey/:id/manual-entry", async ctx => {
	const res = await SubmitSurveyData(ctx);
	ctx.body = res;
});

router.get("/api/survey/:key", async ctx => {
	const survey = await GetSurvey(ctx.params.key);
	ctx.body = survey;
});

router.post("/api/survey/:id/responses", async ctx => {
	const res = "";
	await SubmitSurveyResponse(ctx);
	ctx.body = res;
});

router.post("/api/survey/:id/answers/:key", async ctx => {
	const res = "";
	await AddNursingHomeSurveyQuestion(ctx);
	ctx.body = res;
});

router.get("/api/survey/:id/results/:survey", async ctx => {
	const res = await GetSurveyWithNursingHomeResults(
		ctx.params.survey,
		ctx.params.id,
	);
	ctx.body = res;
});

router.get("/api/survey/:id/text-results/:survey", async ctx => {
	const res = await GetSurveyTextResults(ctx.params.id);
	ctx.body = res;
});

router.get("/api/survey/:id/approved-results/:survey", async ctx => {
	const res = await GetSurveyApprovedResults(ctx.params.id);
	ctx.body = res;
});

router.post("/api/feedback/response", async ctx => {
	const res = "";
	await SubmitFeedbackResponse(ctx);
	ctx.body = res;
});

const routes = router.routes();

export { routes };
