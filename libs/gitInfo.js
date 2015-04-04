var Bluebird = require('bluebird');
var git = require('git-rev');
var exec = require('child_process').exec;

function execute(cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {
    cb(stdout.split('\n').join(''));
  });
}

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
  },
  getCommonAncestor: function(headSha, baseBranch) {
    return new Bluebird(function(resolve) {
      var command = "bash -c 'diff -u <(git rev-list " + headSha + " --all) "+
      "<(git rev-list " + baseBranch + " --first-parent)' "+
      "| sed -ne 's/^ //p' | head -1";

      execute(command, function(data) {
        resolve(data);
      });
    });
  },

  isOnBranch: function(sha, branch) {
    return new Bluebird(function(resolve) {
      var command = 'git rev-list ' + branch + ' | grep ' + sha;

      execute(command, function(data) {
        resolve(data !== '');
      });
    });
  }
};


module.exports = GitInfo;