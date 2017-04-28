import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../gulp_config.json';
import errorAlert from './helpers';

const $ = gulpLoadPlugins();

/**
 * Config
 */
const src = {
  mainScss: `${config.src}/sass/main.s+(a|c)ss`,
  scss: `${config.src}sass/**/*.s+(a|c)ss`,
};

const dest = {
  styles: `${config.dest}/css`,
};

/**
 * Styles
 *
 * Styles are built by pre-processing with Sass and generating sourcemaps.
 * - Autoprefixer is automatically run with PostCSS.See browserslist config
 *   in package.json.
 * - CSSNano minifies the output.
 */
export const styles = () => {
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

export const stylesLint = () => {
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

export default styles;
