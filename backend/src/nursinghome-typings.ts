export enum Commune {
	EPO = "EPO",
	EPK = "EPK",
	EPL = "EPL",
	LPV = "LPV",
	MKL = "MKL",
	TAP = "TAP",
	HNK = "HNK",
	HEL = "HEL",
	HVK = "HVK",
	JVP = "JVP",
	KAR = "KAR",
	KER = "KER",
	KRN = "KRN",
	LHJ = "LHJ",
	NRJ = "NRJ",
	RPO = "RPO",
	SPO = "SPO",
	STO = "STO",
	TSL = "TSL",
	VTA = "VTA",
	VTI = "VTI",
}

// This interface declaration is duplicated in frontend and backend. Please
// modify both at the same time to keep them in sync
export interface NursingHome {
	id?: string;
	name: string;
	district?: string;
	owner: string;
	address: string;
	ara?: string;
	www?: string;
	apartment_count?: number;
	language?: string;
	lah?: boolean;
	summary?: string;
	postal_code: string;
	city: string;
	customer_commune?: Commune[];
	arrival_guide_public_transit?: string;
	arrival_guide_car?: string;
	construction_year?: number;
	building_info?: string;
	apartments_have_bathroom?: boolean;
	apartment_count_info?: string;
	apartment_square_meters?: string;
	rent?: string;
	rent_info?: string;
	language_info?: string;
	menu_link?: string;
	meals_preparation?: string;
	meals_info?: string;
	activities_info?: string;
	activities_link?: string;
	outdoors_possibilities_info?: string;
	outdoors_possibilities_link?: string;
	tour_info?: string;
	contact_name?: string;
	contact_title?: string;
	contact_phone?: string;
	contact_phone_info?: string;
	email?: string;
	accessibility_info?: string;
	staff_info?: string;
	staff_satisfaction_info?: string;
	other_services?: string;
	nearby_services?: string;
	geolocation?: {
		center: [number, number];
	};
	has_vacancy?: boolean;
}

export const nursing_home_columns_info: any = [
	{ csv: "Hoivakodin nimi", sql: "name", type: "string" },
	{ csv: "Omistajan nimi", sql: "owner", type: "string" },
	{ csv: "Käyntiosoite", sql: "address", type: "string" },
	{ csv: "ARA-kohde", sql: "ara", type: "string" },
	{ csv: "Verkkosivujen osoite", sql: "www", type: "string" },
	{ csv: "Asuntojen määrä", sql: "apartment_count", type: "integer" },
	{ csv: "Palvelukieli", sql: "language", type: "string" },
	{ csv: "Lyhytaikaisen hoivan asuntoja", sql: "lah", type: "boolean" },
	{ csv: "Tiivistelmä", sql: "summary", type: "string" },
	{ csv: "Postinumero", sql: "postal_code", type: "string" },
	{ csv: "Kaupunki", sql: "city", type: "string" },
	{
		csv: "Saapumisohjeet (julkiset kulkuvälineet)",
		sql: "arrival_guide_public_transit",
		type: "string",
	},
	{
		csv: "Saapumisohjeet (autolla saavuttaessa)",
		sql: "arrival_guide_car",
		type: "string",
	},
	{ csv: "Rakennusvuosi", sql: "construction_year", type: "integer" },
	{ csv: "Lisätietoja rakennuksesta", sql: "building_info", type: "string" },
	{
		csv: "Onko kaikissa asunnoissa oma kylpyhuone",
		sql: "apartments_have_bathroom",
		type: "boolean",
	},
	{
		csv: "Lisätietoja asuntojen määrästä",
		sql: "apartment_count_info",
		type: "string",
	},
	{
		csv: "Asuntojen neliömäärä",
		sql: "apartment_square_meters",
		type: "string",
	},
	{ csv: "Vuokra", sql: "rent", type: "string" },
	{ csv: "Lisätietoja vuokrasta", sql: "rent_info", type: "string" },
	{ csv: "Palvelukielen lisätietoja", sql: "language_info", type: "string" },
	{ csv: "Linkki ruokalistaan", sql: "menu_link", type: "string" },
	{ csv: "Ruoan valmistus", sql: "meals_preparation", type: "string" },
	{ csv: "Lisätietoa ruoasta", sql: "meals_info", type: "string" },
	{
		csv: "Kuvaus hoivakodissa järjestettävästä toiminnasta",
		sql: "activities_info",
		type: "string",
	},
	{
		csv: "Linkki toimintakalenteriin",
		sql: "activities_link",
		type: "string",
	},
	{
		csv: "Kuvaus hoivakodin ulkoilumahdollisuuksista",
		sql: "outdoors_possibilities_info",
		type: "string",
	},
	{
		csv: "Linkki lisätietoihin ulkoilumahdollisuuksista",
		sql: "outdoors_possibilities_link",
		type: "string",
	},
	{
		csv: "Vapaa kuvaus hoivakotiin tutustumisesta",
		sql: "tour_info",
		type: "string",
	},
	{ csv: "Yhteyshenkilö", sql: "contact_name", type: "string" },
	{
		csv: "Yhteyshenkilön tehtävänimike",
		sql: "contact_title",
		type: "string",
	},
	{ csv: "Puhelinnumero", sql: "contact_phone", type: "string" },
	{
		csv: "Puhelinnumeron lisätietoja",
		sql: "contact_phone_info",
		type: "string",
	},
	{ csv: "Sähköposti", sql: "email", type: "string" },
	{
		csv: "Tietoja esteettömyydestä",
		sql: "accessibility_info",
		type: "string",
	},
	{ csv: "Henkilöstö", sql: "staff_info", type: "string" },
	{
		csv: "Lisätietoa henkilöstön tyytyväisyydestä",
		sql: "staff_satisfaction_info",
		type: "string",
	},
	{ csv: "Muut hoivakodin palvelut", sql: "other_services", type: "string" },
	{ csv: "Lähellä olevat palvelut", sql: "nearby_services", type: "string" },
];

export const nursing_home_pictures_columns_info: any = [
	{ csv: "Yleiskuva ulkopuolelta", sql: "overview_outside" },
	{
		csv: "Kuvateksti (yleiskuva ulkopuolelta)",
		sql: "overview_outside_caption",
	},
	{ csv: "Kuva asunnosta", sql: "apartment" },
	{ csv: "Kuvateksti (Kuva asunnosta)", sql: "apartment_caption" },
	{ csv: "Kuva oleskelutiloista", sql: "lounge" },
	{ csv: "Kuvateksti (Kuva oleskelutiloista)", sql: "lounge_caption" },
	{ csv: "Kuva ruokailutiloista", sql: "dining_room" },
	{ csv: "Kuvateksti (Kuva ruokailutiloista)", sql: "dining_room_caption" },
	{ csv: "Kuva piha-alueesta", sql: "outside" },
	{ csv: "Kuvateksti (Kuva piha-alueesta)", sql: "outside_caption" },
	{
		csv: "Kuva, jossa sisäänkäynti näkyy selkeästi ulkoa kuvattuna",
		sql: "entrance",
	},
	{ csv: "Kuvateksti (Kuva sisäänkäynti)", sql: "entrance_caption" },
	{ csv: "Kuva kylpyhuoneesta", sql: "bathroom" },
	{ csv: "Kuvateksti (Kuva kylpyhuoneesta)", sql: "bathroom_caption" },
	{ csv: "Pohjakuva asunnosta", sql: "apartment_layout" },
	{
		csv: "Kuvateksti (Pohjakuva asunnosta)",
		sql: "apartment_layout_caption",
	},
	{ csv: "Pohjakuva hoivakodista", sql: "nursinghome_layout" },
	{
		csv: "Kuvateksti (Pohjakuva hoivakodista)",
		sql: "nursinghome_layout_caption",
	},
	{ csv: "Omistavan organisaation logo", sql: "owner_logo" },
];

export const postal_code_to_district: any = {};
postal_code_to_district["02070"] = "Espoon keskus";
postal_code_to_district["02780"] = "Espoon keskus";
postal_code_to_district["02770"] = "Espoon keskus";
postal_code_to_district["02320"] = "Espoonlahti";
postal_code_to_district["02330"] = "Espoonlahti";
postal_code_to_district["02280"] = "Espoonlahti";
postal_code_to_district["02620"] = "Leppävaara";
postal_code_to_district["02720"] = "Leppävaara";
postal_code_to_district["02940"] = "Leppävaara";
postal_code_to_district["02660"] = "Leppävaara";
postal_code_to_district["02710"] = "Leppävaara";
postal_code_to_district["02730"] = "Leppävaara";
postal_code_to_district["02650"] = "Leppävaara";
postal_code_to_district["02600"] = "Leppävaara";
postal_code_to_district["02610"] = "Leppävaara";
postal_code_to_district["02810"] = "Leppävaara";
postal_code_to_district["02200"] = "Matinkylä";
postal_code_to_district["02210"] = "Matinkylä";
postal_code_to_district["02230"] = "Matinkylä";
postal_code_to_district["02250"] = "Matinkylä";
postal_code_to_district["02100"] = "Tapiola";
postal_code_to_district["02160"] = "Tapiola";
postal_code_to_district["02140"] = "Tapiola";
postal_code_to_district["02130"] = "Tapiola";
postal_code_to_district["02180"] = "Tapiola";
