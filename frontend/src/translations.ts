import i18n from "./i18n";
import { useTranslation } from "react-i18next";

const ns = "defaultNamespace";

interface TranslationsBundle {
	appTitle: string;
	navHome: string;
	navNursingHomes: string;

	jumbotronBtn: string;
	jumbotronHeadline: string;
	locationPickerLabel: string;
	landingIngress1: string;
	landingIngress2: string;
	urlParastapalvelua: string;

	whatisNursinghomeHeadline: string;
	whatisNursinghomeText: string;

	decisionStepsHeadline: string;
	decisionStep1Headline: string;
	decisionStep1Text: string;
	decisionStep2Headline: string;
	decisionStep2Text: string;
	decisionStep3Headline: string;
	decisionStep3Text: string;
	decisionMoreInfo: string;
	urlDecisionMoreInfo: string;

	selectingHeadline: string;
	selectingText: string;

	serviceDescriptionHeadline: string;
	serviceDescriptionText: string;

	serviceDescriptionLink: string;
	urlServiceDescription: string;

	faqSectionHeadline: string;
	faqItem1Headline: string;
	faqItem1Text: string;
	faqItem2Headline: string;
	faqItem2Text: string;
	faqItem3Headline: string;
	faqItem3Text: string;
	faqItem4Headline: string;
	faqItem4Text: string;
	faqItem5Headline: string;
	faqItem5Text: string;
	faqItem6Headline: string;
	faqItem6Text: string;
	faqItem7Headline: string;
	faqItem7Text: string;
	faqItem8Headline: string;
	faqItem8Text: string;
	faqItem9Headline: string;
	faqItem9Text: string;
	faqItem10Headline: string;
	faqItem10Text: string;
	faqItem11Headline: string;
	faqItem11Text: string;
	faqItem12Headline: string;
	faqItem12Text: string;
}

export type TranslationKey = keyof TranslationsBundle;

export type Language = "fi-FI" | "sv-FI";

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
	jumbotronBtn: "Näytä hoivakodit",
	jumbotronHeadline: "Löydä näköisesi hoivakoti",
	locationPickerLabel: "Miltä alueelta etsit hoivakotia?",
	landingIngress1:
		"Tältä sivustolta löydät Espoon kaupungin hyväksymät <0>tehostetun palveluasumisen</0> hoivakodit <1>ikäihmisille</1>. Saadaksesi hoivakotipaikan tarvitset myönteisen päätöksen tehostetun palveluasumisen tarpeesta.",
	landingIngress2: "Etsitkö hoivakotia palvelusetelillä? Katso hoivakoteja osoitteessa ",
	urlParastapalvelua: "https://www.parastapalvelua.fi",
	whatisNursinghomeHeadline: "Mitä on tehostettu palveluasuminen?",
	whatisNursinghomeText:
		"Tehostettu palveluasuminen on tarkoitettu ikääntyneille , jotka tarvitsevat ympärivuorokautisesti hoivaa ja huolenpitoa ja jotka eivät voi enää asua omassa kodissaan. Tehostetun palveluasumisen hoivakodeissa on terveydenhuollon ammattikoulutuksen saanutta henkilökuntaa paikalla jatkuvasti. Espoon kaupunki järjestää tehostettua palveluasumista useissa yksityisten palveluntuottajien hoivakodeissa sekä omissa hoivakodeissaan. Hoivakodissa asiakas saa tarpeidensa mukaista hoivaa ja huolenpitoa elämänsä loppuun saakka.",
	decisionStepsHeadline: "Miten saat tehostetun palveluasumisen päätöksen?",
	decisionStep1Headline: "1. Ota yhteyttä Nestoriin",
	decisionStep1Text: "Nestori on Espoon kaupungin seniorineuvonnan yksikkö, <0>p. 09 816 33 333</0>",
	decisionStep2Headline: "2. Palvelutarpeen selvittäminen ",
	decisionStep2Text: "Nestorin sosiaalityöntekijä tulee luoksesi selvittämään palvelutarpeesi",
	decisionStep3Headline: "3. Palvelupäätös",
	decisionStep3Text: "Myönteisen palvelupäätöksen jälkeen voit alkaa etsimään itsellesi sopivaa hoivakotia",
	decisionMoreInfo: "Lisätietoa tehostettuun palveluasumiseen hakeutumisesta.",
	urlDecisionMoreInfo: "https://www.espoo.fi/fi-FI/Seniorit/Seniorineuvonta_Nestori/Palvelutarpeen_selvittaminen",
	selectingHeadline: "Hoivakodin valinta",
	selectingText:
		"Voit valita hoivakodin, jossa on vapaita paikkoja. Voit käydä tutustumassa hoivakoteihin ennen päätöksen tekemistä. Kerro valinnastasi Nestorin sosiaalityöntekijälle. Jos mieluisin vaihtoehtosi on hoivakoti, jossa ei ole vapaita paikkoja, voit ilmoittautua tämän hoivakodin jonoon, Halutessasi voit vaihtaa hoivakotia kun paikka vapautuu.",
	serviceDescriptionHeadline: "Mitä hoivakodin antamaan palveluun kuuluu?",
	serviceDescriptionText:
		"Kaikki tällä sivustolla esillä olevat hoivakodit ovat sitoutuneet noudattamaan Espoon kaupungin palvelukonseptia, joka määrittää vähimmäisvaatimukset palvelun sisällölle ja laadulle.",
	serviceDescriptionLink: "Tutustu palvelukonseptiin",
	urlServiceDescription: "https://www.espoo.fi",
	faqSectionHeadline: "Usein kysyttyjä kysymyksiä palvelusta",
	faqItem1Headline: "Minkälaisia asunnot ovat?",
	faqItem1Text:
		"Asiakkaalla on yhden hengen asunto. Joissakin hoivakodeissa on kahden hengen asuntoja, joissa asiakas voi asua omasta toiveestaan. Asunnossa tai sen välittömässä läheisyydessä on asiakkaan käytössä oleva wc/kylpyhuone. Joissakin hoivakodeissa voi olla yhteisiä wc- ja suihkutiloja.",
	faqItem2Headline: "Voiko puoliso muuttaa samaan asuntoon?",
	faqItem2Text:
		"Pariskunnilla on mahdollisuus asua yhdessä myös tilanteissa, joissa toinen puolisoista ei ole tehostetun palveluasumisen asiakas. Puolison asumisesta ja siihen liittyvistä maksuista tulee sopia suoraan hoivakodin kanssa.",
	faqItem3Headline: "Kuka kalustaa asunnon?",
	faqItem3Text:
		"Palveluun kuuluu sähköisesti säädettävä sänky, patja, vaatekaappi, lukittava säilytysmahdollisuus ja yleisvalaisin. Lisäksi asiakas voi kalustaa ja sisustaa asuntonsa omien toiveidensa ja mieltymysten mukaisesti.",
	faqItem4Headline: "Kuuluvatko tyynyt, peitot ja liinavaatteet palveluun?",
	faqItem4Text:
		"Nämä eivät kuulu palveluun. Näiden osalta on hoivakotikohtainen käytäntö; toisissa hoivakodeissa asiakas tuo ne itse ja toisissa ne järjestyvät hoivakodin toimesta.",
	faqItem5Headline: "Mitä siivousta kuuluu palveluun?",
	faqItem5Text:
		"Asiakkaalla omat normaalin vesipesun kestävä vaatteet. Jos asiakkaalla on erikoispesuja vaativia vaatteita tai muita tekstiilejä, niin niiden pesuista asiakas vastaa itse.",
	faqItem6Headline: "Kuka hoitaa asiakkaan vaatteet?",
	faqItem6Text:
		"Asunto siivotaan vähintään kerran viikossa. Lisäksi asunnossa huolehditaan päivittäin huolehditaan vuoteen sijaamisesta, roskien viemisestä, tahrojen poistamisesta ja tarvittaessa vuodevaatteiden vaihtamisesta. Asiakas voi halutessaan osallistua näihin tehtäviin. Ikkunat pestään tarpeen mukaan.",
	faqItem7Headline: "Miten lääkkeet hoituvat?",
	faqItem7Text: "Lääkkeiden annosjakelu kuuluu palveluun ja asiakas maksaa itse omat lääkkeet.",
	faqItem8Headline: "Onko hoivakodissa kaikki asiakkaan tarvitsemat apuvälineet?",
	faqItem8Text:
		"Hoivakodissa on tarpeellinen määrä yhteiskäyttöisiä apuvälineitä. Näitä ovat esimerkiksi nostolaitteet, tukikaiteet sekä asentohoitoon soveltuvat tyynyt. Lisäksi asiakkaalla voi olla henkilökohtaisia apuvälineita HUS:in Apuvälinekeskuksesta. Asiakas kustantaa henkilökohtaisten apuvälineiden noutamisen ja palveluntuottajalla on avustusvelvollisuus noudon toteuttamisessa.",
	faqItem9Headline: "Mitkä ruokailut kuuluvat palveluun?",
	faqItem9Text:
		"Asiakas saa hoivakodissa aamiaisen, lounaan, iltapäiväkahvin/välipalan, päivällisen ja iltapalan. Lounas ja päivällinen ovat lämpimiä aterioita. Lisäksi asiakas saa tarvittaessa yöpalaa. Erityisruokavaliot ja lääkäriin määräämät täydennysravintovalmisteet kuuluvat palveluun.",
	faqItem10Headline: "Mitä muuta kuin välttämätöntä hoivaa palveluun kuuluu?",
	faqItem10Text:
		"Asiakas avustetaan päivittäin ylös vuoteesta ja asiakkaalla on mahdollisuus käyttää päivävaatteitaan. Asiakkaalla on mahdollisuus aktiiviseen elämään. Aktiivisuuteen sisältyy muun muassa ulkoilua, liikuntaa, kulttuuria sekä käsillä tekemistä asiakkaan toiveiden ja aikaisempien tottumusten mukaisesti.",
	faqItem11Headline: "Miten läheiset voivat olla mukana asiakkaan elämässä?",
	faqItem11Text:
		"Läheiset voivat olla mukana hoivakodin arjessa ja yöpyä tilapäisesti asiakkaan asunnossa. Asiakas/omainen sopii käytännöt hoivakodin kanssa.",
	faqItem12Headline: "Miten saattohoito järjestetään?",
	faqItem12Text:
		"Asiakas voi asua hoivakodissa elämänsä loppuun asti. Kivun ja muiden oireiden hoidosta huolehditaan kaikkina vuorokauden aikoina. Hoivakodissa kunnioitetaan kuolevan vakaumusta ja hänen henkisestä hyvinvoinnistaan huolehditaan.",
};

const translationsSe: TranslationsBundle = {
	appTitle: "Vårdhem i Esbo",
	navHome: "Hemsida",
	navNursingHomes: "Vårdhem",
	jumbotronBtn: "Visa vårdhem",
	jumbotronHeadline: "Hitta ett snyggt vårdhem",
	locationPickerLabel: "Vart söker du vårdhem?",
	landingIngress1:
		"På den här webbplatsen hittar du <strong> Enhanced Service Housing </strong> Vårdhem för <strong> äldre </strong> godkända av staden Esbo. För att få ett vårdhem behöver du ett positivt beslut om behovet av förbättrad servicebostad.",
	landingIngress2: "Letar du efter ett vårdhem med en servicekupong? Se vårdhem på ",
	urlParastapalvelua: "https://www.parastapalvelua.fi/sv",
	whatisNursinghomeHeadline: "Vad är förbättrad servicehus?",
	whatisNursinghomeText:
		"Enhanced Service Housing är designad för äldre som behöver 24-timmars vård och vård och inte längre kan bo i sina egna hem. Det finns en ständig närvaro av personal med professionell vårdutbildning i Enhanced Service Living Nursing Homes. Esbo anordnar förbättrade servicebostäder i flera privata tjänsteleverantörers vårdhem och i sina egna vårdhem. På ett vårdhem får klienten vård och vård som tillgodoser deras behov resten av livet.",
	decisionStepsHeadline: "Hur får du ett beslut om servicehus?",
	decisionStep1Headline: "1. Ta kontakt av Nestor",
	decisionStep1Text: "Nestori är Senior Counselling Unit i staden Espoo, <0>tel. +358 9 816 33 333</0>",
	decisionStep2Headline: "2. Identifiera servicebehov",
	decisionStep2Text: "En Nestor socialarbetare kommer till dig för att bestämma dina servicebehov",
	decisionStep3Headline: "3. Servicebeslut",
	decisionStep3Text: "Efter ett positivt servicebeslut kan du börja leta efter ett vårdhem som passar dig",
	decisionMoreInfo: "Läs mer om ansökan om förbättrad servicehus.",
	urlDecisionMoreInfo:
		"https://www.esbo.fi/sv-FI/Etjanster/Social_och_halsovard/Blankett_for_personer_fran_andra_kommuner_som_soker_vardplats_pa_institution_i_Esbo/Blankett_for_personer_fran_andra_kommune(10216)",
	selectingHeadline: "Att välja ett vårdhem",
	selectingText:
		"Du kan välja ett vårdhem med gratisplatser. Du kan besöka vårdhemen innan du fattar ett beslut. Berätta för din Nestor socialarbetare om ditt val. Om ditt föredragna alternativ är ett vårdhem utan lediga platser, kan du anmäla dig till denna vårdkö.",
	serviceDescriptionHeadline: "Vad inkluderar en vårdhemstjänst?",
	serviceDescriptionText:
		"Alla vårdhem som visas på denna webbplats har åtagit sig till servicekonceptet City of Espoo, som ställer minimikrav för tjänstens innehåll och kvalitet.",
	serviceDescriptionLink: "Kolla in servicekonceptet",
	urlServiceDescription: "https://espoo.fi/sv-FI",
	faqSectionHeadline: "Vanliga frågor om tjänsten",
	faqItem1Headline: "sv_Minkälaisia asunnot ovat?",
	faqItem1Text:
		"sv_Asiakkaalla on yhden hengen asunto. Joissakin hoivakodeissa on kahden hengen asuntoja, joissa asiakas voi asua omasta toiveestaan. Asunnossa tai sen välittömässä läheisyydessä on asiakkaan käytössä oleva wc/kylpyhuone. Joissakin hoivakodeissa voi olla yhteisiä wc- ja suihkutiloja.",
	faqItem2Headline: "sv_Voiko puoliso muuttaa samaan asuntoon?",
	faqItem2Text:
		"sv_Pariskunnilla on mahdollisuus asua yhdessä myös tilanteissa, joissa toinen puolisoista ei ole tehostetun palveluasumisen asiakas. Puolison asumisesta ja siihen liittyvistä maksuista tulee sopia suoraan hoivakodin kanssa.",
	faqItem3Headline: "sv_Kuka kalustaa asunnon?",
	faqItem3Text:
		"sv_Palveluun kuuluu sähköisesti säädettävä sänky, patja, vaatekaappi, lukittava säilytysmahdollisuus ja yleisvalaisin. Lisäksi asiakas voi kalustaa ja sisustaa asuntonsa omien toiveidensa ja mieltymysten mukaisesti.",
	faqItem4Headline: "sv_Kuuluvatko tyynyt, peitot ja liinavaatteet palveluun?",
	faqItem4Text:
		"sv_Nämä eivät kuulu palveluun. Näiden osalta on hoivakotikohtainen käytäntö; toisissa hoivakodeissa asiakas tuo ne itse ja toisissa ne järjestyvät hoivakodin toimesta.",
	faqItem5Headline: "sv_Mitä siivousta kuuluu palveluun?",
	faqItem5Text:
		"sv_Asiakkaalla omat normaalin vesipesun kestävä vaatteet. Jos asiakkaalla on erikoispesuja vaativia vaatteita tai muita tekstiilejä, niin niiden pesuista asiakas vastaa itse.",
	faqItem6Headline: "sv_Kuka hoitaa asiakkaan vaatteet?",
	faqItem6Text:
		"sv_Asunto siivotaan vähintään kerran viikossa. Lisäksi asunnossa huolehditaan päivittäin huolehditaan vuoteen sijaamisesta, roskien viemisestä, tahrojen poistamisesta ja tarvittaessa vuodevaatteiden vaihtamisesta. Asiakas voi halutessaan osallistua näihin tehtäviin. Ikkunat pestään tarpeen mukaan.",
	faqItem7Headline: "sv_Miten lääkkeet hoituvat?",
	faqItem7Text: "sv_Lääkkeiden annosjakelu kuuluu palveluun ja asiakas maksaa itse omat lääkkeet.",
	faqItem8Headline: "sv_Onko hoivakodissa kaikki asiakkaan tarvitsemat apuvälineet?",
	faqItem8Text:
		"sv_Hoivakodissa on tarpeellinen määrä yhteiskäyttöisiä apuvälineitä. Näitä ovat esimerkiksi nostolaitteet, tukikaiteet sekä asentohoitoon soveltuvat tyynyt. Lisäksi asiakkaalla voi olla henkilökohtaisia apuvälineita HUS:in Apuvälinekeskuksesta. Asiakas kustantaa henkilökohtaisten apuvälineiden noutamisen ja palveluntuottajalla on avustusvelvollisuus noudon toteuttamisessa.",
	faqItem9Headline: "sv_Mitkä ruokailut kuuluvat palveluun?",
	faqItem9Text:
		"sv_Asiakas saa hoivakodissa aamiaisen, lounaan, iltapäiväkahvin/välipalan, päivällisen ja iltapalan. Lounas ja päivällinen ovat lämpimiä aterioita. Lisäksi asiakas saa tarvittaessa yöpalaa. Erityisruokavaliot ja lääkäriin määräämät täydennysravintovalmisteet kuuluvat palveluun.",
	faqItem10Headline: "sv_Mitä muuta kuin välttämätöntä hoivaa palveluun kuuluu?",
	faqItem10Text:
		"sv_Asiakas avustetaan päivittäin ylös vuoteesta ja asiakkaalla on mahdollisuus käyttää päivävaatteitaan. Asiakkaalla on mahdollisuus aktiiviseen elämään. Aktiivisuuteen sisältyy muun muassa ulkoilua, liikuntaa, kulttuuria sekä käsillä tekemistä asiakkaan toiveiden ja aikaisempien tottumusten mukaisesti.",
	faqItem11Headline: "sv_Miten läheiset voivat olla mukana asiakkaan elämässä?",
	faqItem11Text:
		"sv_Läheiset voivat olla mukana hoivakodin arjessa ja yöpyä tilapäisesti asiakkaan asunnossa. Asiakas/omainen sopii käytännöt hoivakodin kanssa.",
	faqItem12Headline: "sv_Miten saattohoito järjestetään?",
	faqItem12Text:
		"sv_Asiakas voi asua hoivakodissa elämänsä loppuun asti. Kivun ja muiden oireiden hoidosta huolehditaan kaikkina vuorokauden aikoina. Hoivakodissa kunnioitetaan kuolevan vakaumusta ja hänen henkisestä hyvinvoinnistaan huolehditaan.",
};

i18n.addResources("fi-FI", ns, translationsFi);

i18n.addResources("sv-FI", ns, translationsSe);
