// URL to images in the public directory
let port_string = "";
if (process.env.NODE_ENV === "development")
	port_string = ":4000";
export const PUBLIC_FILES_URL = window.location.protocol + '//' + window.location.hostname + port_string;

if (process.env.NODE_ENV === "development")
	port_string = ":3000";
export const API_URL = window.location.protocol + '//' + window.location.hostname + port_string + "/api";