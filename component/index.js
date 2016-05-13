'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({

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
            name: 'Page',
            value: 'pages',
            checked: false
          }
        ]
      },{
        type: 'input',
        name: 'name',
        message: 'What\'s the name of your component ?',
        default: 'component'
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

      if (this.type !== 'pages' && !fs.existsSync(this.destinationPath(this.config.assets + 'components/'+ this.type +'/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine))) {
        this.template('_component.html', this.config.assets + 'components/'+ this.type +'/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine);
      } else if (this.type === 'pages' && !fs.existsSync(this.destinationPath(this.config.assets + 'pages/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine))) {
        this.template('_page.html', this.config.assets + 'pages/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine);
      } else {
        this.log(chalk.red(slug(this.name).toLowerCase() + " already founded !") + "\nMake sure that your component doens't already exist.");
      }

      if (!fs.existsSync(this.destinationPath(this.config.assets + 'sass/'+ this.type +'/_'+ slug(this.name).toLowerCase() + '.scss'))) {
        this.copy('components.scss', this.config.assets + 'sass/'+ this.type +'/_'+ slug(this.name).toLowerCase() + '.scss');
      } else {
        this.log(chalk.red(slug(this.name).toLowerCase() + " already founded !") + "\nMake sure that your component doens't already exist.");
      }

      var stylesheet = this.destinationPath(this.config.assets + 'sass/main.scss'),
          importer = "@import '"+ this.type +"/"+ slug(this.name).toLowerCase() + "';";
      if(fs.existsSync(stylesheet)){
        var body = fs.readFileSync(stylesheet).toString();
        if (body.indexOf(importer) < 0 ) {
          body = body.replace("// "+ this.type +":", "// "+ this.type +":\n"+importer);
          fs.writeFileSync(stylesheet, body);
        } else {
          this.log(chalk.red(importer + " already founded !") + "\nMake sure that your component doens't already exist.");
        }
      } else {
        this.log(chalk.red("No main.sccs founded !") + "\nMake sure that your main.scss file is at the root of your sass folder.");
      }
    }
  }
});
