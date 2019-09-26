import * as Router from '@koa/router';

import {
	AddNursingHome,
	ListNursingHomes,
	ListRatings} from "./controllers";

const router = new Router();

router.get('/', async (ctx) => {
	ctx.body = "maybe docs here";
});

router.get('/nursing-homes', async (ctx) => {
	ctx.body = await ListNursingHomes(ctx);
});

router.post('/nursing-homes', async (ctx) => {
	ctx.body = await AddNursingHome(ctx);
});

router.get('/ratings', async (ctx) => {
	ctx.body = await ListRatings(ctx);
});

const routes = router.routes();

export {routes};