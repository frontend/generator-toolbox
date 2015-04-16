module.exports = function(gulp, $, config) {

 /*
  * Build vendors dependencies
  */
  gulp.task('vendors', function() {
    return gulp.start('css-vendors', 'js-vendors', 'fonts', 'polyfills', 'styleguide-styles', 'styleguide-scripts');
  });

 /*
  * CSS Vendors
  */
  gulp.task('css-vendors', function() {
    return gulp.src(config.vendors.css)
      .pipe($.concat('vendors.min.css'))
      .pipe($.minifyCss())
      .pipe($.size({title: "CSS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build + 'css'));
  });

 /*
  * JS Vendors
  */
  gulp.task('js-vendors', function() {
    return gulp.src(config.vendors.js)
      .pipe($.concat('vendors.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: "JS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

 /*
  * Fonts Sources
  */
  gulp.task('fonts', function() {
    return gulp.src(config.vendors.fonts)
      .pipe($.size({title: "FONTS"}))
      .pipe(gulp.dest(config.build + 'fonts'));
  });

 /*
  * Polyfills Sources
  */
  gulp.task('polyfills', function() {
    return gulp.src(config.vendors.polyfills)
      .pipe($.concat('polyfills.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: "POLYFILLS", showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });

  /*
  * Styleguide CSS Vendors
  */
  gulp.task('styleguide-styles', function () {
    return gulp.src(config.styleguide.assets + 'styles/fabricator.scss')
      .pipe($.sass({
        errLogToConsole: true
      }))
      .pipe($.postcss([
        require('autoprefixer-core')({
          browsers: config.browsers,
          options: {
            map: true
          }
        })
      ]))
      .pipe($.rename('styleguide.css'))
      .pipe($.size({title: "STYLEGUIDE CSS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build + 'css'));
  });

  /*
  * Styleguide JS Vendors
  */
  gulp.task('styleguide-scripts', function() {
    return gulp.src([config.styleguide.assets + 'scripts/fabricator.js'])
      .pipe($.browserify({
        insertGlobals : true
      }))
      .pipe($.concat('styleguide.min.js'))
      .pipe($.uglify())
      .pipe($.size({title: "STYLEGUIDE JS VENDORS", showFiles: true}))
      .pipe(gulp.dest(config.build + 'js'));
  });


}