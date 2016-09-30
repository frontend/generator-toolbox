import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

function handleError() {this.emit('end');}

export const testUnit = () => {
  return gulp.src(['tests/unit/**/*.js'], {read: false})
    .pipe($.mocha({
      reporter: 'spec'
    }))
    .on('error', handleError);
};

export const testUnitTask = gulp.task('testUnit', testUnit);
