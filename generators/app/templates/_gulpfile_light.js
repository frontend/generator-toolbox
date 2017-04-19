'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const config = require('./gulp_config.json');
const yargs = require('yargs');

function errorAlert(error) {
  if (!yargs.argv.production) {
    $.notify.onError({ title: 'SCSS Error', message: 'Check your terminal', sound: 'Sosumi' })(error);
    $.util.log(error.messageFormatted ? error.messageFormatted : error.message);
  }
  this.emit('end');
}

/**
 * Config
 */
const src = {
  img: `${config.src}img/**/*`,
  mainScss: `${config.src}/sass/main.s+(a|c)ss`,
  scss: `${config.src}sass/**/*.s+(a|c)ss`,
};

const dest = {
  img: `${config.dest}/img`,
  styles: `${config.dest}/css`,
};

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => {
  return del([config.dest]);
};

/**
 * Copy images
 *
 * Images are simply copied over to the build directory. Ensure they are already
 * optimized for the web.
 */
const images = function() {
  return gulp.src(src.img)
    .pipe(gulp.dest());
};

/**
 * Styles
 *
 * Styles are built by pre-processing with Sass and generating sourcemaps.
 * - Autoprefixer is automatically run with PostCSS.See browserslist config
 *   in package.json.
 * - CSSNano minifies the output.
 */
const styles = () => {
  return gulp.src(src.mainScss)
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.postcss(
      [
        require('stylelint')(),
        require('postcss-reporter')({
          clearReportedMessages: true,
        })
      ],
      {syntax: require('postcss-scss')}
    ))
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.styles));
};

/**
 * Watch changes
 *
 * Will watch your files and rebuild everything on the fly.
 */
const watch = () => {
  // Watch CSS changes
  gulp.watch(src.scss, gulp.series(styles));

  // Watch images changes
  gulp.watch(src.img, gulp.series(images));
};

/**
 * Gulp Tasks
 */
gulp.task('build', gulp.series(clean, gulp.parallel(styles, images)));
gulp.task('watch', gulp.series('build', watch));
gulp.task('default', gulp.series('build'));
