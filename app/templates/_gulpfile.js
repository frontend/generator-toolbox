'use strict';
/**
 * Import plugins
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('./gulp_config.json'),<% if (props.tools.indexOf("Fabricator") > -1) { %>
    assemble      = require('fabricator-assemble'),<% } %>
    browserSync   = require('browser-sync'),
    runSequence   = require('run-sequence'),
    argv          = require('yargs').argv,
    del           = require('del');


require(config.tasks + 'vendors')(gulp, $, config);                            // $ gulp vendors
require(config.tasks + 'images')(gulp, $, config);                             // $ gulp img
require(config.tasks + 'styles')(gulp, $, config, argv);                       // $ gulp styles
require(config.tasks + 'scripts')(gulp, $, config);                            // $ gulp scripts
require(config.tasks + 'clean')(gulp, $, config, del);                         // $ gulp clean<% if (props.tools.indexOf("Fabricator") > -1) { %>
require(config.tasks + 'styleguide')(gulp, $, config, assemble);               // $ gulp styleguide<% } %>
require(config.tasks + 'server')(gulp, $, config, browserSync, runSequence);   // $ gulp serve


/**
 * Task to build assets on production server
 */
gulp.task('build',['clean'], function() {
  return gulp.start('vendors', 'styles', 'img', 'scripts');
});


/**
 * Default task
 */
gulp.task('default', ['clean'], function(done){
  runSequence(['css-vendors', 'js-vendors', 'fonts-vendors', 'polyfills-vendors', 'img', 'styles', 'scripts'<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide-styles', 'styleguide-scripts'<% } %>]<% if (props.tools.indexOf("Fabricator") > -1) { %>, 'styleguide'<% } %>, done);
});