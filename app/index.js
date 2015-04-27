'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');

var toolboxSay = function() {
  return  '                                             '+'\n'+
          '       '+chalk.white('_')+'                                     '+'\n'+
          '      '+chalk.white('/ \\')+'    '+chalk.white('.-------.')+'                       '+'\n'+
          '      '+chalk.white('\\ /')+'  '+chalk.white('.\'        |')+'                       '+'\n'+
          '      '+chalk.white('| |')+'   '+chalk.white('`._______|')+'                       '+'\n'+
          '      '+chalk.white('| |')+'      '+chalk.yellow('|  |')+'                          '+'\n'+
          '   '+chalk.red('  .---.')+'     '+chalk.yellow('|  |')+'       '+chalk.red('.-----------------.')+'\n'+
          '   '+chalk.red('  || ||')+'     '+chalk.yellow('|  |')+'       '+chalk.red('| '+chalk.white('Welcome in the')+'  |')+'\n'+
          '   '+chalk.red('  || ||')+'     '+chalk.yellow('|  |')+'       '+chalk.red('| '+chalk.white('amazing toolbox')+' |')+'\n'+
          '   '+chalk.red(' / | | \\')+'    '+chalk.yellow('|  |')+'       '+chalk.red('|   '+chalk.white('generator !')+'   |')+'\n'+
          '  '+chalk.cyan('+-----------------+')+'     '+chalk.red('\'-----------------\'')+'\n'+
          '  '+chalk.cyan('|                 |')+'                        '+'\n'+
          '  '+chalk.cyan('|     '+chalk.yellow('TOOLBOX')+'     |')+'                        '+'\n'+
          '  '+chalk.cyan('|                 |')+'                        '+'\n'+
          '  '+chalk.cyan('+-----------------+')+'                        '+'\n'+
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
      message: 'What\'s the name of your project?',
      default: 'Toolbox'
    },{
      type: 'checkbox',
      name: 'tools',
      message: 'What would you like to use in your project?',
      choices: [ 'Gulp', 'Fabricator', 'Bootstrap' ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_bower.json', 'bower.json');

      if (this.props.tools.indexOf('Gulp') > -1) {
        this.template('_package.json', 'package.json');
        this.template('_gulp_config.json', 'gulp_config.json');
        this.template('_gulpfile.js', 'gulpfile.js');

        this.template('tasks/_clean.js', 'tasks/clean.js');
        this.template('tasks/_server.js', 'tasks/server.js');
        this.copy('tasks/gh-pages.js', 'tasks/gh-pages.js');
        this.copy('tasks/images.js', 'tasks/images.js');
        this.copy('tasks/scripts.js', 'tasks/scripts.js');
        if (this.props.tools.indexOf('Fabricator') > -1) {
          this.copy('tasks/styleguide.js', 'tasks/styleguide.js');
        }
        this.copy('tasks/styles.js', 'tasks/styles.js');
        this.copy('tasks/vendors.js', 'tasks/vendors.js');
      }

      if (this.props.tools.indexOf('Fabricator') > -1) {
        this.directory('assets/components', 'assets/components');
        this.directory('assets/templates', 'assets/templates');
        this.directory('assets/data', 'assets/data');
        this.directory('assets/docs', 'assets/docs');
        this.directory('assets/sass/atoms', 'assets/sass/atoms');
        this.directory('assets/sass/molecules', 'assets/sass/molecules');
        this.directory('assets/sass/organisms', 'assets/sass/organisms');
        this.directory('assets/sass/templates', 'assets/sass/templates');
        this.copy('assets/sass/styleguide.scss', 'assets/sass/styleguide.scss');
      }

      this.directory('assets/js', 'assets/js');

      if (this.props.tools.indexOf('Bootstrap') > -1) {
        this.copy('assets/sass/bootstrap.scss', 'assets/sass/bootstrap.scss');
      }

      this.template('assets/sass/_main.scss', 'assets/sass/main.scss');
      this.copy('assets/sass/main-variables.scss', 'assets/sass/main-variables.scss');
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
      this.copy('gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
      this.copy('jshintrc', '.jshintrc');
    }
  },

  install: function () {
    this.installDependencies();
  }
});
