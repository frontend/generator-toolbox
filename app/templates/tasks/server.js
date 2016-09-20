import gulp from 'gulp';
import webpack from 'webpack';
import config from '../gulp_config.json';
import webpackSettings from '../webpack.dev.config';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { img } from './images';
import { styles } from './styles';
import { scripts } from './scripts';
import { icons } from './icons';
import { metalsmith, metalsmithStyles, metalsmithDocs, metalsmithAssets } from './metalsmith';

const bundler = webpack(webpackSettings);

/**
 * Hot css injection
 */
const inject = () => {
  return gulp.src([`${config.metalsmith.dist}/build/**/*.css`])
    .pipe(browserSync.stream({match: '**/*.css'}));
};

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
        webpackHotMiddleware(bundler),
        historyApiFallback()
      ]
    },
    open: false
  });

  gulp.watch([
    `${config.assets}sass/**/*.scss`
  ], gulp.series(styles, metalsmithAssets, inject));

  gulp.watch([
    `${config.assets}sass/styleguide.scss`,
    `${config.assets}sass/styleguide-variables.scss`
  ], gulp.series(metalsmithStyles, inject));

  gulp.watch([
    `${config.assets}img/**/*`,
    `${config.assets}svg/**/*`
  ], gulp.series(img, metalsmith, browserSync.reload));

  gulp.watch([
    `${config.assets}icons/**/*`
  ], gulp.series(icons, metalsmith, browserSync.reload));

  gulp.watch([
    `${config.assets}js/**/*.js`
  ], gulp.series(scripts));

  gulp.watch([
    `${config.assets}components/**/*.{html,hbs,md,swig}`,
    `${config.assets}templates/**/*.{html,hbs,md,swig}`,
    `${config.assets}docs/**/*.md`,
    `${config.assets}data/**/*.{json,yml}`
  ], gulp.series(metalsmithDocs, browserSync.reload));
};
