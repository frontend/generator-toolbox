import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import yargs from 'yargs';
import config from './gulp_config.json';

const $ = gulpLoadPlugins();

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
  svg: `${config.src}svg/**/*.svg`,
  mainScss: `${config.src}/sass/main.s+(a|c)ss`,
  scss: `${config.src}sass/**/*.s+(a|c)ss`,
  scripts: `${config.src}js/**/*.js`,
};

const dest = {
  img: `${config.dest}/img`,
  svg: `${config.dest}/svg`,
  styles: `${config.dest}/css`,
  scripts: `${config.dest}/js`,
};

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => del([config.dest]);

/**
 * Copy images
 *
 * Images are simply copied over to the build directory. Ensure they are already
 * optimized for the web.
 */
const images = () => {
  return gulp.src(src.img)
    .pipe(gulp.dest(dest.img));
};

/**
 * Copy SVG
 *
 * SVG are simply copied over to the build directory. Ensure they are already
 * optimized for the web.
 */
const svg = () => {
  return gulp.src(src.svg)
    .pipe(gulp.dest(dest.svg));
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
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync().on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.styles));
};

const stylesLint = () => {
  return gulp.src(`${config.src}**/*.s+(a|c)ss`)
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.postcss(
      [
        require('stylelint')(),
        require('postcss-reporter')({
          clearReportedMessages: true,
        }),
      ],
      { syntax: require('postcss-scss') },
    ));
};

/**
 * Scripts
 */
const scripts = () => {
  return gulp.src(src.scripts)
  .pipe($.sourcemaps.init())
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.babel())
    .pipe($.concat('bundle.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.scripts));
};

const scriptsLint = () => {
  return gulp.src(src.scripts)
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.eslint())
    .pipe($.eslint.format());
};

/**
 * Watch changes
 *
 * Will watch your files and rebuild everything on the fly.
 */
const watchTask = () => {
  // Watch CSS changes
  gulp.watch(src.scss, gulp.parallel(stylesLint, styles));
  // Watch images changes
  gulp.watch(src.img, gulp.parallel(images));
};

/**
 * Gulp Tasks
 */
const build = gulp.series(
  clean,
  gulp.parallel(
    stylesLint,
    styles,
    scriptsLint,
    scripts,
    images,
    svg,
  ),
);
gulp.task('build', build);
const watch = gulp.series('build', watchTask);
gulp.task('watch', watch);
gulp.task('default', build);
