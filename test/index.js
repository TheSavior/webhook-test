var webdriverio = require('webdriverio');
var targz = require('tar.gz');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs-extra'));
var git = require('git-rev');
var request = require('request');
var gitInfo = require('../libs/gitInfo');

var config = require('../config.js');
var pageTests = require('./pageTests');

var capabilities;

if (config.localBrowser) {
  capabilities = {
    desiredCapabilities: {
      browserName: config.browser
    }
  };
} else {
  capabilities = {
    host: 'ondemand.saucelabs.com',
    // host: 'hub.browserstack.com',
    port: 80,
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    runsWithSauce: true,
    waitForTimeout: 1000,
    desiredCapabilities: {
      'browser': config.browser,
      'version': config.browserVersion,
      'os': 'windows',
      //'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'idle-timeout': 900,
      /*'browserstack.debug': 'true',
      'browserstack.user': config.browserstackUser,
      'browserstack.key': config.browserstackKey*/
    }
  };
}

var branchInfo;

fs.removeAsync(config.screenshotRoot)
.then(function() {
  return gitInfo.getBranchAndSha();
})
.then(function(branchSha) {
  branchInfo = branchSha;

  console.log('Currently at', branchInfo.branch, branchInfo.sha);

  if (branchInfo.branch !== 'master') {
    return gitInfo.getCommonAncestor(branchInfo.sha, 'master')
    .then(function(ancestor) {
      console.log('diffing against', ancestor);
      return startBuild({
        head: branchInfo.sha,
        base: ancestor,
        numBrowsers: 1
      })
      .then(function(build) {
        console.log('Build started', build.build);
      });
    });
  }
})
.then(function() {
  var client = webdriverio.remote(capabilities);
  return pageTests(client);
})
.then(function() {
  return upload({
    sha: branchInfo.sha,
    browser: config.browser
  });
})
.catch(function(e) {
  console.error(e);
});


return;

function upload(options) {
  var sha = options.sha;
  var browser = options.browser;

  return new Bluebird(function(resolve, reject) {
    new targz()
    .compress(config.screenshotRoot, config.screenshotRoot + '.tar.gz', function(err) {
      if (err) {
        reject(new Error(err));
        return;
      }

      var args = {
        url: config.api + 'upload',
      };

      var r = request.post(args, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          reject(error || body);
          return;
        }

        resolve(body);
      });

      var form = r.form();
      form.append('sha', sha);
      form.append('browser', config.browser);
      form.append('images', fs.createReadStream(config.screenshotRoot + '.tar.gz'));
    });
  });
}

function startBuild(options) {
  var head = options.head;
  var base = options.base;
  var numBrowsers = options.numBrowsers;

  return new Bluebird(function(resolve, reject) {
    var options = {
      uri: config.api+'startBuild',
      method: 'POST',
      json: true,
      body: {
        head: head,
        base: base,
        numBrowsers: numBrowsers
      }
    };

    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error || body);
        return;
      }

      resolve(body);
    });
  });
}
