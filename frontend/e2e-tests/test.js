module.exports = {
  'Demo test' : function (browser) {
    browser
      .pause(5000)
      .url('http://127.0.0.1:4000/hoivakodit')
      .waitForElementVisible('.results-summary')
      .end()
  },
  'Demo test 1' : function (browser) {
    browser
      .url('http://127.0.0.1:4000/hoivakodit')
      .waitForElementVisible('.card-container')
      .end()
  }
};