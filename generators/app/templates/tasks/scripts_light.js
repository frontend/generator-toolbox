import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../toolbox.json';
import errorAlert from './helpers';

const $ = gulpLoadPlugins();

/**
 * Config
 */
const src = {
  base: `${config.src}components/base.js`,
  scripts: `${config.src}components/**/*.js`,
};

const dest = {
  scripts: `${config.dest}/js`,
};

/**
 * Scripts
 */
export const scripts = () => {
  return gulp.src(src.base)
    .pipe($.sourcemaps.init())
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.babel())
    .pipe($.concat('bundle.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.scripts));
};

export const scriptsLint = () => {
  return gulp.src(src.scripts)
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.eslint())
    .pipe($.eslint.format());
};

export default scripts;
