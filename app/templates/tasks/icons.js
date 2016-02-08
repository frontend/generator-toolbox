'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    slug          = require('slug');

module.exports = function() {

  var name = slug(config.iconsFontName).toLowerCase();

 /*
  * Build icons font and stylesheets
  */
  gulp.task('icons', function(){
    gulp.src(config.assets + 'icons/**/*.svg')
      .pipe($.iconfont({
        fontName: name,
        appendCodepoints: true,
        normalize:true,
        fontHeight: 1001
      }))
      .on('glyphs', function(glyphs, options) {
        gulp.src('node_modules/toolbox-utils/templates/_icons.scss')
          .pipe($.consolidate('lodash', {
            glyphs: glyphs.map(function(glyph) {
              return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
            }),
            fontName: name,
            fontPath: '../fonts/',
            className: name
          }))
          .pipe($.rename(name + '.scss'))
          .pipe(gulp.dest(config.assets + 'sass/'));
      })
      .pipe(gulp.dest(config.build + 'fonts'));
  });

};
