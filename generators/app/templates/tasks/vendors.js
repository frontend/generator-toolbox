import gulp from 'gulp';
import config from '../toolbox.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

/*
* CSS Vendors
*/
const cssVendors = (done) => {
  if (config.vendors.css.length > 0) {
    return gulp.src(config.vendors.css)
      .pipe($.concat('vendors.min.css'))
      .pipe($.cssnano())
      .pipe($.size({title: 'CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(`${config.dest}css`));
  }
  return done();
};

/*
* JS Vendors
*/
const jsVendors = (done) => {
  if (config.vendors.js.length > 0) {
    return gulp.src(config.vendors.js)
      .pipe($.concat('vendors.min.js'))
      .pipe($.size({title: 'JS VENDORS', showFiles: true}))
      .pipe(gulp.dest(`${config.dest}js`));
  }
  return done();
};

/*
* Fonts Sources
*/
const fontsVendors = () => {
  return gulp.src(config.fonts)
    .pipe($.size({title: 'FONTS'}))
    .pipe(gulp.dest(`${config.dest}fonts`));
};

const vendors = gulp.parallel(cssVendors, jsVendors, fontsVendors);

export default vendors;
