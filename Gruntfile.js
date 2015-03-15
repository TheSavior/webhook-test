'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    'http-server': {
      dev: {
        port: 8001,
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

  grunt.registerTask('serve', ['http-server:dev', 'execute']);
  grunt.registerTask('test', ['execute']);

};
