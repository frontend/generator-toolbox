'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');
var fs = require('fs');

module.exports = yeoman.Base.extend({

  initializing: function () {
    if(fs.existsSync(this.destinationPath('gulp_config.json'))){
      this.config = require(this.destinationPath('gulp_config.json'));
      this.continue = true;
    } else {
      this.log(chalk.red("No gulp_config.json founded !") + "\nMake sure that the gulp_config.json is at your project's root.")
      this.continue = false;
    }
  },

  prompting: function () {
    var done = this.async();
    this.slug = slug;

    if (this.continue) {
      var prompts = [{
        type: 'list',
        name: 'type',
        message: 'What kind of script is it ? ',
        choices: [{
            name: 'jQuery',
            value: 'jquery',
            checked: true
          }, {
            name: 'JavaScript vanilla',
            value: 'vanilla',
            checked: false
          }
        ]
      },{
        type: 'input',
        name: 'name',
        message: 'What\'s the name of your script ?',
        default: 'script'
      }];

      this.prompt(prompts, function (props) {
        this.type = props.type;
        this.name = props.name;

        done();
      }.bind(this));
    } else {
      done();
    }
  },

  writing: function () {
    if (typeof this.name !== 'undefined' && typeof this.type !== 'undefined') {
      if (this.type === 'jquery' && !fs.existsSync(this.destinationPath(this.config.assets + 'js/'+ slug(this.name).toLowerCase() +'.js'))) {
        this.copy('jquery.js', this.config.assets + 'js/'+ slug(this.name).toLowerCase() +'.js');
        this.template('_jquery.test.js', 'tests/unit/'+ slug(this.name).toLowerCase() +'.test.js');
      } else if (this.type === 'vanilla' && !fs.existsSync(this.destinationPath(this.config.assets + 'js/'+ slug(this.name).toLowerCase() +'.js'))) {
        this.copy('vanilla.js', this.config.assets + 'js/'+ slug(this.name).toLowerCase() +'.js');
        this.template('_vanilla.test.js', 'tests/unit/'+ slug(this.name).toLowerCase() +'.test.js');
      } else {
        this.log(chalk.red(slug(this.name).toLowerCase() + " already founded !") + "\nMake sure that your script doens't already exist.");
      }
    }
  }
});
