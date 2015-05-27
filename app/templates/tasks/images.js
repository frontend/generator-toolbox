'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json');

module.exports = function() {

  var pngquant = require('imagemin-pngquant');

 /**
  * Copy images
  */
  gulp.task('img-optim', function() {
    return gulp.src(config.images)
      .pipe($.imagemin({
        progressive: true,
        use: [pngquant()]
      }))
      .pipe($.size({title: 'IMAGES'}))
      .pipe(gulp.dest(config.build + 'img'));
  });

  /**
   * Copy svg
   */
   gulp.task('svg-optim', function() {
     return gulp.src(config.svg)
       .pipe($.imagemin({
        svgoPlugins: [{
          cleanupIDs: false // we usually need them
        }]
       }))
       .pipe($.size({title: 'SVG'}))
       .pipe(gulp.dest(config.build + 'svg'));
   });

   gulp.task('img', ['img-optim', 'svg-optim']);

};
