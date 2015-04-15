var options = {
  layout: 'default',
  layouts: 'src/views/layouts/*',
  layoutIncludes: 'src/views/layouts/includes/*',
  views: ['src/views/**/*', '!src/views/+(layouts)/**'],
  materials: 'src/materials/**/*',
  data: 'src/data/**/*.{json,yml}',
  docs: 'src/docs/**/*.md',
  dest: 'dist',
  beautifier: {
    indent_size: 1,
    indent_char: '  ',
    indent_with_tabs: true
  }
}