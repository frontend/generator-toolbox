'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json');

module.exports = function() {

 /**
  * Copy favicons in styleguide folder
  */
  gulp.task('favicons', function() {
    return gulp.src(config.assets + 'favicons/*')
      .pipe(gulp.dest(config.metalsmith.dist));
  });

};
