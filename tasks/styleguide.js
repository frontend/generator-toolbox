module.exports = function(gulp, $, config, assemble) {

  var options = {
    layout: config.styleguide.layout,
    layouts: config.styleguide.layouts,
    layoutIncludes: config.styleguide.layoutIncludes,
    views: config.styleguide.views,
    materials: config.styleguide.materials,
    data: config.styleguide.data,
    docs: config.styleguide.docs,
    dest: config.styleguide.dest,
    beautifier: {
      indent_size: 1,
      indent_char: '  ',
      indent_with_tabs: true
    }
  }

  gulp.task('styleguide-assets', function() {
    return gulp.src(config.build + '**/*')
      .pipe(gulp.dest(config.styleguide.dest + '/build'));
  });

  gulp.task('styleguide', ['styleguide-assets'], function (done) {
    assemble(options);
    done();
  });


}