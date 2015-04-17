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
    gulp.watch([config.assets + 'sass/**/*.scss'], function() {
      runSequence('styles'<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide'<% } %>, reload);
    });<% if (props.tools.indexOf("Fabricator") > -1) { %>
    gulp.watch([config.assets + 'sass/styleguide.scss'], function() {
      runSequence('styleguide-styles'<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide'<% } %>, reload);
    });<% } %>
    gulp.watch([config.assets + 'img/**/*'], function() {
      runSequence('img'<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide'<% } %>, reload);
    });
    gulp.watch([config.assets + 'js/**/*.js'], function() {
      runSequence('scripts'<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide'<% } %>, reload);
    });<% if (props.tools.indexOf("Fabricator") > -1) { %>
    gulp.watch([
      config.assets + 'components/**/*.html',
      config.assets + 'templates/**/*.html',
      config.assets + 'docs/**/*.md',
      config.assets + 'data/**/*.{json,yml}'
    ], function() {
      runSequence('styleguide', reload);
    });<% } %>
  });

}