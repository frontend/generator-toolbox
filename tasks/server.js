module.exports = function(gulp, $, config, browserSync, runSequence) {

  var reload = browserSync.reload;

 /**
  * Serve
  */
  gulp.task('serve', ['default'], function () {
    browserSync({
      server: {
        baseDir: [config.app.basedir],
      },
      open: false
    });
    gulp.watch([config.assets.path + 'sass/**/*.scss'], function() {
      runSequence('styles', reload);
    });
    gulp.watch([config.assets.path + 'img/**/*'], function() {
      runSequence('img', reload);
    });
    gulp.watch([config.assets.path + 'js/**/*.js'], function() {
      runSequence('scripts', reload);
    });
  });

}