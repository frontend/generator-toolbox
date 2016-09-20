'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');

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
          checked: true
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

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
    this.template('_package.json', 'package.json');

      this.template('_gulp_config.json', 'gulp_config.json');
      this.template('_gulpfile.js', 'gulpfile.js');

      this.template('tasks/_clean.js', 'tasks/clean.js');
      this.template('tasks/_server.js', 'tasks/server.js');
      this.copy('tasks/gh-pages.js', 'tasks/gh-pages.js');
      this.copy('tasks/images.js', 'tasks/images.js');
      this.copy('tasks/scripts.js', 'tasks/scripts.js');
      this.copy('tasks/icons.js', 'tasks/icons.js');
      this.copy('tasks/favicons.js', 'tasks/favicons.js');
      if (this.fabricator) {
        this.copy('tasks/metalsmith.js', 'tasks/metalsmith.js');
        this.copy('tasks/filters.js', 'tasks/filters.js');
      }
      this.copy('tasks/styles.js', 'tasks/styles.js');
      this.copy('tasks/vendors.js', 'tasks/vendors.js');

      if (this.fabricator) {
        this.mkdir(this.assets + 'components');
        this.mkdir(this.assets + 'components/atoms');
        this.mkdir(this.assets + 'components/molecules');
        this.mkdir(this.assets + 'components/organisms');
        this.mkdir(this.assets + 'components/pages');
        this.directory('assets/templates', this.assets + 'templates');
        this.directory('assets/data', this.assets + 'data');
        this.directory('assets/docs', this.assets + 'docs');
        this.mkdir(this.assets + 'sass');
        this.mkdir(this.assets + 'sass/atoms');
        this.mkdir(this.assets + 'sass/molecules');
        this.mkdir(this.assets + 'sass/organisms');
        this.mkdir(this.assets + 'sass/pages');
        this.copy('assets/sass/styleguide.scss', this.assets + 'sass/styleguide.scss');
        this.copy('assets/sass/styleguide-variables.scss', this.assets + 'sass/styleguide-variables.scss');
      }

      this.directory('assets/js', this.assets + 'js');

      this.mkdir(this.assets + 'img');
      this.mkdir(this.assets + 'svg');
      this.mkdir(this.assets + 'fonts');
      this.mkdir(this.assets + 'icons');
      this.mkdir(this.assets + 'favicons');

      if (this.bootstrap4) {
        this.copy('assets/sass/bootstrap4.scss', this.assets + 'sass/bootstrap4.scss');
      } else if (this.bootstrapSass) {
        this.copy('assets/sass/bootstrap.scss', this.assets + 'sass/bootstrap.scss');
      }

      this.template('assets/sass/_main.scss', this.assets + 'sass/main.scss');
      this.copy('assets/sass/main-variables.scss', this.assets + 'sass/main-variables.scss');

      if (this.tests) {
        this.directory('tests', 'tests');
        this.mkdir('tests/unit');
        this.mkdir('tests/navigation');
        this.copy('tasks/tests-regression.js', 'tasks/tests-regression.js');
        this.copy('tasks/tests-unit.js', 'tasks/tests-unit.js');
        this.copy('tasks/tests-navigation.js', 'tasks/tests-navigation.js');
      }
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
      this.copy('gitattributes', '.gitattributes');
      this.template('gitignore', '.gitignore');
      this.copy('eslintrc.yml', '.eslintrc.yml');
      this.copy('env', '.env');
      this.copy('stylelintrc', '.stylelintrc');
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});
