'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json');

module.exports = function() {
  function handleError(err) {this.emit('end');}

  gulp.task('test:unit', function () {
    return gulp.src(['tests/unit/**/*.js'], {read: false})
      .pipe($.mocha({
        reporter: 'spec'
      }))
      .on("error", handleError);
  });

};
