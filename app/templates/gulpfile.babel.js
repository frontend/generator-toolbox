/**
 * Import plugins
 */
import gulp from 'gulp';
import config from './gulp_config.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

import { vendors, vendorsTask } from './tasks/vendors';
import { img, imgTask } from './tasks/images';
import { styles, stylesTask } from './tasks/styles';
import { scripts, scriptsTask } from './tasks/scripts';
import { icons, iconsTask } from './tasks/icons';
import { favicons, faviconsTask } from './tasks/favicons';
import { clean, cleanTask } from './tasks/clean';
import { metalsmith, metalsmithTask } from './tasks/metalsmith';
import { deploy, deployTask } from './tasks/deploy';
import { testRegression, testRegressionTask } from './tasks/tests-regression';
import { testUnit, testUnitTask } from './tasks/tests-unit';
import { testNavigation, testNavigationTask } from './tasks/tests-navigation';
import { serve } from './tasks/server';

/**
* Task to build assets on production server
*/
const build = gulp.series(clean, vendors, styles, scripts, img, icons);
gulp.task('build', build);

/**
 * Init project
 */
gulp.task('init', function() {
  return gulp.src('node_modules/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss')
    .pipe($.rename('bootstrap-variables.scss'))
    .pipe(gulp.dest(`${config.assets}sass/`));
});

/**
 * Default task
 */
export const defaultFunc = gulp.series(build, favicons, metalsmith);
gulp.task('default', defaultFunc);

/**
 * Serve task
 */
export const serveTask = gulp.task('serve', gulp.series(serve));
