import gulp from 'gulp';
import webpack from 'webpack';
import config from '../gulp_config.json';
import webpackSettings from '../webpack.dev.config';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import historyApiFallback from 'connect-history-api-fallback';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const bundler = webpack(webpackSettings);

const reload = browserSync.reload;

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

  // gulp.watch([`${config.assets}sass/**/*.scss`], function() {
  //   runSequence('styles', 'metalsmith', reload);
  // });
  // gulp.watch([`${config.assets}sass/styleguide.scss`, `${config.assets}sass/styleguide-variables.scss`], function() {
  //   runSequence('metalsmith-styles', 'metalsmith', reload);
  // });
  // gulp.watch([`${config.assets}img/**/*`, `${config.assets}svg/**/*`], function() {
  //   runSequence('img', 'metalsmith', reload);
  // });
  // gulp.watch([`${config.assets}icons/**/*`], function() {
  //   runSequence('icons', 'metalsmith', reload);
  // });
  // gulp.watch([`${config.assets}js/**/*.js`], function() {
  //   runSequence('scripts', 'metalsmith', reload);
  // });
  // gulp.watch([
  //   `${config.assets}components/**/*.{html,hbs,md,swig}`,
  //   `${config.assets}templates/**/*.{html,hbs,md,swig}`,
  //   `${config.assets}docs/**/*.md`,
  //   `${config.assets}data/**/*.{json,yml}`
  // ], function() {
  //   runSequence('metalsmith-docs', reload);
  // });
};
