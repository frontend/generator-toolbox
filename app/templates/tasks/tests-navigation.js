/* globals require, module */

const gulp          = require('gulp'),
      $             = require('gulp-load-plugins')();

module.exports = function() {

  gulp.task('test:navigation', function () {
    return gulp.src('tests/navigation/**/*.js')
      .pipe($.casperjs({command:'test'}))
      .on('error', function(data) {
        $.util.log('Error', data.message);
      });
  });

};
