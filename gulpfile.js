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


require(config.tasks + 'vendors')(gulp, $, config);
require(config.tasks + 'images')(gulp, $, config);
require(config.tasks + 'styles')(gulp, $, config, argv);
require(config.tasks + 'scripts')(gulp, $, config);
require(config.tasks + 'clean')(gulp, $, config, del);
require(config.tasks + 'styleguide')(gulp, $, config, assemble);
require(config.tasks + 'server')(gulp, $, config, browserSync, runSequence);


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
gulp.task('default', ['clean'], function(done){
  runSequence(['css-vendors', 'js-vendors', 'fonts', 'polyfills', 'styleguide-styles', 'styleguide-scripts', 'img', 'styles', 'scripts'], 'styleguide', done);
});