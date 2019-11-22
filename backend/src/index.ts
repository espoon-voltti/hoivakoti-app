import Koa from "koa";
import BodyParser from "koa-body";
import Helmet from "koa-helmet";
import { routes } from "./routes";
import { LogRequest } from "./logging";
import cors from "@koa/cors";
import config from "./config";

const app = new Koa();

app.use(LogRequest);
app.use(Helmet());
app.use(cors());
app.use(BodyParser({ multipart: true }));
app.use(routes);

const { port } = config;

app.listen(port);

console.debug(`Server running on port ${port}`);
