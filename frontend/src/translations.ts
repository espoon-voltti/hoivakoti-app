import i18n from "./i18n";
import { useTranslation } from "react-i18next";

const ns = "defaultNamespace";

interface TranslationsBundle {
	appTitle: string;
	titleTemplate: string;

	navHome: string;
	navNursingHomes: string;

	jumbotronBtn: string;
	jumbotronHeadline: string;
	locationPickerLabel: string;
	locationPickerPlaceholder: string;
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

	filterLabel: string;

	filterAraLabel: string;
	filterAraText: string;
	filterAraLabel2: string;
	filterAraText2: string;
	filterAraDesc: string;

	serviceLanguage: string;
	serviceLanguageLabel: string;
	filterFinnish: string;
	filterSwedish: string;

	filterYes: string;
	filterNo: string;
	filterLocation: string;
	filterLAH: string;
	filterLAHText: string;
	alsoLAHText: string;

	btnClear: string;
	btnSave: string;

	summaryLabel: string;
	loadingText: string;

	numApartments: string;
	filterSelections: string;
	linkBacktoList: string;

	anchorDetailsBox: string;

	basicInformation: string;
	owner: string;
	yearofConst: string;
	apartmentSize: string;
	apartmentFurnitureLabel: string;
	apartmentFurnitureText: string;
	rent: string;
	LAHapartments: string;
	foodHeader: string;
	cookingMethod: string;
	ownKitchen: string;
	foodMoreInfo: string;
	linkMenu: string;
	activies: string;
	outdoorActivies: string;
	visitingInfo: string;
	accessibility: string;
	personnel: string;
	otherServices: string;
	nearbyServices: string;
	contactInfo: string;
	directions: string;
	webpage: string;

	linkMoreInfoOutdoor: string;
	linkMoreInfoActivies: string;
	linkMoreInfoPersonnel: string;

	monthShort: string;

	pageAccessibilityHeader: string;
	pageAccessibilityBody: string;

	footerLinkPrivacy: string;
	footerLinkAccessibility: string;
	footerLinkFeedback: string;

	vacancyTrue: string;
	vacancyFalse: string;

	pageUpdateTitle: string;
	pageUpdateIntro: string;
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
	titleTemplate: "%s – Espoon hoivakodit",

	navHome: "Etusivu",
	navNursingHomes: "Hoivakodit",
	jumbotronBtn: "Näytä hoivakodit",
	jumbotronHeadline: "Löydä näköisesi hoivakoti",
	locationPickerLabel: "Miltä alueelta etsit hoivakotia?",
	locationPickerPlaceholder: "Kaikki alueet",
	landingIngress1:
		"Tältä sivustolta löydät Espoon kaupungin hyväksymät <0>tehostetun palveluasumisen</0> hoivakodit <1>ikäihmisille</1>. Saadaksesi hoivakotipaikan tarvitset Seniorineuvonta Nestorin tekemän myönteisen päätöksen tehostetusta palveluasumisesta.",
	landingIngress2:
		"Etsitkö hoivakotia palvelusetelillä? Katso hoivakoteja osoitteessa ",
	urlParastapalvelua: "https://www.parastapalvelua.fi",
	whatisNursinghomeHeadline: "Mitä on tehostettu palveluasuminen?",
	whatisNursinghomeText:
		"Tehostettu palveluasuminen on tarkoitettu ikääntyneille, jotka tarvitsevat ympärivuorokautisesti hoivaa ja huolenpitoa, eivätkä voi enää asua omassa kodissaan. Terveydenhuollon ammattilaiset ovat paikalla  keskeytyksettä tehostetun palveluasumisen hoivakodeissa.  Tehostetun palveluasumisen hoivakodissa asukas saa tarpeidensa mukaista hoivaa ja huolenpitoa elämänsä loppuun saakka. Espoon kaupunki järjestää tehostettua palveluasumista omissa hoivakodeissaan sekä hankkii tehostettua palveluasumista yksityisten palveluntuottajien hoivakodeista.",
	decisionStepsHeadline: "Miten saat tehostetun palveluasumisen päätöksen?",
	decisionStep1Headline: "1. Ota yhteyttä Nestoriin",
	decisionStep1Text:
		"Espoon Seniorineuvonta Nestori palvelee arkisin klo 9–15 <0>p. 09 816 33 333</0>",
	decisionStep2Headline: "2. Palvelutarpeen selvittäminen ",
	decisionStep2Text:
		"Nestorin sosiaalityöntekijä tulee luoksesi selvittämään palvelutarpeesi",
	decisionStep3Headline: "3. Palvelupäätös",
	decisionStep3Text:
		"Myönteisen palvelupäätöksen jälkeen voit alkaa etsimään itsellesi sopivaa hoivakotia",
	decisionMoreInfo:
		"Lisätietoa tehostettuun palveluasumiseen hakeutumisesta.",
	urlDecisionMoreInfo:
		"https://www.espoo.fi/fi-FI/Seniorit/Seniorineuvonta_Nestori/Palvelutarpeen_selvittaminen",
	selectingHeadline: "Hoivakodin valinta",
	selectingText:
		" Voit valita sellaisen hoivakodin, jossa on vapaita paikkoja. Voit käydä tutustumassa hoivakoteihin ennen päätöksen tekemistä. Kerro valinnastasi Seniorineuvonta Nestorin omalle sosiaalityöntekijällesi. Jos sinulle mieluisin hoivakoti on täynnä, saat paikan toisaalta ja voit ilmoittautua Nestoriin haluamasi hoivakodin jonoon. Halutessasi voit vaihtaa hoivakotia kun paikka vapautuu. <br> Osa hoivakodeista on rahoitettu valtion tuella ja niistä käytetään tällä sivustolla nimitystä ARA-kohde. Hoivakotia valitsevan tehostetun palveluasumisen asiakkaan näkökulmasta ARA-kohde tarkoittaa sitä, että asukkaan varallisuus ei saa ylittää määrättyjä rajoja. Hoivakodeissa, jotka eivät ole ARA-kohteita, ei ole asukkaan varallisuutta koskevia rajoituksia.",
	serviceDescriptionHeadline: "Mitä hoivakodin palveluun sisältyy?",
	serviceDescriptionText:
		"Kaikki tällä sivustolla olevat hoivakodit ovat Espoon kaupungin hyväksymiä. Ne ovat sitoutuneet noudattamaan Espoon kaupungin palvelukonseptia, joka määrittää vähimmäisvaatimukset palvelun sisällölle ja laadulle. Tehostetun palveluasumisen asiakkaat asuvat hoivakodissa omassa asunnossaan. Päivittäiset ateriat sisältyvät palveluun. Lisäksi hoivakodit järjestävät asukkaille monipuolista toimintaa.",
	serviceDescriptionLink: "Tutustu palvelukonseptiin",
	urlServiceDescription: "https://www.espoo.fi",
	faqSectionHeadline: "Usein kysyttyjä kysymyksiä hoivakodeista",
	faqItem1Headline: "Minkälaisia asunnot ovat?",
	faqItem1Text:
		"Asunnot ovat pääasiassa yhden hengen yksiöitä. Osassa hoivakodeissa on kahden hengen asuntoja, joissa voi asua omasta toiveestaan. Asunnossa tai sen välittömässä läheisyydessä on wc ja kylpyhuone. Joissakin hoivakodeissa voi olla yhteisiä wc- ja suihkutiloja.",
	faqItem2Headline: "Voivatko puolisot asua yhdessä?",
	faqItem2Text:
		"Jos molemmat puolisot ovat tehostetun palveluasumisen asiakkaita, he voivat asua hoivakodissa yhdessä.  Hoivakotien kahden hengen asunnot on tarkoitettu erityisesti yhdessä asuville puolisoille.<br> Puolisot voivat asua yhdessä myös silloin, jos toinen puolisoista ei ole tehostetun palveluasumisen asiakas. Puolison asumisesta ja siihen liittyvistä maksuista sovitaan suoraan hoivakodin kanssa.",
	faqItem3Headline: "Onko asunto kalustettu?",
	faqItem3Text:
		"Asunnoissa on sähköisesti säädettävä sänky, patja, vaatekaappi, lukittava säilytystila ja kattovalaisin. Asuntoon voi tuoda omia kalusteita ja sisustustavaroita.",
	faqItem4Headline: "Saako tyynyt, peitot, ja liinavaatteet hoivakodista?",
	faqItem4Text:
		"Tyynyjä, peittoja ja liinavaatteita ei yleensä saa hoivakodista, vaan asukkaan on tuotava omat tyynyt, peitot ja liinavaatteet. Joistakin hoivakodeista on mahdollista saada tyynyt, peitot ja liinavaatteet. Tämä selviää kysymällä hoivakodista.",
	faqItem5Headline: "Kuka siivoaa asunnon?",
	faqItem5Text:
		"Hoivakodin siivooja siivoaa asunnon vähintään kerran viikossa. Lisäksi hoivakodin henkilökunta huolehtii asunnon päivittäisestä siistimisestä: vuoteen sijaamisesta, roskien viemisestä, tahrojen pyyhkimisestä ja tarvittaessa vuodevaatteiden vaihtamisesta. Asukas voi halutessaan osallistua näihin tehtäviin.",
	faqItem6Headline: "Kuka vastaa asukkaan vaatehuollosta?",
	faqItem6Text:
		"Asukkaat pukeutuvat omiin vaatteisiinsa.  Hoivakoti toimittaa likaiset vaatteet ja muut tekstiilit pesulaan. Asukkaat vastaavat itse erikoispesuja vaativien vaatteiden ja tekstiilien pesettämisestä ja sen kustannuksista.",
	faqItem7Headline: "Mistä saa lääkkeet?",
	faqItem7Text:
		"Asukkaan tarvitsemat lääkkeet toimitetaan apteekista annosjakeluna hoivakotiin. Henkilökunta huolehtii lääkkeiden antamisesta. Asukas maksaa itse omat lääkkeensä.",
	faqItem8Headline: "Saako asukas hoivakodista tarvitsemansa apuvälineet?",
	faqItem8Text:
		"Jos asukkaalla ei ole henkilökohtaisia apuvälineitä hoivakotiin muutettaessa, apuvälineet voi lainata maksutta HUSin Apuvälinekeskuksesta. joka sijaitsee Espoon sairaalassa. Hoivakoti auttaa tarvittaessa apuvälineiden noutamisessa. Mahdolliset apuvälineiden noutokustannukset asukas maksaa itse.",
	faqItem9Headline:
		"Mitkä ruokailut sisältyvät tehostettuun palveluasumiseen?",
	faqItem9Text:
		"Asukkaalle tarjotaan aamiainen, lounas, iltapäiväkahvi/välipala, päivällinen ja iltapala. Lounas ja päivällinen ovat lämpimiä aterioita.  Asukas saa yöpalan tarvittaessa.  Kaikki ateriat ovat asukkaan erityisruokavalion mukaisia. Asukas saa lääkärin määräämät täydennysravintovalmisteet hoivakodista, ja niistä ei tarvitse maksaa erikseen.",
	faqItem10Headline: "Millaista hoivakodin arki on?",
	faqItem10Text:
		"Hoivakodin asukas elää aktiivista elämää oman jaksamisen mukaan. Päiviin sisältyy muun muassa ulkoilua, liikuntaa, kulttuuria sekä käsillä tekemistä asukkaiden toiveiden ja aikaisempien tottumusten mukaisesti.",
	faqItem11Headline: "Voivatko läheiset ja omaiset yöpyä asukkaan luona?",
	faqItem11Text:
		"Läheiset ja omaiset voivat yöpyä tilapäisesti asukkaan luona.  Yöpymisestä on sovittava hoivakodin kanssa.",
	faqItem12Headline: "Miten saattohoito järjestetään?",
	faqItem12Text:
		"Hoivakodissa voi asua elämän loppuun saakka. Kivun lievityksestä ja oireiden hoitamisesta huolehditaan kaikkina vuorokauden aikoina. Hoivakodissa kunnioitetaan kuolevan vakaumusta ja hänen henkisestä hyvinvoinnistaan huolehditaan.",
	filterLabel: "Rajaa tuloksia:",
	filterAraLabel: "ARA-kohde",
	filterAraText: "Näytä vain ARA-kohteet",
	filterAraLabel2: "Ei ARA-kohde",
	filterAraText2: "Piilota ARA-kohteet",
	filterAraDesc:
		"ARA-kohteet on rahoitettu valtion tuella, ja asukkaiden valintaperusteina ovat palvelutarve sekä varallisuus.",
	serviceLanguage: "Palvelukieli",
	serviceLanguageLabel: "Hoivakodin palvelukieli",
	filterFinnish: "Suomi",
	filterSwedish: "Ruotsi",
	filterYes: "Kyllä",
	filterNo: "Ei",
	filterLocation: "Sijainti",
	filterLAH: "Lyhytaikainen asuminen",
	filterLAHText: "Näytä vain lyhytaikaista asumista tarjoavat paikat.",
	alsoLAHText: "Myös lyhytaikaista asumista",
	btnClear: "Tyhjennä",
	btnSave: "Tallenna",
	summaryLabel: "hoivakotia",
	loadingText: "Ladataan...",
	numApartments: "Asuntojen määrä",
	filterSelections: "valintaa",
	linkBacktoList: "Takaisin hoivakotilistaukseen",

	anchorDetailsBox: "Hoivakodin yhteystiedot",

	basicInformation: "Perustiedot",
	owner: "Omistaja",
	yearofConst: "Rakennusvuosi",
	apartmentSize: "Asuntojen neliömäärä",
	apartmentFurnitureLabel: "Peruskalustus",
	apartmentFurnitureText:
		"Palveluun kuuluu sähköisesti säädettävä sänky, patja, vaatekaappi, lukittava säilytysmahdollisuus ja yleisvalaisin. Lisäksi asiakas voi kalustaa ja sisustaa asuntonsa omien toiveidensa ja mieltymysten mukaisesti.",
	rent: "Vuokran määrä",
	LAHapartments: "Lyhytaikaisen asumisen asuntoja",
	foodHeader: "Ruoka",
	cookingMethod: "Ruoan valmistuksen tapa",
	ownKitchen: "Oma keittiö",
	foodMoreInfo: "Lisätietoa ruoasta",
	linkMenu: "Ruokalista",
	activies: "Toiminta",
	outdoorActivies: "Ulkoilumahdollisuudet",
	visitingInfo: "Hoivakotiin tutustuminen",
	accessibility: "Esteettömyys",
	personnel: "Henkilökunta",
	otherServices: "Muut hoivakodin palvelut",
	nearbyServices: "Lähellä olevat palvelut",
	contactInfo: "Yhteystiedot",
	directions: "Kulkuyhteydet",
	webpage: "Hoivakodin verkkosivut",

	linkMoreInfoOutdoor: "Lisätietoa ulkoilumahdollisuuksista",
	linkMoreInfoActivies: "Lisätietoa toiminnasta",
	linkMoreInfoPersonnel: "Lisätietoa henkilöstön tyytyväisyydestä",
	monthShort: "kk",

	pageAccessibilityHeader: "Saavutettavuusseloste",
	pageAccessibilityBody: `
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu tellus ornare, egestas eros sit amet, volutpat eros. Ut vel sodales eros. Proin tristique pellentesque purus sit amet semper. Nullam euismod tristique magna vitae dictum. Quisque aliquam ultricies leo in tempus. Suspendisse convallis neque ut lorem scelerisque, quis accumsan tortor pretium.
		</p>
		<p>
			Integer eu efficitur sem. Vivamus aliquet fermentum placerat. Vivamus suscipit imperdiet pharetra. Pellentesque sollicitudin lorem elit, id consequat augue tempus id. Duis tristique sed ante vel ornare. Sed venenatis eros in augue laoreet, quis sodales orci egestas. Aliquam ut posuere odio. Duis id fermentum lacus. Fusce eget molestie libero, ac dictum nulla. Sed eu magna sed enim tempor posuere et non felis. Proin nec arcu sagittis enim tempus ullamcorper. Aliquam erat volutpat. Vivamus hendrerit urna nec dictum condimentum. Nam eros arcu, varius et metus vel, iaculis tincidunt mauris.
		</p>
		<p>
			Praesent aliquet diam in elementum cursus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque at eleifend leo, in sollicitudin arcu. Sed fringilla posuere neque tempus accumsan. Donec sollicitudin, tortor pulvinar pellentesque molestie, erat augue viverra lacus, id commodo est libero ac lorem. Phasellus blandit massa et ante porttitor, ultricies laoreet risus porttitor. Etiam nulla dui, dictum a lacinia non, hendrerit ac nisl.
		</p>`,

	footerLinkPrivacy: "Tietosuojaseloste",
	footerLinkAccessibility: "Saavutettavuusseloste",
	footerLinkFeedback: "Anna palautetta sivustosta",

	vacancyTrue: "Vapaita asuntoja",
	vacancyFalse: "Ei vapaita asuntoja",

	pageUpdateTitle: "Päivitä vapaiden asuntojen tilanne",
	pageUpdateIntro:
		"Valitse hoivakodin vapaiden asuntojen tilanne allaolevista vaihtoehdoista:",
};

const translationsSe: TranslationsBundle = {
	appTitle: "Vårdhem i Esbo",
	titleTemplate: "%s – Vårdhem i Esbo",

	navHome: "Hemsida",
	navNursingHomes: "Vårdhem",
	jumbotronBtn: "Visa vårdhem",
	jumbotronHeadline: "Hitta ett snyggt vårdhem",
	locationPickerLabel: "Vart söker du vårdhem?",
	locationPickerPlaceholder: "Alla områden",
	landingIngress1:
		"På den här webbplatsen hittar du <0> Enhanced Service Housing </0> Vårdhem för <1> äldre </1> godkända av staden Esbo. För att få ett vårdhem behöver du ett positivt beslut om behovet av förbättrad servicebostad.",
	landingIngress2:
		"Letar du efter ett vårdhem med en servicekupong? Se vårdhem på ",
	urlParastapalvelua: "https://www.parastapalvelua.fi/sv",
	whatisNursinghomeHeadline: "Vad är förbättrad servicehus?",
	whatisNursinghomeText:
		"Enhanced Service Housing är designad för äldre som behöver 24-timmars vård och vård och inte längre kan bo i sina egna hem. Det finns en ständig närvaro av personal med professionell vårdutbildning i Enhanced Service Living Nursing Homes. Esbo anordnar förbättrade servicebostäder i flera privata tjänsteleverantörers vårdhem och i sina egna vårdhem. På ett vårdhem får klienten vård och vård som tillgodoser deras behov resten av livet.",
	decisionStepsHeadline: "Hur får du ett beslut om servicehus?",
	decisionStep1Headline: "1. Ta kontakt av Nestor",
	decisionStep1Text:
		"Nestori är Senior Counselling Unit i staden Espoo, <0>tel. +358 9 816 33 333</0>",
	decisionStep2Headline: "2. Identifiera servicebehov",
	decisionStep2Text:
		"En Nestor socialarbetare kommer till dig för att bestämma dina servicebehov",
	decisionStep3Headline: "3. Servicebeslut",
	decisionStep3Text:
		"Efter ett positivt servicebeslut kan du börja leta efter ett vårdhem som passar dig",
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
	faqItem4Headline:
		"sv_Kuuluvatko tyynyt, peitot ja liinavaatteet palveluun?",
	faqItem4Text:
		"sv_Nämä eivät kuulu palveluun. Näiden osalta on hoivakotikohtainen käytäntö; toisissa hoivakodeissa asiakas tuo ne itse ja toisissa ne järjestyvät hoivakodin toimesta.",
	faqItem5Headline: "sv_Mitä siivousta kuuluu palveluun?",
	faqItem5Text:
		"sv_Asiakkaalla omat normaalin vesipesun kestävä vaatteet. Jos asiakkaalla on erikoispesuja vaativia vaatteita tai muita tekstiilejä, niin niiden pesuista asiakas vastaa itse.",
	faqItem6Headline: "sv_Kuka hoitaa asiakkaan vaatteet?",
	faqItem6Text:
		"sv_Asunto siivotaan vähintään kerran viikossa. Lisäksi asunnossa huolehditaan päivittäin huolehditaan vuoteen sijaamisesta, roskien viemisestä, tahrojen poistamisesta ja tarvittaessa vuodevaatteiden vaihtamisesta. Asiakas voi halutessaan osallistua näihin tehtäviin. Ikkunat pestään tarpeen mukaan.",
	faqItem7Headline: "sv_Miten lääkkeet hoituvat?",
	faqItem7Text:
		"sv_Lääkkeiden annosjakelu kuuluu palveluun ja asiakas maksaa itse omat lääkkeet.",
	faqItem8Headline:
		"sv_Onko hoivakodissa kaikki asiakkaan tarvitsemat apuvälineet?",
	faqItem8Text:
		"sv_Hoivakodissa on tarpeellinen määrä yhteiskäyttöisiä apuvälineitä. Näitä ovat esimerkiksi nostolaitteet, tukikaiteet sekä asentohoitoon soveltuvat tyynyt. Lisäksi asiakkaalla voi olla henkilökohtaisia apuvälineita HUS:in Apuvälinekeskuksesta. Asiakas kustantaa henkilökohtaisten apuvälineiden noutamisen ja palveluntuottajalla on avustusvelvollisuus noudon toteuttamisessa.",
	faqItem9Headline: "sv_Mitkä ruokailut kuuluvat palveluun?",
	faqItem9Text:
		"sv_Asiakas saa hoivakodissa aamiaisen, lounaan, iltapäiväkahvin/välipalan, päivällisen ja iltapalan. Lounas ja päivällinen ovat lämpimiä aterioita. Lisäksi asiakas saa tarvittaessa yöpalaa. Erityisruokavaliot ja lääkäriin määräämät täydennysravintovalmisteet kuuluvat palveluun.",
	faqItem10Headline:
		"sv_Mitä muuta kuin välttämätöntä hoivaa palveluun kuuluu?",
	faqItem10Text:
		"sv_Asiakas avustetaan päivittäin ylös vuoteesta ja asiakkaalla on mahdollisuus käyttää päivävaatteitaan. Asiakkaalla on mahdollisuus aktiiviseen elämään. Aktiivisuuteen sisältyy muun muassa ulkoilua, liikuntaa, kulttuuria sekä käsillä tekemistä asiakkaan toiveiden ja aikaisempien tottumusten mukaisesti.",
	faqItem11Headline:
		"sv_Miten läheiset voivat olla mukana asiakkaan elämässä?",
	faqItem11Text:
		"sv_Läheiset voivat olla mukana hoivakodin arjessa ja yöpyä tilapäisesti asiakkaan asunnossa. Asiakas/omainen sopii käytännöt hoivakodin kanssa.",
	faqItem12Headline: "sv_Miten saattohoito järjestetään?",
	faqItem12Text:
		"sv_Asiakas voi asua hoivakodissa elämänsä loppuun asti. Kivun ja muiden oireiden hoidosta huolehditaan kaikkina vuorokauden aikoina. Hoivakodissa kunnioitetaan kuolevan vakaumusta ja hänen henkisestä hyvinvoinnistaan huolehditaan.",
	filterLabel: "Filter resulter:",
	filterAraLabel: "ARA-boende",
	filterAraText: "Visa bara ARA-boende",
	filterAraLabel2: "Ingen ARA-boende",
	filterAraText2: "Döljä ARA-boende",
	filterAraDesc:
		"ARA-boende är finansierad med statligt stöd och invånare väljs utifrån behov av tjänster och förmögenhet.",
	serviceLanguage: "Språk",
	serviceLanguageLabel: "Vårhemets pråk",
	filterFinnish: "Finska",
	filterSwedish: "Svenska",
	filterYes: "Ja",
	filterNo: "Nej",
	filterLocation: "Location",
	filterLAH: "Kortvarigt boende",
	filterLAHText: "Visa bara platser med kortvarigt boende.",
	alsoLAHText: "Också kortvarigt boende",
	btnClear: "Rensa",
	btnSave: "Spara",
	summaryLabel: "vårhem",
	loadingText: "Laddar...",
	numApartments: "Antal bostäder",
	filterSelections: "val",
	linkBacktoList: "Tillbaka till vårhemlist",

	anchorDetailsBox: "sv_Hoivakodin yhteystiedot",

	basicInformation: "Grundläggande",
	owner: "Ägare",
	yearofConst: "Byggnadsår",
	apartmentSize: "Bostadens storlek",
	apartmentFurnitureLabel: "Möbler",
	apartmentFurnitureText: "Säng, toalet, bord",
	rent: "Hyra",
	LAHapartments: "Kortvarigt boende",
	foodHeader: "Mat",
	cookingMethod: "Sättet att laga mat",
	ownKitchen: "Eget kök",
	foodMoreInfo: "Mera information om mat",
	linkMenu: "Matlist",
	activies: "Aktiviteter",
	outdoorActivies: "Friluftsliv",
	visitingInfo: "Besökinformation",
	accessibility: "Tillgänglighet",
	personnel: "Personnel",
	otherServices: "Andra vårdhemstjänster",
	nearbyServices: "Närliggande tjänster ",
	contactInfo: "Kontaktinformation",
	directions: "Riktingar",
	webpage: "Websidan",

	linkMoreInfoOutdoor: "Läs mera om friluftsliv",
	linkMoreInfoActivies: "Läs mera om aktiviteter",
	linkMoreInfoPersonnel: "Läs mera om personnel",
	monthShort: "mm",

	pageAccessibilityHeader: "sv_Saavutettavuusseloste",
	pageAccessibilityBody: `
		<p>
			sv_Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu tellus ornare, egestas eros sit amet, volutpat eros. Ut vel sodales eros. Proin tristique pellentesque purus sit amet semper. Nullam euismod tristique magna vitae dictum. Quisque aliquam ultricies leo in tempus. Suspendisse convallis neque ut lorem scelerisque, quis accumsan tortor pretium.
		</p>
		<p>
			sv_Integer eu efficitur sem. Vivamus aliquet fermentum placerat. Vivamus suscipit imperdiet pharetra. Pellentesque sollicitudin lorem elit, id consequat augue tempus id. Duis tristique sed ante vel ornare. Sed venenatis eros in augue laoreet, quis sodales orci egestas. Aliquam ut posuere odio. Duis id fermentum lacus. Fusce eget molestie libero, ac dictum nulla. Sed eu magna sed enim tempor posuere et non felis. Proin nec arcu sagittis enim tempus ullamcorper. Aliquam erat volutpat. Vivamus hendrerit urna nec dictum condimentum. Nam eros arcu, varius et metus vel, iaculis tincidunt mauris.
		</p>
		<p>
			sv_Praesent aliquet diam in elementum cursus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque at eleifend leo, in sollicitudin arcu. Sed fringilla posuere neque tempus accumsan. Donec sollicitudin, tortor pulvinar pellentesque molestie, erat augue viverra lacus, id commodo est libero ac lorem. Phasellus blandit massa et ante porttitor, ultricies laoreet risus porttitor. Etiam nulla dui, dictum a lacinia non, hendrerit ac nisl.
		</p>`,

	footerLinkPrivacy: "sv_Tietosuojaseloste",
	footerLinkAccessibility: "sv_Saavutettavuusseloste",
	footerLinkFeedback: "sv_Anna palautetta sivustosta",

	vacancyTrue: "sv_Vapaita paikkoja",
	vacancyFalse: "sv_Ei vapaita paikkoja",

	pageUpdateTitle: "sv_Päivitä hoivakodin tietoja",
	pageUpdateIntro:
		"sv_Tällä sivulla voit päivittää hoivakodin tietoja. Valitse hoivakodin vapaiden asuntojen tilanne allaolevalla lomakkeella:",
};

i18n.addResources("fi-FI", ns, translationsFi);

i18n.addResources("sv-FI", ns, translationsSe);
