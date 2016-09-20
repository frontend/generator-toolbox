import gulp from 'gulp';
import imgur from 'imgur';
import del from 'del';
import fs from 'fs';
import testConfig from '../tests/regression/regression.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

export const testRegressionReferences = gulp.task('test:regression:references', () => {
  return gulp.src('tests/regression/references.js')
    .pipe($.casperjs({command:''}))
    .on('error', function(data) {
      $.util.log('Error', data.message);
    });
});

export const testRegressionTemporary = () => {
  return gulp.src('tests/regression/temporary.js')
    .pipe($.casperjs({command:''}))
    .on('error', function(data) {
      $.util.log('Error', data.message);
    });
};

export const testRegressionComparison = () => {
  return gulp.src('tests/regression/comparison.js')
    .pipe($.phantomcss({
      colorizerType: 'Dummy'
    }));
};

export const testRegressionClean = del.bind(null, [
  testConfig.tempPath,
  testConfig.comparisonPath
]);

export const testRegressionUpload = () => {
  fs.readdir(testConfig.comparisonPath, function(err,files){
    if (typeof files !== 'undefined' && files.length > 0) {
      $.util.log($.util.colors.bgRed($.util.colors.white('\n CHECK FAILED : ')));
      files.forEach(function(file){
        imgur.uploadFile(testConfig.comparisonPath + file)
          .then(function (json) {
            $.util.log($.util.colors.red(file) + $.util.colors.cyan(' -> ') + json.data.link);

          })
          .catch(function (err) {
            console.error(err.message);
          });
      });
    }
  });
};

export const testRegression = gulp.series(testRegressionClean, testRegressionTemporary, testRegressionComparison, testRegressionUpload);
export const testRegressionTasks = gulp.task('test:regression', testRegression);
