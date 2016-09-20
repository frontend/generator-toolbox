/* globals require, module */

const gulp          = require('gulp'),
      config        = require('../gulp_config.json'),
      del           = require('del');

module.exports = function() {

 /**
  * Clean output directories
  */
  gulp.task('clean', del.bind(null, [
    config.build.substr(0, config.build.length - 1),
    config.metalsmith.dist
  ]));

};
