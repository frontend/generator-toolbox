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

module.exports = yeoman.generators.Base.extend({
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
          name: 'Task runner (GulpJS)',
          value: 'gulp',
          checked: true
        }, {
          name: 'Styleguide (Fabricator)',
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

      var tools = props.tools;
      function hasTool(tool) { return tools.indexOf(tool) !== -1; }
      this.gulp = hasTool('gulp');
      this.fabricator = hasTool('fabricator');
      this.bootstrapSass = hasTool('bootstrapSass');
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
      this.template('_bower.json', 'bower.json');

      if (this.gulp) {
        this.template('_package.json', 'package.json');
        this.template('_gulp_config.json', 'gulp_config.json');
        this.template('_gulpfile.js', 'gulpfile.js');

        this.template('tasks/_clean.js', 'tasks/clean.js');
        this.template('tasks/_server.js', 'tasks/server.js');
        this.copy('tasks/gh-pages.js', 'tasks/gh-pages.js');
        this.copy('tasks/images.js', 'tasks/images.js');
        this.copy('tasks/scripts.js', 'tasks/scripts.js');
        this.copy('tasks/icons.js', 'tasks/icons.js');
        if (this.fabricator) {
          this.copy('tasks/styleguide.js', 'tasks/styleguide.js');
        }
        this.copy('tasks/styles.js', 'tasks/styles.js');
        this.copy('tasks/vendors.js', 'tasks/vendors.js');
      }

      if (this.fabricator) {
        this.directory('assets/components', this.assets + 'components');
        this.directory('assets/templates', this.assets + 'templates');
        this.directory('assets/data', this.assets + 'data');
        this.directory('assets/docs', this.assets + 'docs');
        this.directory('assets/sass/atoms', this.assets + 'sass/atoms');
        this.directory('assets/sass/molecules', this.assets + 'sass/molecules');
        this.directory('assets/sass/organisms', this.assets + 'sass/organisms');
        this.directory('assets/sass/templates', this.assets + 'sass/templates');
        this.copy('assets/sass/styleguide.scss', this.assets + 'sass/styleguide.scss');
      }

      this.directory('assets/js', this.assets + 'js');

      this.mkdir(this.assets + 'img');
      this.mkdir(this.assets + 'svg');
      this.mkdir(this.assets + 'fonts');
      this.mkdir(this.assets + 'icons');

      if (this.bootstrapSass) {
        this.copy('assets/sass/bootstrap.scss', this.assets + 'sass/bootstrap.scss');
      }

      this.template('assets/sass/_main.scss', this.assets + 'sass/main.scss');
      this.copy('assets/sass/main-variables.scss', this.assets + 'sass/main-variables.scss');

      if (this.tests) {
        this.directory('tests', 'tests');
        this.copy('tasks/tests-regression.js', 'tasks/tests-regression.js');
      }
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
      this.copy('gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
      this.copy('jshintrc', '.jshintrc');
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }

    var successText = 'The END! Run \n run ' + chalk.cyan('`$ npm start`') + ' now!';
    this.log(yosay(successText));
  }
});
