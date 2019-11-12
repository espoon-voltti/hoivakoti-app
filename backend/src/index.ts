import * as Koa from "koa"
import * as BodyParser from "koa-bodyparser"
import * as Helmet from "koa-helmet"
import {routes} from "./routes"
import {LogRequest} from "./logging"

const cors = require("@koa/cors")

const app = new Koa()

app.use(LogRequest)
app.use(Helmet())
app.use(cors())
app.use(BodyParser())
app.use(routes)

app.listen(3000)

console.debug("Server running on port 3000")