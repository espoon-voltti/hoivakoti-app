module.exports = {
  'Demo test' : function (browser) {
    browser
      .pause(20000)
      .url('http://localhost:4000/hoivakodit')
      .waitForElementVisible('body')
  },
  'Demo test 2' : function (browser) {
    browser
      .url('http://localhost:4000/hoivakodit')
      .waitForElementVisible('.card-container')
  }
};