var path = require('path');

console.log(__dirname);

var browser = process.env.BROWSER || 'Chrome';

var Config = {
  localBrowser: false,
  browser: browser,
  browserVersion: process.env.BROWSER_VERSION,
  browserstackUser: process.env.BROWSERSTACK_USER,
  browserstackKey: process.env.BROWSERSTACK_KEY,
  screenshotRoot: path.join(__dirname, 'screenshots', browser),
  api: 'https://visualdiff.ngrok.com/api/',
  websiteUrl: 'http://localhost:8982'
};

module.exports = Config;
