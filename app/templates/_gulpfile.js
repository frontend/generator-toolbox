'use strict';
/**
 * Import plugins
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    config        = require('./gulp_config.json'),
    runSequence   = require('run-sequence');


require(config.tasks + 'vendors')();     // $ gulp vendors
require(config.tasks + 'images')();      // $ gulp img
require(config.tasks + 'styles')();      // $ gulp styles
require(config.tasks + 'scripts')();     // $ gulp scripts
require(config.tasks + 'icons')();       // $ gulp icons
require(config.tasks + 'clean')();       // $ gulp clean<% if (fabricator) { %>
require(config.tasks + 'styleguide')();  // $ gulp styleguide<% } %>
require(config.tasks + 'server')();      // $ gulp serve
require(config.tasks + 'gh-pages')();    // $ gulp deploy


<% if (bootstrapSass) { %>
/**
 * Init project
 */
gulp.task('init', function() {
  return gulp.src('bower_components/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss')
    .pipe($.rename('bootstrap-variables.scss'))
    .pipe(gulp.dest(config.assets + 'sass/'));
});
<% } %>

/**
 * Task to build assets on production server
 */
gulp.task('build',['clean'], function() {
  return gulp.start('vendors', 'styles', 'img', 'scripts', 'icons');
});


/**
 * Default task
 */
gulp.task('default', ['clean'], function(done){
  runSequence(['css-vendors', 'js-vendors', 'fonts-vendors', 'polyfills-vendors', 'img', 'icons', 'styles', 'scripts'<% if (fabricator) { %>, 'styleguide-styles', 'styleguide-scripts'<% } %>]<% if (fabricator) { %>, 'styleguide'<% } %>, done);
});
