import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		// allow keys to be phrases having `:`, `.`
		nsSeparator: ":",
		keySeparator: false,

		whitelist: ["fi-FI", "sv-FI"],
		fallbackLng: "fi-FI",

		react: {
			useSuspense: false,
		},

		detection: {
			checkWhitelist: true,
			order: ["path"],
			caches: [],
		},

		load: "currentOnly",

		resources: {},

		debug: true,

		// allow an empty value to count as invalid (by default is true)
		returnEmptyString: false,
	});

export default i18next;

i18next.on("languageChanged", lng => {
	const oldPath = window.location.pathname;
	const newPath = oldPath.replace(/^\/[^/]+\//, `/${lng}/`);
	window.location.href = `${window.location.origin}${newPath}${window.location.search}`;
});
