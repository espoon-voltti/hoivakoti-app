module.exports = {
  'Demo test' : function (browser) {
    browser
      .url('http://localhost:4000/hoivakodit')
      .waitForElementVisible('.card-container')
  }
};