import gulp from 'gulp';
import config from '../gulp_config.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

/*
* CSS Vendors
*/
export const cssVendors = (done) => {
  if (config.vendors.css.length > 0) {
    return gulp.src(config.vendors.css)
      .pipe($.concat('vendors.min.css'))
      .pipe($.cleanCss())
      .pipe($.size({title: 'CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(`${config.build}css`));
  } else {
    return done();
  }
};

/*
* JS Vendors
*/
export const jsVendors = () => {
  return gulp.src(config.vendors.js)
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'JS VENDORS', showFiles: true}))
    .pipe(gulp.dest(`${config.build}js`));
};

/*
* Fonts Sources
*/
export const fontsVendors = () => {
  return gulp.src(config.vendors.fonts)
    .pipe($.size({title: 'FONTS'}))
    .pipe(gulp.dest(`${config.build}fonts`));
};

/*
* Polyfills Sources
*/
export const polyfillsVendors = () => {
  return gulp.src(config.vendors.polyfills)
    .pipe($.concat('polyfills.min.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'POLYFILLS', showFiles: true}))
    .pipe(gulp.dest(`${config.build}js`));
};

/*
* Build vendors dependencies
*/
export const vendors = gulp.series(cssVendors, jsVendors, fontsVendors, polyfillsVendors);
export const vendorsTask = gulp.task('vendors', vendors);
