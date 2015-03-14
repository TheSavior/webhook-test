var Bluebird = require('bluebird');
var git = require('git-rev');

function getBranch() {
  return new Bluebird(function(resolve) {
    git.branch(function(branch) {
      resolve(branch);
    });
  });
}

function getSha() {
  return new Bluebird(function(resolve) {
    git.long(function(sha) {
      resolve(sha);
    });
  });
}

var GitInfo = {
  getBranchAndSha: function() {
    return Bluebird.all([
      getBranch(),
      getSha()
    ])
    .spread(function(branch, sha) {
      return {
        branch: branch,
        sha: sha
      };
    });
  }
};


module.exports = GitInfo;