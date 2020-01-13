# hoivakoti-app

Hoivakoti-sovellus on Espoon kehittämä ja ylläpitämä sivusto, joka listaa ja näyttää Espoon kuntalaisille saatavilla olevia hoivakoteja eli tehostetun palveluasumisen yksiköitä.

Sovelluksessa on jonkin verran koodattuna Espoolle ominaisia tietoja, kuten esimerkiksi Espoon kaupunginosien postinumeromappauksia, mutta sovellus pyrkii pääosin olemaan kaupunkiagnostinen. Sovellus on avointa ja vapaasti käytettävää lähdekoodia.

Hoivakoti-sovellus pyörii osoitteessa: https://hoivakodit.espoo.fi/fi-FI/

## Tekniset vaamitukset

Sovelluksen mukana tulee docker- ja docker-compose -tiedostot. Dockerilla ajettaessa ainoa vaatimus on toimiva docker-installaatio.

Dockerin ulkopuolella ajettaessa tarvitaan:
 - PostgreSQL
 - Node 10+ (`nvm` suositeltu asennettujen Node-versioiden hallintaan)

## Kehittäminen

