'use strict';

var gulp            = require('gulp'),
    $               = require('gulp-load-plugins')(),
    config          = require('../gulp_config.json'),
    argv            = require('yargs').argv,
    browserify      = require('browserify'),
    babelify        = require('babelify'),
    browserifyshim  = require('browserify-shim'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    path            = require('path');


module.exports = function() {

  function errorAlert(error){
    var args = Array.prototype.slice.call(arguments);

    if (!argv.production) {
      $.notify.onError({title: 'JS Error', message: 'Check your terminal', sound: 'Sosumi'})(error);

      if (args) {
        $.util.log(args);
      } else {
        $.util.log(error.messageFormatted);
      }
    }
    this.emit('end');
  }

  /**
   * Build JS
   * With error reporting on compiling (so that there's no crash)
   * And jshint check to highlight errors as we go.
   */
  gulp.task('scripts', ['scripts-lint'], function() {
    if (argv.local) {
      return browserify(
        {
          entries: ['./' + config.assets + 'js/index.js'],
          debug: true
        })
        .transform(babelify.configure({
          presets: ['es2015'],
          sourceMaps: true
        }))
        .bundle()
        .on('error', errorAlert)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.if(argv.production, $.uglify()))
            .on('error', errorAlert)
        .pipe(argv.production ? $.util.noop() : $.sourcemaps.write('./'))
        .pipe(gulp.dest(config.build + '/js'));
    } else {
      return browserify(
        {
          entries: ['./' + config.assets + 'js/index.js'],
          debug: true
        })
        .transform(babelify.configure({
          presets: ['es2015'],
          sourceMaps: true
        }))
        .transform(browserifyshim)
        .bundle()
        .on('error', errorAlert)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.if(argv.production, $.uglify()))
            .on('error', errorAlert)
        .pipe(argv.production ? $.util.noop() : $.sourcemaps.write('./'))
        .pipe($.size({title: 'BUNDLE SIZE', showFiles: true}))
        .pipe(gulp.dest(config.build + '/js'));
    }
  });

  /**
   * Lint JS
   */
  gulp.task('scripts-lint', function() {
    return gulp.src(config.assets + '**/*.{js,jsx}')
      .pipe($.plumber({errorHandler: errorAlert}))
      .pipe($.eslint())
      .pipe($.eslint.format());
  });

};
