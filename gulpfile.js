'use strict';
/**
 * Import plugins
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('./gulp_config.json'),
    assemble      = require('fabricator-assemble'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    runSequence   = require('run-sequence'),
    argv          = require('yargs').argv,
    del           = require('del');


require('./tasks/vendors')(gulp, $, config);