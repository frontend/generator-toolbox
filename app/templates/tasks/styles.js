import gulp from 'gulp';
import yargs from 'yargs';
import autoprefixer from 'autoprefixer';
// required -> import stylelint from 'stylelint';
import reporter from 'postcss-reporter';
import config from '../gulp_config.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

function errorAlert(error) {
  if (!yargs.argv.production) {
    $.notify.onError({ title: 'SCSS Error', message: 'Check your terminal', sound: 'Sosumi', })(error);
    $.util.log(error.messageFormatted ? error.messageFormatted : error.message);
  }
  this.emit('end');
}

/**
 * Build styles from SCSS files
 * With error reporting on compiling (so that there's no crash)
 */
export const stylesBuild = () => {
  if (yargs.argv.production) { $.util.log('[styles] Production mode'); } else { $.util.log('[styles] Dev mode'); }

  return gulp.src([`${config.assets}sass/main.scss`])
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe(yargs.argv.production ? $.util.noop() : $.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compressed',
      precision: 5,
      includePaths: ['.'],
    }))
    .pipe($.postcss([
      autoprefixer({
        browsers: config.browsers,
        options: {
          map: true,
        }
      })
    ]))
    .pipe(yargs.argv.production ? $.util.noop() : $.sourcemaps.write())
    .pipe(yargs.argv.production ? $.cleanCss() : $.util.noop())
    .pipe($.concat('main.css'))
    .pipe($.size({ title: 'STYLES', showFiles: true }))
    .pipe(gulp.dest(`${config.build}/css`));
};

export const stylesLint = () => {
  return gulp.src([`${config.assets}sass/**/*.s+(a|c)ss`])
      .pipe($.plumber({ errorHandler: errorAlert }))
      .pipe($.postcss(
        [
          require('stylelint')(),
          reporter({
            clearMessages: true,
            throwError: yargs.argv.production
          })
        ],
        {
          syntax: require('postcss-scss')
        }));
};
export const stylesLintTask = gulp.task('styles:lint', stylesLint);

export const styles = gulp.series(stylesLint, stylesBuild);
export const stylesTask = gulp.task('styles', styles);
