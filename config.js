var path = require('path');

console.log(__dirname);

var browser = process.env.BROWSER || 'Chrome';

var Config = {
  localBrowser: false,
  browser: browser,
  browserVersion: process.env.BROWSER_VERSION,
  browserstackUser: process.env.BROWSERSTACK_USER,
  browserstackKey: process.env.BROWSERSTACK_KEY,
  projectId: '092f9894-26b0-4482-9eba-c287ab99fc62',
  screenshotRoot: path.join(__dirname, 'screenshots', browser),
  api: 'https://visualdiff.ngrok.com/api/',
  websiteUrl: 'http://0.0.0.0:8001'
};

module.exports = Config;
