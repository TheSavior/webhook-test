'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    'http-server': {
      dev: {
        port: 8982,
        runInBackground: true
      }
    },

    execute: {
      target: {
        src: ['test/index.js']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['http-server:dev', 'execute']);
};
