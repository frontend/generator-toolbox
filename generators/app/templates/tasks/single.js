import gulp from 'gulp';
import config from '../toolbox.json';
import merge from 'merge-stream';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

/**
 * Deploy to GH pages
 */
const single = (done) => {
  // Return if singles are empty
  if (!config.singles || !config.singles[Object.keys(config.singles)[0]].src) return done();

  return merge(config.singles.map((item) => {
    return gulp.src(item.src)
      .pipe(gulp.dest(item.dest));
  }));
};

export default single;
