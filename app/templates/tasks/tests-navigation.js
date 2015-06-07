'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json');

module.exports = function() {

  gulp.task('test:navigation', function () {
    return gulp.src('tests/navigation/**/*.js')
      .pipe($.casperjs({command:'test'}))
      .on('error', function(data) {
        $.util.log('Error', data.message);
      });
  });

};
