import i18n from "./i18n";
import { useTranslation } from "react-i18next";

const ns = "defaultNamespace";

interface TranslationsBundle {
	appTitle: string;
	navHome: string;
	navNursingHomes: string;
}

export type TranslationKey = keyof TranslationsBundle;

export type Language = "fi" | "sv";

export const useT = (key: TranslationKey): string => {
	const { t } = useTranslation(ns);
	return t(key);
};

export const useCurrentLanguage = (): Language => {
	const { i18n: i18nInstance } = useTranslation();
	return i18nInstance.languages[0] as Language;
};

const translationsFi: TranslationsBundle = {
	appTitle: "Espoon hoivakodit",
	navHome: "Etusivu",
	navNursingHomes: "Hoivakodit",
};

const translationsSe: TranslationsBundle = {
	appTitle: "Vårdhem i Esbo",
	navHome: "Hemsida",
	navNursingHomes: "Vårdhem",
};

i18n.addResources("fi", ns, translationsFi);

i18n.addResources("sv", ns, translationsSe);
