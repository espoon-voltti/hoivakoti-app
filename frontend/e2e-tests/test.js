module.exports = {
	"React is can display /hoivakodit template": function (browser) {
		browser
			.url("http://localhost:4000/hoivakodit")
			.waitForElementVisible(".results-summary")
			.end();
	},
	"React can get and display content from backend": function (browser) {
		browser
			.url("http://localhost:4000/hoivakodit")
			.waitForElementVisible(".card-container")
			.end();
	},
	"Language selection is working": function (browser) {
		browser
			.url("http://localhost:4000")
			.waitForElementVisible("body")
			.click("a[lang=sv-SV]")
			.pause(300)
			.assert.containsText(".title", "Vårdhemmen i Esbo")
			.click("a[lang=fi-FI]")
			.pause(300)
			.assert.containsText(".title", "Länsi-Uudenmaan hoivakodit")
			.click("a[lang=fi-FI]")
			.pause(300)
			.assert.containsText(".title", "Länsi-Uudenmaan hoivakodit")
			.end();
	},
	"Show nursinghomes button and selection is working": function (browser) {
		browser
			.url("http://localhost:4000")
			.waitForElementVisible("body")
			.click(".location-picker-select button.button-dropdown")
			.pause(200)
			.assert.visible(".location-picker-select .button-dropdown-items")
			.click(".location-picker-select button.button-dropdown")
			.pause(200)
			.click(".location-picker button.btn.landing-cta")
			.pause(200)
			.assert.urlEquals("http://localhost:4000/fi-FI/hoivakodit")
			.end();
	},
	"Fronpage nursinghome filter selection is working": function (
		browser,
	) {
		browser
			.url("http://localhost:4000")
			.waitForElementVisible("body")
			.click(".location-picker-select button.button-dropdown")
			.pause(200)
			.click("input[name=commune-radio-group]#filter-1")
			.click(".location-picker-select button.button-dropdown")
			.click(".location-picker button.btn.landing-cta")
			.pause(200)
			.assert.containsText(".results-summary-text", "1 hoivakotia") //ensure this matches the dummy data
			.end();
	},
	"Filtering nursinghomes based on language is working - part 1/2": function (
		browser,
	) {
		browser
			.url("http://localhost:4000/hoivakodit")
			.waitForElementVisible("body")
			.assert.containsText(".results-summary-text", "5 hoivakotia") //ensure this matches the dummy data
			.click(".filters .button-dropdown-container:nth-child(4)")
			.pause(200)
			.click("#filter-1")
			.click(
				".filters .button-dropdown-container:nth-child(5) > div > div:nth-child(2) > div.save-and-empty-container > button.btn",
			)
			.pause(200)
			.assert.containsText(".results-summary-text", "4 hoivakotia") //ensure this matches the dummy data
			.end();
	},
	"Filtering nursinghomes based on language is working - part 2/2": function (
		browser,
	) {
		browser
			.url("http://localhost:4000/hoivakodit")
			.waitForElementVisible("body")
			.assert.containsText(".results-summary-text", "5 hoivakotia") //ensure this matches the dummy data
			.click(".filters .button-dropdown-container:nth-child(4)")
			.pause(200)
			.click("#filter-2")
			.click(
				".filters .button-dropdown-container:nth-child(5) > div > div:nth-child(2) > div.save-and-empty-container > button.btn",
			)
			.pause(200)
			.assert.containsText(".results-summary-text", "1 hoivakotia") //ensure this matches the dummy data
			.end();
	},
};
