import i18next, { Language, TranslationKey } from "../../i18n";

enum City {
	EPO = "EPO",
	HNK = "HNK",
	HEL = "HEL",
	HVK = "HVK",
	JVP = "JVP",
	KRL = "KRL",
	KRV = "KRV",
	KRN = "KRN",
	LHJ = "LHJ",
	NRJ = "NRJ",
	RPO = "RPO",
	SPO = "SPO",
	STO = "STO",
	TSL = "TSL",
	VTA = "VTA",
	VHT = "VHT",
}

const getTranslationByLanguage = (
	language: Language,
	key: TranslationKey,
): string => {
	return i18next.getResource(language, "defaultNamespace", key);
};

interface Translation {
	[key: string]: { [language: string]: string };
}

export const cityTranslations: Translation = {
	EPO: {
		"fi-FI": getTranslationByLanguage("fi-FI", "espoo"),
		"sv-FI": getTranslationByLanguage("sv-FI", "espoo"),
	},
	HNK: {
		"fi-FI": getTranslationByLanguage("fi-FI", "hanko"),
		"sv-FI": getTranslationByLanguage("sv-FI", "hanko"),
	},
	HEL: {
		"fi-FI": getTranslationByLanguage("fi-FI", "helsinki"),
		"sv-FI": getTranslationByLanguage("sv-FI", "helsinki"),
	},
	HVK: {
		"fi-FI": getTranslationByLanguage("fi-FI", "hyvinkää"),
		"sv-FI": getTranslationByLanguage("sv-FI", "hyvinkää"),
	},
	JVP: {
		"fi-FI": getTranslationByLanguage("fi-FI", "järvenpää"),
		"sv-FI": getTranslationByLanguage("sv-FI", "järvenpää"),
	},
	KRL: {
		"fi-FI": getTranslationByLanguage("fi-FI", "karkkila"),
		"sv-FI": getTranslationByLanguage("sv-FI", "karkkila"),
	},
	KRV: {
		"fi-FI": getTranslationByLanguage("fi-FI", "kerava"),
		"sv-FI": getTranslationByLanguage("sv-FI", "kerava"),
	},
	KRN: {
		"fi-FI": getTranslationByLanguage("fi-FI", "kirkkonummi"),
		"sv-FI": getTranslationByLanguage("sv-FI", "kirkkonummi"),
	},
	LHJ: {
		"fi-FI": getTranslationByLanguage("fi-FI", "lohja"),
		"sv-FI": getTranslationByLanguage("sv-FI", "lohja"),
	},
	NRJ: {
		"fi-FI": getTranslationByLanguage("fi-FI", "nurmijärvi"),
		"sv-FI": getTranslationByLanguage("sv-FI", "nurmijärvi"),
	},
	RPO: {
		"fi-FI": getTranslationByLanguage("fi-FI", "raasepori"),
		"sv-FI": getTranslationByLanguage("sv-FI", "raasepori"),
	},
	SPO: {
		"fi-FI": getTranslationByLanguage("fi-FI", "sipoo"),
		"sv-FI": getTranslationByLanguage("sv-FI", "sipoo"),
	},
	STO: {
		"fi-FI": getTranslationByLanguage("fi-FI", "siuntio"),
		"sv-FI": getTranslationByLanguage("sv-FI", "siuntio"),
	},
	TSL: {
		"fi-FI": getTranslationByLanguage("fi-FI", "tuusula"),
		"sv-FI": getTranslationByLanguage("sv-FI", "tuusula"),
	},
	VTA: {
		"fi-FI": getTranslationByLanguage("fi-FI", "vantaa"),
		"sv-FI": getTranslationByLanguage("sv-FI", "vantaa"),
	},
	VHT: {
		"fi-FI": getTranslationByLanguage("fi-FI", "vihti"),
		"sv-FI": getTranslationByLanguage("sv-FI", "vihti"),
	},
};

export default City;
