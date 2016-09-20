import gulp from 'gulp';
import config from '../gulp_config.json';
import slug from 'slug';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

const name = slug(config.iconsFontName).toLowerCase();

/*
 * Build icons font and stylesheets
 */
export const icons = () => {
  return gulp.src(`${config.assets}icons/**/*.svg`)
    .pipe($.iconfont({
      fontName: name,
      appendCodepoints: true,
      normalize:true,
      fontHeight: 1001
    }))
    .on('glyphs', function(glyphs) {
      gulp.src('node_modules/toolbox-utils/templates/_icons.scss')
        .pipe($.consolidate('lodash', {
          glyphs: glyphs.map(function(glyph) {
            return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) };
          }),
          fontName: name,
          fontPath: '../fonts/',
          className: name
        }))
        .pipe($.rename(`${name}.scss`))
        .pipe(gulp.dest(`${config.assets}sass/`));
    })
    .pipe(gulp.dest(`${config.build}fonts`));
};

export const iconsTask = gulp.task('icons', icons);
