'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const slug = require('slug');

/* eslint-disable */
const toolboxSay = function() {
  return  '                                             '+'\n'+
          '       '+chalk.blue('_')+'                                     '+'\n'+
          '      '+chalk.blue('/ \\')+'    '+chalk.red('.-------.')+'                       '+'\n'+
          '      '+chalk.blue('\\ /')+'  '+chalk.red('.\'        |')+'                       '+'\n'+
          '      '+chalk.blue('| |')+'   '+chalk.red('`._______|')+'                       '+'\n'+
          '   '+chalk.red('  .---.')+'     '+chalk.blue('|  |')+'       '+chalk.red('.-----------------.')+'\n'+
          '   '+chalk.red('  || ||')+'     '+chalk.blue('|  |')+'       '+chalk.red('| '+chalk.white('Welcome in the')+'  |')+'\n'+
          '   '+chalk.red('  || ||')+'     '+chalk.blue('|  |')+'       '+chalk.red('| '+chalk.white('amazing toolbox')+' |')+'\n'+
          '   '+chalk.red(' / | | \\')+'    '+chalk.blue('|  |')+'       '+chalk.red('|   '+chalk.white('generator !')+'   |')+'\n'+
          '  '+chalk.blue('+-----------------+')+'     '+chalk.red('\'-----------------\'')+'\n'+
          '  '+chalk.blue('|                 |')+'                        '+'\n'+
          '  '+chalk.blue('|     '+chalk.red('TOOLBOX')+'     |')+'                        '+'\n'+
          '  '+chalk.blue('|                 |')+'                        '+'\n'+
          '  '+chalk.blue('+-----------------+')+'                        '+'\n'+
          '\n';

};
/* eslint-enable */

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('contentful'); // This method adds support for a `--contentful` flag
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(toolboxSay());

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your project ?',
      default: 'Toolbox'
    }, {
      type: 'checkbox',
      name: 'tools',
      message: 'What would you like to use in your project ? (unselect the ones you don\'t want) ',
      choices: [{
        name: 'Styleguide',
        value: 'styleguide',
        checked: false
      }, {
        name: 'Framework (Bootstrap 4)',
        value: 'bootstrap',
        checked: false
      }, {
        name: 'Tests (Mocha, Casperjs and Chai)',
        value: 'tests',
        checked: false
      }]
    }, {
      type: 'input',
      name: 'src',
      message: 'Where would you like to put your assets ?',
      default: 'assets/'
    }, {
      type: 'input',
      name: 'dest',
      message: 'Where would you like to put your build ?',
      default: function (answers) {
        return answers.src.indexOf('assets') !== -1 ? answers.src.replace(/assets\/?$/, 'build/') : 'build/'; // eslint-disable-line
      }
    }])
    .then(answers => {
      answers.slug = slug(answers.name);

      answers.contentful = this.options.contentful || false;

      // Tools
      var tools = answers.tools;
      function hasTool(tool) {
        return tools.indexOf(tool) !== -1;
      }

      answers.styleguide = hasTool('styleguide');
      answers.bootstrap = hasTool('bootstrap');
      answers.tests = hasTool('tests');

      if (answers.src.slice(-1) !== '/') {
        answers.src += '/';
      }

      if (answers.dest.slice(-1) !== '/') {
        answers.dest += '/';
      }

      answers.fromSrcToTop = '../'.repeat(answers.src.replace(/^\/|\/$/, '').split('/').length + 1);

      this.props = answers;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.props.name,
        bootstrap: this.props.bootstrap,
        tests: this.props.tests,
        contentful: this.props.contentful,
        assets: this.props.assets,
      }
    );

    this.fs.copyTpl(
      this.templatePath('_gulp_config.json'),
      this.destinationPath('gulp_config.json'),
      {
        styleguide: this.props.styleguide,
        bootstrap: this.props.bootstrap,
        src: this.props.src,
        dest: this.props.dest
      }
    );

    this.fs.copy(
      this.templatePath('_gulpfile_light.babel.js'),
      this.destinationPath('gulpfile.babel.js')
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    // Styles
    this.fs.copyTpl(
      this.templatePath('assets/sass/_main.scss'),
      this.destinationPath(`${this.props.src}sass/main.scss`),
      {
        styleguide: this.props.styleguide,
        bootstrap: this.props.bootstrap
      }
    );
    this.fs.write(this.destinationPath(`${this.props.src}sass/atoms/.gitkeep`), '');
    this.fs.write(this.destinationPath(`${this.props.src}sass/molecules/.gitkeep`), '');
    this.fs.write(this.destinationPath(`${this.props.src}sass/organisms/.gitkeep`), '');
    this.fs.write(this.destinationPath(`${this.props.src}sass/pages/.gitkeep`), '');

    // Images
    this.fs.write(this.destinationPath(`${this.props.src}img/.gitkeep`), '');
    // SVG
    this.fs.write(this.destinationPath(`${this.props.src}svg/.gitkeep`), '');

    // Scripts
    this.fs.copy(
      this.templatePath('assets/js/index.js'),
      this.destinationPath(`${this.props.src}js/index.js`)
    );

    this.fs.write(this.destinationPath(`${this.props.src}sass/main-variables.scss`), '@charset \'utf-8\';\n');

    if (this.props.styleguide) {
      this.fs.copyTpl(
        this.templatePath('assets/sass/_styleguide.scss'),
        this.destinationPath(`${this.props.src}sass/styleguide.scss`),
        {
          fromSrcToTop: this.props.fromSrcToTop
        }
      );
    }
  }

  install() {
    let packages = [];
    let packages_dev = [];

    if (this.props.styleguide) {
      packages = this.fs.readJSON(this.templatePath('_package_styleguide.json'));
      this.log(packages);
    }

    this.yarnInstall();
  }
};

// Module.exports = yeoman.Base.extend({
//
//   writing: {
//     app: function () {
//       this.template('_package.json', 'package.json');
//       this.template('_gulp_config.json', 'gulp_config.json');
//       this.template('_gulpfile.babel.js', 'gulpfile.babel.js');
//
//       this.copy('tasks/clean.js', 'tasks/clean.js');
//       this.copy('tasks/server.js', 'tasks/server.js');
//       this.copy('tasks/deploy.js', 'tasks/deploy.js');
//       this.copy('tasks/images.js', 'tasks/images.js');
//       this.copy('tasks/icons.js', 'tasks/icons.js');
//       this.copy('tasks/favicons.js', 'tasks/favicons.js');
//       this.template('tasks/_metalsmith.js', 'tasks/metalsmith.js');
//       this.copy('tasks/filters.js', 'tasks/filters.js');
//       this.copy('tasks/single.js', 'tasks/single.js');
//       this.copy('tasks/styles.js', 'tasks/styles.js');
//       this.copy('tasks/scripts.js', 'tasks/scripts.js');
//       this.copy('tasks/vendors.js', 'tasks/vendors.js');
//
//       if (this.fabricator) {
//         mkdirp.sync(this.assets + 'components');
//         mkdirp.sync(this.assets + 'components/atoms');
//         mkdirp.sync(this.assets + 'components/molecules');
//         mkdirp.sync(this.assets + 'components/organisms');
//         mkdirp.sync(this.assets + 'components/pages');
//         this.directory('assets/templates', this.assets + 'templates');
//         this.directory('assets/data', this.assets + 'data');
//         this.directory('assets/docs', this.assets + 'docs');
//         mkdirp.sync(this.assets + 'sass');
//         mkdirp.sync(this.assets + 'sass/atoms');
//         mkdirp.sync(this.assets + 'sass/molecules');
//         mkdirp.sync(this.assets + 'sass/organisms');
//         mkdirp.sync(this.assets + 'sass/pages');
//         this.template('assets/sass/styleguide.scss', this.assets + 'sass/styleguide.scss');
//         this.copy('assets/sass/styleguide-variables.scss', this.assets + 'sass/styleguide-variables.scss');
//       }
//
//       this.directory('assets/js', this.assets + 'js');
//
//       mkdirp.sync(this.assets + 'img');
//       mkdirp.sync(this.assets + 'svg');
//       mkdirp.sync(this.assets + 'fonts');
//       mkdirp.sync(this.assets + 'icons');
//       mkdirp.sync(this.assets + 'favicons');
//
//       if (this.bootstrap) {
//         this.template('assets/sass/bootstrap.scss', this.assets + 'sass/bootstrap.scss');
//       }
//
//       this.template('assets/sass/_main.scss', this.assets + 'sass/main.scss');
//       this.copy('assets/sass/main-variables.scss', this.assets + 'sass/main-variables.scss');
//
//       if (this.tests) {
//         this.directory('tests', 'tests');
//         mkdirp.sync('tests/unit');
//         mkdirp.sync('tests/navigation');
//         this.copy('tasks/tests-regression.js', 'tasks/tests-regression.js');
//         this.copy('tasks/tests-unit.js', 'tasks/tests-unit.js');
//         this.copy('tasks/tests-navigation.js', 'tasks/tests-navigation.js');
//       }
//     },
//
//     projectfiles: function () {
//       this.template('babelrc', '.babelrc');
//       this.copy('editorconfig', '.editorconfig');
//       this.copy('webpack.dev.config.js', 'webpack.dev.config.js');
//       this.copy('webpack.prod.config.js', 'webpack.prod.config.js');
//       this.copy('gitattributes', '.gitattributes');
//       this.template('gitignore', '.gitignore');
//       this.copy('eslintrc', '.eslintrc');
//       this.template('_stylelintrc', '.stylelintrc');
//
//       if (this.contentful) {
//         this.template('env', '.env');
//       }
//     }
//   },
//
//   install: function () {
//     if (!this.options['skip-install']) {
//       this.spawnCommand('yarn').on('error', function () {
//         console.error(chalk.red('Can\'t run ') + chalk.blue('yarn') + chalk.red(' command because it wasn\'t found. Please run ') + chalk.cyan('npm install -g yarn') + chalk.red(' and try again.'));
//       });
//     }
//   }
// });
