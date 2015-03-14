var path = require('path');

console.log(__dirname);

var browser = 'Chrome';

var Config = {
  localBrowser: true,
  browser: browser,
  browserVersion: 30,
  screenshotRoot: path.join(__dirname, 'screenshots', browser),
  browserstackUser: process.env.BROWSERSTACK_USER,
  browserstackKey: process.env.BROWSERSTACK_KEY,
  api: 'http://localhost:9000/api/',
  websiteUrl: 'http://localhost:8982'
};

module.exports = Config;
