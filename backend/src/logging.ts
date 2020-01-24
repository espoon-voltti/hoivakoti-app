import { Context } from "koa";

export async function LogRequest(
	ctx: Context,
	next: () => Promise<void>,
): Promise<void> {
	const timeStart = Date.now();
	await next();
	const log = {
		"@timestamp": new Date().toISOString(),
		clientIp: ctx.request.ip,
		httpMethod: ctx.method,
		path: ctx.path,
		queryString: ctx.querystring,
		statusCode: ctx.response.status,
		responseTime: Date.now() - timeStart,
		contentLength: ctx.request.rawBody ? ctx.request.rawBody.length : 0,
		hostIp: "todo",
		appName: "voltti-hoivakoti",
		appBuild: "todo",
		appCommit: "todo",
		env: process.env.NODE_ENV === "production" ? "prod" : process.env.NODE_ENV,
		userIdHash: "todo",
		type: "app-requests-received",
		version: 1,
	};
	// TODO: When to use warning, when to use error: https://voltti.atlassian.net/wiki/spaces/VOLTTI/pages/908951563/Lokitusk+yt+nn+t#Lokitusk%C3%A4yt%C3%A4nn%C3%B6t-Sovelluslokit
	console.info(JSON.stringify(log));
}
