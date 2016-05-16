'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    argv          = require('yargs').argv,
    slug          = require('slug');

module.exports = function() {

  var iconFontName = slug(config.iconsFontName).toLowerCase();

  function errorAlert(error){
    if (!argv.production) {
      $.notify.onError({title: "SCSS Error", message: "Check your terminal", sound: "Sosumi"})(error);
      $.util.log(error.messageFormatted);
    }
    this.emit("end");
  };

  /**
   * Build styles from SCSS files
   * With error reporting on compiling (so that there's no crash)
   */
  gulp.task('styles', ['styles:lint'], function() {
    if (argv.production) { $.util.log('[styles] Production mode' ); }
    else { $.util.log('[styles] Dev mode'); }

    return gulp.src([config.assets + 'sass/' + iconFontName + '.scss', config.assets + 'sass/main.scss'])
      .pipe($.plumber({errorHandler: errorAlert}))
      .pipe(argv.production ? $.util.noop() : $.sourcemaps.init())
      .pipe($.sass({
        outputStyle: 'compressed',
        precision: 5,
        includePaths: ['.']
      }))
      .pipe($.postcss([
        require('autoprefixer')({
          browsers: config.browsers,
          options: {
            map: true
          }
        })
      ]))
      .pipe(argv.production ? $.util.noop() : $.sourcemaps.write())
      .pipe(argv.production ? $.cleanCss() : $.util.noop() )
      .pipe($.concat('main.css'))
      .pipe($.size({title: 'STYLES', showFiles: true}))
      .pipe(gulp.dest(config.build + '/css'));
  });

  gulp.task('styles:lint', function() {
    return gulp.src([config.assets + 'sass/**/*.s+(a|c)ss', '!' + config.assets + 'sass/+(bootstrap-variables|bootstrap|main|styleguide|styleguide-variables|main-variables|_mixins).scss', '!' + config.assets + 'sass/organisms/_photoswipes.scss'])
        .pipe($.plumber({errorHandler: errorAlert}))
        .pipe($.stylelint({
          reporters: [
            {formatter: 'string', console: true}
          ]
        }));
  });

};
