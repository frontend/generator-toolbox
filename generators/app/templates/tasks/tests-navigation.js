import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

export const testNavigation = gulp.task('test:navigation', () => {
  return gulp.src('tests/navigation/**/*.js')
    .pipe($.casperjs({command:'test'}))
    .on('error', function(data) {
      $.util.log('Error', data.message);
    });
});
