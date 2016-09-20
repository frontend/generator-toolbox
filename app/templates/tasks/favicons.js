/* globals require, module */

const gulp          = require('gulp'),
      config        = require('../gulp_config.json');

module.exports = function() {

 /**
  * Copy favicons in styleguide folder
  */
  gulp.task('favicons', function() {
    return gulp.src(`${config.assets}favicons/*`)
      .pipe(gulp.dest(config.metalsmith.dist));
  });

};
