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
		queryString: ctx.query,
		statusCode: ctx.response.status,
		responseTime: Date.now() - timeStart,
		contentLength: ctx.request.rawBody ? ctx.request.rawBody.length : 0,
		hostIp: "TODO",
		appName: "voltti-hoivakoti",
		appBuild: "TODO",
		appCommit: "TODO",
		env: "TODO",
		userIdHash: "TODO",
		type: "app-requests-received",
		version: 1,
	};
	// TODO: When to use warning, when to use error: https://voltti.atlassian.net/wiki/spaces/VOLTTI/pages/908951563/Lokitusk+yt+nn+t#Lokitusk%C3%A4yt%C3%A4nn%C3%B6t-Sovelluslokit
	console.info(JSON.stringify(log));
}
