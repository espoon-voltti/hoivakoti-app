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
	UploadPics,
	GetAllPicsAndDescriptions,
	GetPicsAndDescriptions,
	GetPic,
	GetPdf,
	GetCaptions,
	GetCities,
	GetNursingHomeVacancyStatus,
	UpdateNursingHomeInformation,
	UploadNursingHomeReport,
	AdminRevealSecrets,
	AdminLogin,
	CheckLogin
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

router.post("/api/nursing-homes/upload-pics", async ctx => {
	ctx.body = await UploadPics(ctx);
});

router.get("/api/nursing-homes/:id", async ctx => {
	ctx.body = await GetNursingHome(ctx);
});

router.del("/api/nursing-homes/:id", async ctx => {
	ctx.body = await DeleteNursingHome(ctx);
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
	const success = await UpdateNursingHomeInformation(ctx);
	if (!success) {
		ctx.response.status = 403;
		ctx.body = { error: "Forbidden: invalid ID or key" };
	} else {
		ctx.body = { success };
	}
});

router.get("/api/nursing-homes/:id/raportti.pdf", async ctx => {
	ctx.body = await GetPdf(ctx);
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

const routes = router.routes();

export { routes };
