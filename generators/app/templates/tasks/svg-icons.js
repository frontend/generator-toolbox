import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../toolbox.json';
import errorAlert from './helpers';

const $ = gulpLoadPlugins();

const icons = () => {
  return gulp.src(`${config.src}icons/**/*.svg`)
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.rename({
      prefix: config.iconsFontName + '-'
    }))
    .pipe($.svgo())
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.cheerio(function ($) {
      $('svg').attr('style',  'display:none');
    }))
    .pipe(gulp.dest(`${config.dest}icons`));
};

export default icons;
