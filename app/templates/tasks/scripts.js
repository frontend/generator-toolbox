'use strict';

module.exports = function(gulp, $, config) {

  /**
   * Build JS
   * With error reporting on compiling (so that there's no crash)
   * And jshint check to highlight errors as we go.
   */
  gulp.task('scripts', function() {
    return gulp.src(config.assets + 'js/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.concat('main.js'))
      .pipe(gulp.dest(config.build + 'js'))
      .pipe($.rename({ suffix: '.min' }))
      .pipe($.uglify())
      .pipe($.size({title: 'JS SCRIPTS', showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

};
