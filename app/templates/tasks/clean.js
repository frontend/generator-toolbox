module.exports = function(gulp, $, config, del) {

 /**
  * Clean output directories
  */
  gulp.task('clean', del.bind(null, [
    config.build.substr(0, config.build.length - 1),
    config.styleguide.dest
  ]));

}