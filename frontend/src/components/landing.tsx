import React from "react"
import "../styles/landing.scss"
import { useHistory } from "react-router-dom";
import { Button } from "reakit/Button";


function Landing() {
	let history = useHistory();

	const areas = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

	let selected_area = -1;

	const on_selected_area = function(event: any) {
		console.log(event.target.value)
		selected_area = event.target.value;
	}

	const menu_items_dom: object[] = areas.map((area, index) => {
		return (
			<option value={index} key={index}>{area}</option>
		)
	});

	return (
		<div id="landing">
			<div className="jumbotron">
				<h2 className="jumbotron__header">Löydä sopiva hoivakoti<span>Tutustu Espoon kaupungin hyväksymiin hoivakoteihin.</span></h2>		
			</div>

			<div className="location-picker">
				<b>Miltä alueelta etsit hoivakotia?</b>
				<select onChange={on_selected_area}>
					{menu_items_dom}
				</select>
				<Button onClick={() => {
					const url = "/hoivakodit" + (selected_area >= 0 ? "?hk=" + selected_area : "");
					history.push(url);
				}}>
					Näytä Hoivakodit
				</Button>
			</div>
			<div className="content-column">
				<section className="content-block">
					<p className="ingress">Sivustolta löydät tiedot Espoon kaupungin hyväksymistä hoivakodeista. Saadaksesi hoivakotipaikan tarvitset myönteisen päätöksen tehostetun palveluasumisen tarpeesta.</p>
					<p className="ingress">Etsitkö hoivakotia palvelusetelillä? Katso hoivakoteja osoitteessa <a href="https://www.parastapalvelua.fi/" target="_blank">www.parastapalvelua.fi</a></p>
				</section>

				<section className="content-block">
					<h2>Miten saat tehostetun palveluasumisen päätöksen?</h2>
					<p>Lisätietoja hakemisesta</p>
				</section>

				<section className="content-block">
					<h2>Mitä on tehostettu palveluasuminen?</h2>
					<p>Espoon kaupunki järjestää tehostettua palveluasumista useissa yksityisten palveluntuottajien hoivakodeissa sekä omissa hoivakodeissaan. Tehostettu palveluasuminen on tarkoitettu ikääntyneille, jotka tarvitsevat ympärivuorokautisesti hoivaa ja huolenpitoa. Näissä hoivakodeissa on terveydenhuollon ammattikoulutuksen saanutta henkilökuntaa paikalla jatkuvasti. Hoivakodissa saa tarpeiden mukaista hoivaa ja huolenpitoa elämän loppuun saakka.</p>
				</section>

				<section className="content-block">
					<h2>Mitä hoivakodin antamaan palveluun kuuluu?</h2>
					<p>Kaikki tällä sivustolla esillä olevat hoivakodit ovat sitoutuneet noudattamaan Espoon kaupungin palvelukonseptia, joka määrittää vähimmäisvaatimukset palvelun sisällölle ja laadulle.</p>

					<h3>Usein kysyttyjä kysymyksiä palvelusta</h3>
					<dl className="faq-list">
						<dt>Kuuluuko ikkunanpesu palveluun? </dt>
						<dd>Kuuluu tarpeen mukaisesti.</dd>

						<dt>Kuka hoitaa asiakkaan vaatteet?</dt>
						<dd>Asiakkaalla omat vaatteet (normaalin vesipesun kestävät). Erikoispesuista asiakas vastaa itse.</dd>

						<dt>Kuuluvatko tyynyt, peitot ja liinavaatteet palveluun?</dt>
						<dd>Hoivakotikohtainen käytäntö</dd>

						<dt>Miten lääkkeet hoituvat?</dt>
						<dd>Asiakas maksaa itse, annosjakelu kuuluu palveluun.</dd>

						<dt>Asiakaskohtaisten apuvälineiden noudot </dt>
						<dd>Asiakas kustantaa, palveluntuottajalla avustusvelvollisuus.</dd>
					</dl>
				</section>
			</div>
		</div>
	)
}
//			<p className="nursinghome-container-child" id="nursinghome-summary">{this.nursinghome.summary}</p>

export { Landing }
