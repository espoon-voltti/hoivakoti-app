// eslint-disable-next-line no-undef
const NODE_ENV: "development" | "production" | "test" = process.env.NODE_ENV;

// URL to images in the public directory
const publicFilesPortString = NODE_ENV === "development" ? ":8000" : "";
const PUBLIC_FILES_URL =
	window.location.protocol +
	"//" +
	window.location.hostname +
	publicFilesPortString;

const apiPortString = NODE_ENV === "development" ? ":3000" : "";
const API_URL =
	window.location.protocol +
	"//" +
	window.location.hostname +
	apiPortString +
	"/api";

export default {
	NODE_ENV,
	PUBLIC_FILES_URL,
	API_URL,
};
