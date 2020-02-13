module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://localhost:4000/hoivakodit')
      .waitForElementVisible('.results-summary')
  },
  'Demo test 1' : function (browser) {
    browser
      .pause(10000)
      .url('http://localhost:4000/hoivakodit')
      .waitForElementVisible('.card-container')
  }
};