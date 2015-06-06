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
    this.slug = slug;

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'What kind of component is it ? ',
      choices: [{
          name: 'Atom',
          value: 'atoms',
          checked: true
        }, {
          name: 'Molecule',
          value: 'molecules',
          checked: false
        }, {
          name: 'Organism',
          value: 'organisms',
          checked: false
        }, {
          name: 'Template',
          value: 'templates',
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
    if (this.type !== 'templates') {
      this.template('_component.hbs', this.config.assets + 'components/'+ this.type +'/'+ slug(this.name).toLowerCase() +'.hbs');
    } else {
      this.template('component.html', this.config.assets + 'templates/'+ slug(this.name).toLowerCase() +'.html');
    }

    var plural = '';
    if (this.type !== 'templates') {
      plural = 's';
    }

    this.copy('components.scss', this.config.assets + 'sass/'+ this.type +'/_'+ slug(this.name).toLowerCase() + plural +'.scss');

  }
});
