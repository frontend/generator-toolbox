module.exports = function(gulp, $, config, del) {

 /**
  * Clean output directories
  */
  gulp.task('clean', del.bind(null, [
    config.build.path.substr(0, config.build.path.length - 1)
  ]));

}