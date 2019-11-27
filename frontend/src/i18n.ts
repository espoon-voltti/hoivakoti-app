import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations } from "./translations";

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

const ns = "defaultNamespace";

export type TranslationKey = keyof typeof translations;

export type Language = "fi-FI" | "sv-FI";

export const useT = (key: TranslationKey): string => {
	const { t } = useTranslation(ns);
	return t(key);
};

export const useCurrentLanguage = (): Language => {
	const { i18n: i18nInstance } = useTranslation();
	return i18nInstance.languages[0] as Language;
};

const extractTranslations = (
	bundle: Record<string, Record<Language, string>>,
	lng: Language,
): Record<Language, string> => {
	const ts = {} as Record<string, string>;
	for (const [key, entry] of Object.entries(bundle)) {
		if (!("fi-FI" in entry))
			throw new Error(
				`Missing language "fi-FI" entry for key "${key}" ` +
					"in frontend/src/translations.ts!",
			);
		if (!("sv-FI" in entry))
			throw new Error(
				`Missing language "sv-FI" entry for key "${key}" ` +
					"in frontend/src/translations.ts!",
			);
		ts[key] = entry[lng];
	}
	return ts;
};

const translationsFi = extractTranslations(translations, "fi-FI");
const translationsSv = extractTranslations(translations, "sv-FI");

i18next.addResources("fi-FI", ns, translationsFi);
i18next.addResources("sv-FI", ns, translationsSv);

i18next.on("languageChanged", lng => {
	const oldPath = window.location.pathname;
	const newPath = oldPath.replace(/^\/[^/]+\//, `/${lng}/`);
	window.location.href = `${window.location.origin}${newPath}${window.location.search}`;
});
