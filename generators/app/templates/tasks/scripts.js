import gulp from 'gulp';
import webpack from 'webpack';
import config from '../gulp_config.json';
import webpackSettings from '../webpack.prod.config';
import yargs from 'yargs';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

function errorAlert(error){
  if (!yargs.argv.production) {
    $.notify.onError({title: 'JS Error', message: 'Check your terminal', sound: 'Sosumi'})(error);
    $.util.log(error.messageFormatted);
  }
  this.emit('end');
}

/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 * And jshint check to highlight errors as we go.
 */
export const scriptsBuild = (done) => {
  // run webpack
  if (yargs.argv.production || yargs.argv.ghpages) {
    webpack(webpackSettings, function(err, stats) {
      if(err) throw new $.util.PluginError('webpack', err);
      $.util.log('[webpack]', stats.toString({
        cached: false,
        colors: true,
      }));
      done();
    });
  } else { done(); }
};

export const scriptsLint = () => {
  return gulp.src(`${config.assets}js/index.js`)
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.eslint())
    .pipe($.eslint.format());
};

export const scripts = gulp.series(scriptsLint, scriptsBuild);
export const scriptsTask = gulp.task('scripts', scripts);
