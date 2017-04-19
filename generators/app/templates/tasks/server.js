import gulp from 'gulp';
import webpack from 'webpack';
import yargs from 'yargs';
import config from '../gulp_config.json';
import webpackSettings from '../webpack.dev.config';
import browserSync from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { img } from './images';
import { styles } from './styles';
import { scripts } from './scripts';
import { icons } from './icons';

const bundler = webpack(webpackSettings);

/**
 * Hot css injection
 */
const inject = () => {
  return gulp.src([`${config.metalsmith.dist}/build/**/*.css`])
    .pipe(browserSync.stream({match: '**/*.css'}));
};

/**
 * Reload
 */
const reload = (done) => {
  browserSync.reload();
  done();
};

/**
 * useless task
 */
const inprod = done => done();

/**
 * Serve
 */
export const serve = () => {
  browserSync({
    server: {
      baseDir: [config.app.basedir],
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: webpackSettings.output.publicPath,
          stats: {
            cached: false,
            colors: true,
          }
        }),
        webpackHotMiddleware(bundler)
      ]
    },
    notify: {
      styles: {
        padding: "5px",
        fontSize: "0.7em",
        top: 'auto',
        bottom: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: "5px",
        backgroundColor: "#ef2678",
      }
    },
    open: false
  });

  gulp.watch([
    `${config.assets}sass/**/*.scss`
  ], gulp.series(
    styles,
    yargs.argv.production ? inprod : require('./metalsmith').metalsmithAssets,
    inject));

  gulp.watch([
    `${config.assets}sass/styleguide.scss`,
    `${config.assets}sass/styleguide-variables.scss`
  ], gulp.series(
    yargs.argv.production ? inprod : require('./metalsmith').metalsmithStyles,
    inject
  ));

  gulp.watch([
    `${config.assets}img/**/*`,
    `${config.assets}svg/**/*`
  ], gulp.series(
    img,
    yargs.argv.production ? inprod : require('./metalsmith').metalsmith,
    reload
  ));

  gulp.watch([
    `${config.assets}icons/**/*`
  ], gulp.series(
    icons,
    yargs.argv.production ? inprod : require('./metalsmith').metalsmith,
    reload
  ));

  gulp.watch([
    `${config.assets}js/**/*.js`
  ], gulp.series(scripts));

  gulp.watch([
    `${config.assets}components/**/*.{html,hbs,md,swig}`,
    `${config.assets}templates/**/*.{html,hbs,md,swig}`,
    `${config.assets}docs/**/*.md`,
    `${config.assets}data/**/*.{json,yml}`
  ], gulp.series(
    yargs.argv.production ? inprod : require('./metalsmith').metalsmithDocs,
    reload
  ));
};
