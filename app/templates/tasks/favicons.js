import gulp from 'gulp';
import config from '../gulp_config.json';

/**
 * Copy favicons in styleguide folder
 */
export const favicons = () => {
  return gulp.src(`${config.assets}favicons/*`)
    .pipe(gulp.dest(config.metalsmith.dist));
};

export const faviconsTask = gulp.task('favicons', favicons);
