import React, { FC, useState, ChangeEvent } from "react";
import "../styles/landing.scss";
import { useHistory } from "react-router-dom";

type Area = "Espoon keskus" | "Espoonlahti" | "Leppävaara" | "Matinkylä" | "Tapiola";

const areas: Area[] = ["Espoon keskus", "Espoonlahti", "Leppävaara", "Matinkylä", "Tapiola"];

const Landing: FC = () => {
	const history = useHistory();

	const [selectedArea, setSelectedArea] = useState<Area | null>(null);

	const handleSelectArea = (event: ChangeEvent<HTMLSelectElement>): void => {
		const area = event.target.value as Area;
		setSelectedArea(area);
	};

	return (
		<div id="landing">
			<div className="jumbotron">
				<h2 className="jumbotron__header">Löydä näköisesi hoivakoti</h2>

				<div className="location-picker">
					<b>Miltä alueelta etsit hoivakotia?</b>
					<select onChange={handleSelectArea}>
						{areas.map(area => (
							<option value={area} key={area}>
								{area}
							</option>
						))}
					</select>
					<button
						className="landing-cta"
						onClick={(): void => {
							const url = "/hoivakodit" + (selectedArea && `?alue=${selectedArea}`);
							history.push(url);
						}}
					>
						Näytä Hoivakodit
					</button>
				</div>
			</div>

			<div className="content-column">
				<section className="content-block">
					<p className="ingress">
						Sivustolta löydät tiedot Espoon kaupungin hyväksymistä hoivakodeista. Saadaksesi hoivakotipaikan
						tarvitset myönteisen päätöksen tehostetun palveluasumisen tarpeesta.
					</p>
					<p className="ingress">
						Etsitkö hoivakotia palvelusetelillä? Katso hoivakoteja osoitteessa{" "}
						<a href="https://www.parastapalvelua.fi/" target="_blank" rel="noopener noreferrer">
							www.parastapalvelua.fi
						</a>
					</p>
				</section>

				<section className="content-block">
					<h2>Mitä on tehostettu palveluasuminen?</h2>
					<p>
						Tehostettu palveluasuminen on tarkoitettu ikääntyneille, jotka tarvitsevat ympärivuorokautisesti
						hoivaa ja huolenpitoa. Näissä hoivakodeissa on terveydenhuollon ammattikoulutuksen saanutta
						henkilökuntaa paikalla jatkuvasti. Espoon kaupunki järjestää tehostettua palveluasumista useissa
						yksityisten palveluntuottajien hoivakodeissa sekä omissa hoivakodeissaan. Hoivakodissa saa
						tarpeiden mukaista hoivaa ja huolenpitoa elämän loppuun saakka.
					</p>
				</section>

				<section className="content-block">
					<h2>Miten saat tehostetun palveluasumisen päätöksen?</h2>
					<p>Lisätietoja hakemisesta</p>
				</section>

				<section className="content-block">
					<h2>Mitä hoivakodin antamaan palveluun kuuluu?</h2>
					<p>
						Kaikki tällä sivustolla esillä olevat hoivakodit ovat sitoutuneet noudattamaan Espoon kaupungin
						palvelukonseptia, joka määrittää vähimmäisvaatimukset palvelun sisällölle ja laadulle.
					</p>

					<h3>Usein kysyttyjä kysymyksiä palvelusta</h3>
					<dl className="faq-list">
						<dt>Kuuluuko ikkunanpesu palveluun?</dt>
						<dd>Kuuluu tarpeen mukaisesti.</dd>

						<dt>Kuka hoitaa asiakkaan vaatteet?</dt>
						<dd>
							Asiakkaalla omat vaatteet (normaalin vesipesun kestävät). Erikoispesuista asiakas vastaa
							itse.
						</dd>

						<dt>Kuuluvatko tyynyt, peitot ja liinavaatteet palveluun?</dt>
						<dd>Hoivakotikohtainen käytäntö</dd>

						<dt>Miten lääkkeet hoituvat?</dt>
						<dd>Asiakas maksaa itse, annosjakelu kuuluu palveluun.</dd>

						<dt>Asiakaskohtaisten apuvälineiden noudot</dt>
						<dd>Asiakas kustantaa, palveluntuottajalla avustusvelvollisuus.</dd>
					</dl>
				</section>
			</div>
		</div>
	);
};

export { Landing };
