module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://localhost:4000/hoivakodit')
      .pause(20000)
      .waitForElementVisible('.card-container', 10000)
  }
};