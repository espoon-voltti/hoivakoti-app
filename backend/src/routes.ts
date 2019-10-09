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

router.get("*", async (ctx) => {
	ctx.body = ctx.url
})

const routes = router.routes()

export {routes}