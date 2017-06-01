import gulp from 'gulp';
import config from '../toolbox.json';

import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

const name = config.iconsFontName;

/*
 * Build icons font and stylesheets
 */
const icons = () => {
  return gulp.src(`${config.src}icons/**/*.svg`)
    .pipe($.iconfont({
      fontName: name,
      appendCodepoints: true,
      normalize: true,
      fontHeight: 1001,
    }))
    .on('glyphs', (glyphs) => {
      gulp.src('node_modules/toolbox-utils/templates/_icons.scss')
        .pipe($.consolidate('lodash', {
          glyphs: glyphs.map((glyph) => {
            return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) };
          }),
          fontName: name,
          fontPath: '../fonts/',
          className: name,
        }))
        .pipe($.rename(`${name}.scss`))
        .pipe(gulp.dest(`${config.src}fonts`));
    })
    .pipe(gulp.dest(`${config.dest}fonts`));
};

export default icons;
