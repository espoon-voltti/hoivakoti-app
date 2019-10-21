import * as Router from "@koa/router"

import {
	AddNursingHome,
	ListNursingHomes,
	ListRatings,
	AddNursingHomesFromCSV} from "./controllers"

const router = new Router()

router.get("/", async (ctx) => {
	ctx.body = "maybe docs here"
})

router.get("/nursing-homes", async (ctx) => {
	ctx.body = await ListNursingHomes(ctx)
})

router.post("/nursing-homes", async (ctx) => {
	ctx.body = await AddNursingHome(ctx)
})

router.post("/nursing-homes/csv", async (ctx) => {
	ctx.body = await AddNursingHomesFromCSV(ctx)
})

router.get("/ratings", async (ctx) => {
	ctx.body = await ListRatings(ctx)
})

router.get("/db-test", async (ctx) => {
	const db_pass = process.env.DB_PASSWORD;
	console.log(db_pass);
	if (db_pass !== undefined)
		ctx.body = db_pass.substring(0, 2);
	else
		ctx.body = "Undefined";
})

router.get("*", async (ctx) => {
	ctx.body = ctx.url
})

const routes = router.routes()

export {routes}