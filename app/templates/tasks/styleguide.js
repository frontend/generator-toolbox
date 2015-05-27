'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    assemble      = require('fabricator-assemble');


module.exports = function() {

  var options = {
    layout: config.styleguide.layout,
    layouts: config.styleguide.layouts,
    layoutIncludes: config.styleguide.layoutIncludes,
    views: config.styleguide.views,
    materials: config.styleguide.materials,
    data: config.styleguide.data,
    docs: config.styleguide.docs,
    dest: config.styleguide.dest,
    beautifier: {
      indent_size: 1,
      indent_char: '  ',
      indent_with_tabs: true
    },
    helpers: {
        markdown: require('helper-markdown')
    }
  };

  /*
  * Styleguide CSS Vendors
  */
  gulp.task('styleguide-styles', function () {
    return gulp.src([
        config.styleguide.assets + 'styles/fabricator.scss',
        config.assets + 'sass/styleguide.scss'
      ])
      .pipe($.sass({
        errLogToConsole: true
      }))
      .pipe($.postcss([
        require('autoprefixer-core')({
          browsers: config.browsers,
          options: {
            map: true
          }
        })
      ]))
      .pipe($.concat('styleguide.css'))
      .pipe($.size({title: 'STYLEGUIDE CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'css'))
      .pipe(gulp.dest(config.styleguide.dest + '/build/css'));
  });

  /*
  * Styleguide JS Vendors
  */
  gulp.task('styleguide-scripts', function() {
    return gulp.src([config.styleguide.assets + 'scripts/fabricator.js'])
      .pipe($.browserify({
        insertGlobals : true
      }))
      .pipe($.concat('styleguide.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: 'STYLEGUIDE JS VENDORS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'))
      .pipe(gulp.dest(config.styleguide.dest + '/build/js'));
  });

  gulp.task('styleguide-assets', function() {
    return gulp.src(config.build + '**/*')
      .pipe(gulp.dest(config.styleguide.dest + '/build'));
  });

  gulp.task('styleguide', ['styleguide-assets'], function (done) {
    assemble(options);
    done();
  });


};
