'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    argv          = require('yargs').argv,
    swig          = require('swig');

var path          = require('path'),
    dotenv        = require('dotenv'),
    markdown      = require('metalsmith-markdown'),
    permalinks    = require('metalsmith-permalinks'),
    layouts       = require('metalsmith-layouts'),
    define        = require('metalsmith-define'),
    contentful    = require('contentful-metalsmith'),
    collections   = require('metalsmith-collections');

var metadatas = [];
dotenv.load();
require('./filters.js')();

var contentful_key = '';
if (process.env.CONTENTFUL_KEY) {
  contentful_key = process.env.CONTENTFUL_KEY;
}

module.exports = function() {

  function errorAlert(error){
    if (!argv.production) {
      $.notify.onError({title: 'Metalsmith Error', message: 'Check your terminal', sound: 'Sosumi'})(error);
      $.util.log(error);
    }
    this.emit('end');
  };

  /*
  * Generate styleguide doc
  */
  gulp.task('metalsmith-docs', function() {
    return gulp.src([
      config.assets + 'components/**/*.swig',
      config.assets + 'docs/**/*.md',
      config.assets + 'data/**/*.json'
    ])
      .pipe($.plumber({errorHandler: errorAlert}))
      .pipe($.metalsmith({
        use: [
          markdown({ langPrefix: 'language-' }),
          collections(config.metalsmith.plugins.collections),
          function(files, metalsmith, done){
            for (var file in files) {
              if (files[file].collection == 'atoms' || files[file].collection == 'molecules' || files[file].collection == 'organisms') {
                delete files[file];
              }
              if (path.extname(file) === '.json') {
                var key = path.basename(file, '.json');
                metadatas[key] = JSON.parse(files[file].contents.toString());
                delete files[file];
              }
            }
            done();
          },
          define({
            data: metadatas
          }),
          contentful({
            accessToken : contentful_key
          }),
          layouts(config.metalsmith.plugins.layouts),
          permalinks(config.metalsmith.plugins.permalinks)
        ]
      }))
      .pipe(gulp.dest(config.metalsmith.dist));
  });

  /*
  * Styleguide CSS Vendors
  */
  gulp.task('metalsmith-styles', function () {
    return gulp.src(config.assets + 'sass/styleguide.scss')
      .pipe($.sass({
        errLogToConsole: true
      }))
      .pipe($.postcss([
        require('autoprefixer')({
          browsers: config.browsers,
          options: {
            map: true
          }
        })
      ]))
      .pipe($.concat('styleguide.css'))
      .pipe($.size({title: 'STYLEGUIDE CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'css'))
      .pipe(gulp.dest(config.metalsmith.dist + '/build/css'));
  });

  /*
  * Styleguide JS Vendors
  */
  gulp.task('metalsmith-scripts', function() {
    return gulp.src(config.metalsmith.assets + 'scripts/fabricator.js')
      .pipe($.browserify({
        insertGlobals : true
      }))
      .pipe($.concat('styleguide.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: 'STYLEGUIDE JS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'))
      .pipe(gulp.dest(config.metalsmith.dist + '/build/js'));
  });

  gulp.task('metalsmith-assets', function() {
    return gulp.src(config.build + '**/*')
      .pipe(gulp.dest(config.metalsmith.dist + '/build'));
  });

  /*
  * Build metalsmith
  */
  gulp.task('metalsmith', ['metalsmith-assets'], function() {
    return gulp.start('metalsmith-docs');
  });

};
