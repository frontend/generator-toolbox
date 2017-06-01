import gulp from 'gulp';
import del from 'del';
import merge from 'merge-stream';

import config from './toolbox.json';
import { styles, stylesLint } from './tasks/styles';
import { scripts, scriptsLint } from './tasks/scripts';
import vendors from './tasks/vendors';
import single from './tasks/single';
import icons from './tasks/icons';

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => del([config.dest]);
gulp.task('clean', clean);

/**
 * Config
 */
const copyPaths = [{
  src: `${config.src}images/**/*`,
  dest: `${config.dest}/images`,
}, {
  src: `${config.src}svg/**/*.svg`,
  dest: `${config.dest}/svg`,
}, {
  src: `${config.src}favicons/**/*`,
  dest: `${config.dest}/favicons`,
}, {
  src: `${config.src}fonts/**/*`,
  dest: `${config.dest}/fonts`,
}];

/**
 * Copy stuff
 */
const copyAssets = () => {
  return merge(copyPaths.map((item) => {
    return gulp.src(item.src)
      .pipe(gulp.dest(item.dest));
  }));
};
gulp.task('copy-assets', copyAssets);

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
    copyAssets,
    vendors,
    single,
    icons,
  ),
);
gulp.task('build', build);

gulp.task('styles', gulp.parallel(styles, stylesLint));
gulp.task('scripts', gulp.parallel(scripts, scriptsLint));
gulp.task('vendors', vendors);
gulp.task('icons', icons);
gulp.task('single', gulp.series(single));
gulp.task('default', build);
