import yargs from 'yargs';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

function errorAlert(error) {
  if (!yargs.argv.production) {
    $.notify.onError({ title: 'SCSS Error', message: 'Check your terminal', sound: 'Sosumi' })(error);
    $.util.log(error.messageFormatted ? error.messageFormatted : error.message);
  }
  this.emit('end');
}

export default errorAlert;
