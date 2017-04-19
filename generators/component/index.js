'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slug = require('slug');
var pathExists = require('path-exists');
var fs = require('fs');

module.exports = yeoman.Base.extend({

  initializing: function () {
    if(pathExists.sync(this.destinationPath('gulp_config.json'))){
      this.config = require(this.destinationPath('gulp_config.json'));
      this.continue = true;
    } else {
      this.log(chalk.red("No gulp_config.json was found!") + "\nMake sure your gulp_config.json is at the project root.")
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
            value: {
              name: 'atoms',
              title: 'My Atom'
            },
            checked: true
          }, {
            name: 'Molecule',
            value: {
              name: 'molecules',
              title: 'My Molecule'
            },
            checked: false
          }, {
            name: 'Organism',
            value: {
              name: 'organisms',
              title: 'My Organism'
            },
            checked: false
          }, {
            name: 'Page',
            value: {
              name: 'pages',
              title: 'My Page'
            },
            checked: false
          }, {
            name: 'Doc page',
            value: {
              name: 'doc',
              title: 'My Doc Page'
            },
            checked: false
          }
        ]
      },{
        type: 'input',
        name: 'name',
        message: 'What\'s the name of your component ?',
        default: function(answers) {
          return answers.type.title;
        }
      }];

      this.prompt(prompts, function (props) {
        this.type = props.type.name;
        this.name = props.name;

        done();
      }.bind(this));
    } else {
      done();
    }
  },

  writing: function () {
    if (typeof this.name !== 'undefined' && typeof this.type !== 'undefined') {

      if (this.type !== 'doc' && this.type !== 'pages' && !pathExists.sync(this.destinationPath(this.config.assets + 'components/'+ this.type +'/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine))) {
        this.template('_component.html', this.config.assets + 'components/'+ this.type +'/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine);
      } else if (this.type !== 'doc' && this.type === 'pages' && !pathExists.sync(this.destinationPath(this.config.assets + 'components/pages/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine))) {
        this.template('_page.html', this.config.assets + 'components/pages/'+ slug(this.name).toLowerCase() +'.html.' + this.config.metalsmith.plugins.layouts.engine);
      } else if (this.type === 'doc' && this.type !== 'pages' && !pathExists.sync(this.destinationPath(this.config.assets + 'docs/'+ slug(this.name).toLowerCase() +'.md'))) {
        this.template('_doc.html', this.config.assets + 'docs/'+ slug(this.name).toLowerCase() +'.md');
      } else {
        this.log(chalk.red(slug(this.name).toLowerCase() + " was already found!") + "\nMake sure your component doesn't already exist.");
      }

      if (!pathExists.sync(this.destinationPath(this.config.assets + 'sass/'+ this.type +'/_'+ slug(this.name).toLowerCase() + '.scss'))) {
        this.copy('components.scss', this.config.assets + 'sass/'+ this.type +'/_'+ slug(this.name).toLowerCase() + '.scss');
      } else {
        this.log(chalk.red(slug(this.name).toLowerCase() + " was already found!") + "\nMake sure your component doesn't already exist.");
      }

      if (this.type !== 'doc') {
        var stylesheet = this.destinationPath(this.config.assets + 'sass/main.scss'),
            importer = "@import '"+ this.type +"/"+ slug(this.name).toLowerCase() + "';\n";
        if(pathExists.sync(stylesheet)){
          var body = fs.readFileSync(stylesheet).toString();
          if (body.indexOf(importer) < 0 ) {
            // regex to append the new line at the end of the whole block of code
            var regex = new RegExp("(// " + this.type + ":\n(?:.+\n)+)");
            body = body.replace(regex, "$1" + importer);
            fs.writeFileSync(stylesheet, body);
          } else {
            this.log(chalk.red(importer + " was already found!") + "\nMake sure your component doesn't already exist.");
          }
        } else {
          this.log(chalk.red("No main.sccs was found!") + "\nMake sure your main.scss file is at the root of your sass directory.");
        }
      }
    }
  }
});
