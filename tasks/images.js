module.exports = function(gulp, $, config) {

 /**
  * Copy images
  */
  gulp.task('img', function() {
    return gulp.src(config.images)
      .pipe($.size({title: "IMAGES"}))
      .pipe(gulp.dest(config.app.buildpath + 'img'));
  });

}