import gulp from 'gulp';
import del from 'del';

import config from './gulp_config.json';
import { styles, stylesLint } from './tasks/styles';
import { scripts, scriptsLint } from './tasks/scripts';

/**
 * Config
 */
const src = {
  img: `${config.src}img/**/*`,
  svg: `${config.src}svg/**/*.svg`,
  mainScss: `${config.src}/sass/main.s+(a|c)ss`,
  scss: `${config.src}sass/**/*.s+(a|c)ss`,
  scripts: `${config.src}js/**/*.js`,
};

const dest = {
  img: `${config.dest}/img`,
  svg: `${config.dest}/svg`,
  styles: `${config.dest}/css`,
  scripts: `${config.dest}/js`,
};

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => del([config.dest]);

/**
 * Copy images
 *
 * Images are simply copied over to the build directory. Ensure they are already
 * optimized for the web.
 */
const images = () => {
  return gulp.src(src.img)
    .pipe(gulp.dest(dest.img));
};

/**
 * Copy SVG
 *
 * SVG are simply copied over to the build directory. Ensure they are already
 * optimized for the web.
 */
const svg = () => {
  return gulp.src(src.svg)
    .pipe(gulp.dest(dest.svg));
};

/**
 * Watch changes
 *
 * Will watch your files and rebuild everything on the fly.
 */
const watch = () => {
  // Watch CSS changes
  gulp.watch(src.scss, gulp.parallel(stylesLint, styles));
  // Watch images changes
  gulp.watch(src.img, gulp.parallel(images));
};

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
    images,
    svg,
  ),
);
gulp.task('build', build);

const watchTask = gulp.series('build', watch);
gulp.task('watch', watchTask);

gulp.task('default', build);
