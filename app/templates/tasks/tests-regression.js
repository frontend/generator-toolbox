'use strict';

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('../gulp_config.json'),
    imgur         = require('imgur'),
    del           = require('del'),
    fs            = require('fs'),
    runSequence   = require('run-sequence'),
    testConfig    = require('../tests/regression/regression.json');

module.exports = function() {

  gulp.task('test:regression:references', function () {
    return gulp.src('tests/regression/references.js')
      .pipe($.casperjs({command:''}))
      .on('error', function(data) {
        $.util.log('Error', data.message);
      });
  });

  gulp.task('test:regression:temporary', function () {
    return gulp.src('tests/regression/temporary.js')
      .pipe($.casperjs({command:''}))
      .on('error', function(data) {
        $.util.log('Error', data.message);
      });
  });

  gulp.task('test:regression:comparison', function (){
    return gulp.src('tests/regression/comparison.js')
      .pipe($.phantomcss({
        colorizerType: 'Dummy'
      }));
  });

  gulp.task('test:regression:clean', del.bind(null, [
    testConfig.tempPath,
    testConfig.comparisonPath
  ]));

  gulp.task('test:regression:upload', function (){
    fs.readdir(testConfig.comparisonPath, function(err,files){
      if (typeof files !== 'undefined' && files.length > 0) {
        $.util.log($.util.colors.bgRed($.util.colors.white("\n CHECK FAILED : ")));
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
  });

  gulp.task('test:regression', function (){
    runSequence('test:regression:clean', 'test:regression:temporary', 'test:regression:comparison', 'test:regression:upload');
  });

};
