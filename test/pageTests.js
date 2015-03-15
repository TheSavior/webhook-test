var Bluebird = require('bluebird');
var webdrivercss = require('webdrivercss');
var config = require('../config.js');


function runTests(client) {
  return new Bluebird(function(resolve, reject) {
    webdrivercss.init(client, {
      screenshotRoot: config.screenshotRoot,
      failedComparisonsRoot: 'failed/',
      screenWidth: [700]//, 1300]
    });

    client
      .init()
      .url('http://localhost:8982')
      .webdrivercss('elements', [{
        name: 'button',
        elem: '#button'
      }/*, {
        name: 'form',
        elem: '#form'
      }*/])
      .call(resolve)
      .end();
  });
}

module.exports = runTests;
