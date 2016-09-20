/* globals require, module */

const gulp          = require('gulp'),
      $             = require('gulp-load-plugins')();

module.exports = function() {
  function handleError() {this.emit('end');}

  gulp.task('test:unit', function () {
    return gulp.src(['tests/unit/**/*.js'], {read: false})
      .pipe($.mocha({
        reporter: 'spec'
      }))
      .on('error', handleError);
  });

};
