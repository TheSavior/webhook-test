var webdriverio = require('webdriverio');
var fs = require('fs-extra');
var targz = require('tar.gz');
var git = require('git-rev');
var request = require('request');

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
    host: 'hub.browserstack.com',
    port: 80,
    desiredCapabilities: {
      'browser': config.browser,
      'version': config.browserVersion,
      'os': 'windows',
      'browserstack.debug': 'true',
      'browserstack.user': config.browserstackUser,
      'browserstack.key': config.browserstackKey
    }
  };
}

fs.removeSync(config.screenshotRoot);
var client = webdriverio.remote(capabilities);

pageTests(client)
.then(function() {
  // upload();
});

// upload();
// startBuild();

function upload() {
  git.long(function(sha) {
    // sha = 'newsha';

    new targz()
      .compress(config.screenshotRoot, config.screenshotRoot + '.tar.gz', function(err) {
        if (err) {
          throw new Error(err);
        }

        var args = {
          url: api + 'upload',
        };

        var r = request.post(args, function(err, httpResponse, body) {
          if (err || (httpResponse && httpResponse.statusCode !== 200)) {
            throw new Error(err || body);
          }
        });

        var form = r.form();
        form.append('sha', sha);
        form.append('browser', config.browser);
        form.append('images', fs.createReadStream(config.screenshotRoot + '.tar.gz'));

      });
  });
}

function startBuild() {
  var options = {
    uri: config.api+'startBuild',
    method: 'POST',
    json: true,
    body: {
      head: 'newsha',
      base: '9c4d8d92cf5efcb8a20fbc153a44cfed37ef1e7c',
      numBrowsers: 2
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response);
      console.log(body);
    }
  });
}
