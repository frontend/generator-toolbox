'use strict';
/**
 * Import plugins
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('./gulp_config.json'),
    assemble      = require('fabricator-assemble'),
    browserSync   = require('browser-sync'),
    runSequence   = require('run-sequence'),
    argv          = require('yargs').argv,
    del           = require('del');


require(config.tasks.path + 'vendors')(gulp, $, config);
require(config.tasks.path + 'images')(gulp, $, config);
require(config.tasks.path + 'sass')(gulp, $, config);
require(config.tasks.path + 'clean')(gulp, $, config, del);
require(config.tasks.path + 'server')(gulp, $, config, browserSync, runSequence);


/**
 * Task to build assets on production server
 */
gulp.task('build',['clean'], function() {
  argv.production = true;
  return gulp.start('vendors', 'styles', 'img', 'scripts');
});


/**
 * Default task
 */
gulp.task('default', ['clean', 'vendors', 'img', 'styles', 'scripts']);