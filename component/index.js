'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.config = require(this.destinationPath('gulp_config.json'));
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What kind of component is it ? ',
      choices: [{
          name: 'Atom',
          value: 'atom',
          checked: true
        }, {
          name: 'Molecule',
          value: 'molecule',
          checked: false
        }, {
          name: 'Organism',
          value: 'organism',
          checked: false
        }, {
          name: 'Template',
          value: 'template',
          checked: false
        }
      ]
    },{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your component ?',
      default: 'Toolbox'
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      this.name = props.name;

      done();
    }.bind(this));
  },

  writing: function () {
    this.log(this.type + ' / ' + this.name)
  }
});
