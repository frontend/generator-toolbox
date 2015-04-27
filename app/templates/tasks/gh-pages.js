'use strict';

module.exports = function(gulp, $, config) {

 /**
  * Deploy to GH pages
  */
  gulp.task('deploy', function () {
    return gulp.src(config.app.ghpages + '/**/*')
      .pipe($.ghPages());
  });

};
