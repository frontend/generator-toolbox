'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the finest ' + chalk.red('Toolbox') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: "What's the name of your project?",
      default: 'Toolbox'
    },{
      type: "checkbox",
      name: "tools",
      message: "What would you like to use in your project?",
      choices: [ "Gulp", "Styleguide" ]
    },{
      type: "list",
      name: "finish",
      default: 1,
      message: "Finish ?",
      choices: [ "Yes", "No" ],
      filter: function( val ) { return val.toLowerCase(); }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      
    },

    projectfiles: function () {
      
    }
  },

  install: function () {
    this.installDependencies();
  }
});
