import gulp from 'gulp';
import pngquant from 'imagemin-pngquant';
import config from '../gulp_config.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();


/**
 * Copy images
 */
export const imgOptim = () => {
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe($.size({title: 'IMAGES'}))
    .pipe(gulp.dest(`${config.build}img`));
};

/**
 * Copy svg
 */
export const svgOptim = () => {
  return gulp.src(config.svg)
    .pipe($.imagemin({
      svgoPlugins: [{
        cleanupIDs: false // we usually need them
      }]
    }))
    .pipe($.size({title: 'SVG'}))
    .pipe(gulp.dest(`${config.build}svg`));
};

export const img = gulp.parallel(imgOptim, svgOptim);
export const imgTask = gulp.task('img', img);
