import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		// allow keys to be phrases having `:`, `.`
		nsSeparator: false,
		keySeparator: false,

		whitelist: ["fi", "sv"],
		fallbackLng: "fi",

		react: {
			useSuspense: false,
		},

		resources: {},

		debug: true,

		// do not load a fallback
		load: "languageOnly",

		// allow an empty value to count as invalid (by default is true)
		returnEmptyString: false,
	});

export default i18next;
