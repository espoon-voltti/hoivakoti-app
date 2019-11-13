import * as Router from "@koa/router"

import {
	AddNursingHome,
	ListNursingHomes,
	ListRatings,
	GetNursingHome,
	AddNursingHomesFromCSV,
	DeleteNursingHomes} from "./controllers"

const router = new Router()

router.get("/api", async (ctx) => {
	ctx.body = "maybe docs here"
})

router.get("/api/nursing-homes", async (ctx) => {
	ctx.body = await ListNursingHomes(ctx)
})

router.get("/api/nursing-homes/:id", async (ctx) => {
	ctx.body = await GetNursingHome(ctx)
})

router.post("/api/nursing-homes", async (ctx) => {
	ctx.body = await AddNursingHome(ctx)
})

router.post("/api/nursing-homes/csv", async (ctx) => {
	ctx.body = await AddNursingHomesFromCSV(ctx)
})

router.get("/api/nursing-homes/delete-all", async (ctx) => {
	ctx.body = await DeleteNursingHomes(ctx);
})

router.get("/api/ratings", async (ctx) => {
	ctx.body = await ListRatings(ctx)
})

router.get("/api/health", async (ctx) => {
	ctx.body = "healthy";
})

router.get("/api/node-env-test", async (ctx) => {
	ctx.body = process.env.NODE_ENV;
})

const routes = router.routes()

export {routes}