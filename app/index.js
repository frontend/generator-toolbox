'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');
var mkdirp = require('mkdirp');

var toolboxSay = function() {
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

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(toolboxSay());

    this.slug = slug;

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your project ?',
      default: 'Toolbox'
    },{
      type: 'checkbox',
      name: 'tools',
      message: 'What would you like to use in your project ? (unselect the ones you don\'t want) ',
      choices: [{
          name: 'Styleguide',
          value: 'fabricator',
          checked: true
        }, {
          name: 'Framework (Bootstrap)',
          value: 'bootstrapSass',
          checked: true
        }, {
          name: 'Tests (Mocha, Casperjs and Chai)',
          value: 'tests',
          checked: false
        }
      ]
    },{
      when: function (response) {
        // this.log(response);
        return response.tools.indexOf('bootstrapSass') !== -1;
      },
      name: 'bootstrap4',
      type: 'confirm',
      message: 'Do you want to use Bootstrap 4 Alpha?',
      default: false
    },{
      when: function (response) {
        // this.log(response);
        return response.tools.indexOf('fabricator') !== -1;
      },
      type: 'input',
      name: 'contentful',
      message: 'If you want to setup ' + chalk.blue('Contentful') + ', print your key here: (leave blank to disable)',
      default: false
    },{
      type: 'input',
      name: 'assets',
      message: 'Where would you like to put your assets ?',
      default: 'assets/'
    },{
      type: 'input',
      name: 'build',
      message: 'Where would you like to put your build ?',
      default: 'build/'
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.contentful = props.contentful;

      // Tools
      var tools = props.tools;
      function hasTool(tool) { return tools.indexOf(tool) !== -1; }

      this.fabricator = hasTool('fabricator');
      this.bootstrapSass = hasTool('bootstrapSass');
      this.bootstrap4 = props.bootstrap4;
      this.tests = hasTool('tests');

      if (props.assets.slice(-1) === '/') {
        this.assets = props.assets;
      } else {
        this.assets = props.assets + '/';
      }

      if (props.build.slice(-1) === '/') {
        this.build = props.build;
      } else {
        this.build = props.build + '/';
      }

      this.fromSassToTop = '../'.repeat(this.assets.replace(/^\/|\/$/, '').split('/').length + 2);

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_package.json', 'package.json');
      this.template('_gulp_config.json', 'gulp_config.json');
      this.template('_gulpfile.babel.js', 'gulpfile.babel.js');

      this.copy('tasks/clean.js', 'tasks/clean.js');
      this.copy('tasks/server.js', 'tasks/server.js');
      this.copy('tasks/deploy.js', 'tasks/deploy.js');
      this.copy('tasks/images.js', 'tasks/images.js');
      this.copy('tasks/icons.js', 'tasks/icons.js');
      this.copy('tasks/favicons.js', 'tasks/favicons.js');
      this.template('tasks/_metalsmith.js', 'tasks/metalsmith.js');
      this.copy('tasks/filters.js', 'tasks/filters.js');
      this.copy('tasks/styles.js', 'tasks/styles.js');
      this.copy('tasks/scripts.js', 'tasks/scripts.js');
      this.copy('tasks/vendors.js', 'tasks/vendors.js');

      if (this.fabricator) {
        mkdirp.sync(this.assets + 'components');
        mkdirp.sync(this.assets + 'components/atoms');
        mkdirp.sync(this.assets + 'components/molecules');
        mkdirp.sync(this.assets + 'components/organisms');
        mkdirp.sync(this.assets + 'components/pages');
        this.directory('assets/templates', this.assets + 'templates');
        this.directory('assets/data', this.assets + 'data');
        this.directory('assets/docs', this.assets + 'docs');
        mkdirp.sync(this.assets + 'sass');
        mkdirp.sync(this.assets + 'sass/atoms');
        mkdirp.sync(this.assets + 'sass/molecules');
        mkdirp.sync(this.assets + 'sass/organisms');
        mkdirp.sync(this.assets + 'sass/pages');
        this.copy('assets/sass/styleguide.scss', this.assets + 'sass/styleguide.scss');
        this.copy('assets/sass/styleguide-variables.scss', this.assets + 'sass/styleguide-variables.scss');
      }

      this.directory('assets/js', this.assets + 'js');

      mkdirp.sync(this.assets + 'img');
      mkdirp.sync(this.assets + 'svg');
      mkdirp.sync(this.assets + 'fonts');
      mkdirp.sync(this.assets + 'icons');
      mkdirp.sync(this.assets + 'favicons');

      if (this.bootstrap4) {
        this.copy('assets/sass/bootstrap4.scss', this.assets + 'sass/bootstrap4.scss');
      } else if (this.bootstrapSass) {
        this.copy('assets/sass/bootstrap.scss', this.assets + 'sass/bootstrap.scss');
      }

      this.template('assets/sass/_main.scss', this.assets + 'sass/main.scss');
      this.copy('assets/sass/main-variables.scss', this.assets + 'sass/main-variables.scss');

      if (this.tests) {
        this.directory('tests', 'tests');
        mkdirp.sync('tests/unit');
        mkdirp.sync('tests/navigation');
        this.copy('tasks/tests-regression.js', 'tasks/tests-regression.js');
        this.copy('tasks/tests-unit.js', 'tasks/tests-unit.js');
        this.copy('tasks/tests-navigation.js', 'tasks/tests-navigation.js');
      }
    },

    projectfiles: function () {
      this.template('babelrc', '.babelrc');
      this.copy('editorconfig', '.editorconfig');
      this.copy('webpack.dev.config.js', 'webpack.dev.config.js');
      this.copy('webpack.prod.config.js', 'webpack.prod.config.js');
      this.copy('gitattributes', '.gitattributes');
      this.template('gitignore', '.gitignore');
      this.copy('eslintrc.yml', '.eslintrc.yml');
      this.template('_stylelintrc', '.stylelintrc');

      if (this.contentful) {
        this.template('env', '.env');
      }
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  }
});
