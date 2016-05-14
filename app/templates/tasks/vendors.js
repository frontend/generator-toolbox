'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json');

module.exports = function() {

 /*
  * CSS Vendors
  */
  gulp.task('css-vendors', function() {
    return gulp.src(config.vendors.css)
      .pipe($.concat('vendors.min.css'))
      .pipe($.cleanCss())
      .pipe($.size({title: 'CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'css'));
  });

 /*
  * JS Vendors
  */
  gulp.task('js-vendors', function() {
    return gulp.src(config.vendors.js)
      .pipe($.concat('vendors.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: 'JS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

 /*
  * Fonts Sources
  */
  gulp.task('fonts-vendors', function() {
    return gulp.src(config.vendors.fonts)
      .pipe($.size({title: 'FONTS'}))
      .pipe(gulp.dest(config.build + 'fonts'));
  });

 /*
  * Polyfills Sources
  */
  gulp.task('polyfills-vendors', function() {
    return gulp.src(config.vendors.polyfills)
      .pipe($.concat('polyfills.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: 'POLYFILLS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

  /*
  * Build vendors dependencies
  */
  gulp.task('vendors', function() {
    return gulp.start('css-vendors', 'js-vendors', 'fonts-vendors', 'polyfills-vendors');
  });

};
