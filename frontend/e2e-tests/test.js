module.exports = {
  'React is can display /hoivakodit template' : function (browser) {
    browser
      .url('http://0.0.0.0:4000/hoivakodit')
      .waitForElementVisible('.results-summary')
      .end()
  },
  'React can get and display content from backend' : function (browser) {
    browser
      .url('http://0.0.0.0:4000/hoivakodit')
      .waitForElementVisible('.card-container')
      .end()
  },
  'Language selection is working' : function (browser) {
    browser
      .url('http://0.0.0.0:4000')
      .waitForElementVisible('body')
      .click('a[lang=sv-SV]')
      .pause(300)
      .assert.containsText('.title', 'Vårdhemmen i Esbo')
      .click('a[lang=fi-FI]')
      .pause(300)
      .assert.containsText('.title', 'Espoon hoivakodit')
      .click('a[lang=fi-FI]')
      .pause(300)
      .assert.containsText('.title', 'Espoon hoivakodit')
      .end()
  },
  'Show nursinghomes button and selection is working' : function (browser) {
    browser
      .url('http://0.0.0.0:4000')
      .waitForElementVisible('body')
      .click('.location-picker-select button.button-dropdown')
      .pause(200)
      .assert.visible('.location-picker-select .button-dropdown-items')
      .click('.location-picker-select button.button-dropdown')
      .pause(200)
      .click('.location-picker button.btn.landing-cta')
      .pause(200)
      .assert.urlEquals('http://0.0.0.0:4000/fi-FI/hoivakodit')
      .end()
  },
};