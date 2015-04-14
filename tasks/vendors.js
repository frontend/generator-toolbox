module.exports = function(gulp, $, config) {

 /*
  * Build vendors dependencies
  */
  gulp.task('vendors', function() {
    return gulp.start('css-vendors', 'js-vendors', 'fonts', 'polyfills');
  });

 /*
  * CSS Vendors
  */
  gulp.task('css-vendors', function() {
    return gulp.src(config.vendors.css)
      .pipe($.concat('vendors.min.css'))
      .pipe($.minifyCss())
      .pipe($.size({title: "CSS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build.path + 'css'));
  });

 /*
  * JS Vendors
  */
  gulp.task('js-vendors', function() {
    return gulp.src(config.vendors.js)
      .pipe($.concat('vendors.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: "JS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build.path + 'js'));
  });

 /*
  * Fonts Sources
  */
  gulp.task('fonts', function() {
    return gulp.src(config.vendors.fonts)
      .pipe($.size({title: "FONTS"}))
      .pipe(gulp.dest(config.build.path + 'fonts'));
  });

 /*
  * Polyfills Sources
  */
  gulp.task('polyfills', function() {
    return gulp.src(config.vendors.polyfills)
      .pipe($.concat('polyfills.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: "POLYFILLS", showFiles: true}))
      .pipe(gulp.dest(config.build.path + 'js'));
  });

}