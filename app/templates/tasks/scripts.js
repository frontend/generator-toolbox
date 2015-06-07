'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    argv          = require('yargs').argv;

module.exports = function() {

  /**
   * Build JS
   * With error reporting on compiling (so that there's no crash)
   * And jshint check to highlight errors as we go.
   */
  gulp.task('scripts', function() {
    return gulp.src(config.assets + 'js/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.concat('main.js'))
      .pipe($.if(argv.production, $.uglify()))
      .pipe($.size({title: 'JS SCRIPTS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

};
