'use strict';
var util          = require('util'),
    yeoman        = require('yeoman-generator'),
    chalk         = require('chalk'),
    yosay         = require('yosay'),
    slug          = require('slug'),
    fs            = require('fs'),
    pathExists    = require('path-exists'),
    rimraf        = require('rimraf');

module.exports = yeoman.Base.extend({

  initializing: function () {
    if(pathExists.sync(this.destinationPath('gulp_config.json'))){
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
      type: 'checkbox',
      name: 'updates',
      message: 'What would you like to update in your project ? (unselect the updates you don\'t want).\n⚠️  The updates may break your project if you are still using the Handlebars/Fabricator components.',
      choices: [{
          name: 'Dev dependencies (in you package.json)',
          value: 'dependencies',
          checked: true
        }, {
          name: 'Gulp tasks and linters',
          value: 'tasks',
          checked: true
        }, {
          name: 'Templates (don\'t remove old ones)',
          value: 'templates',
          checked: false
        }
      ]
    }];

      this.prompt(prompts, function (props) {
        var updates = props.updates;
        function hasUpdate(update) { return updates.indexOf(update) !== -1; }

        this.dependencies = hasUpdate('dependencies');
        this.tasks = hasUpdate('tasks');
        this.templates = hasUpdate('templates');

        done();
      }.bind(this));

    } else {
      done();
    }
  },

  writing: function () {
    var that = this;

    // Redefined needed Variables ------------------------------
    this.fabricator = false;
    if (this.config.styleguide || this.config.metalsmith) {
      this.fabricator = true;
    }

    this.tests = false;
    if (pathExists.sync(this.destinationPath('tests/'))) {
      this.tests = true;
    }

    this.bootstrap = false;
    var stylesheet = this.destinationPath(this.config.assets + 'sass/main.scss');
    if(pathExists.sync(stylesheet)){
      var body = fs.readFileSync(stylesheet).toString();
      if (body.indexOf('bootstrap') !== -1 ) {
        this.bootstrap = true;
      }
    } else {
      this.log(chalk.red("No main.sccs founded !") + "\nMake sure that your main.scss file is at the root of your sass folder.");
    }

    // Update dev dependencies --------------------------------
    if (this.dependencies) {
      if(pathExists.sync(this.destinationPath('package.json'))){
        var packageJson = this.destinationPath('package.json'),
            baseData = require(packageJson),
            newData = fs.readFileSync(this.templatePath('./../../app/templates/_package.json')).toString().match(/"devDependencies": {[\s\S]*?}/g),
            devDependencies = JSON.parse('{'+newData+'}').devDependencies;

        baseData.devDependencies = devDependencies;
        fs.writeFileSync(packageJson, JSON.stringify(baseData, null, 2));
      } else {
        this.log(chalk.red("No package.json founded !") + "\nMake sure that the package.json is at your project's root.")
      }
    }

    // Update tasks --------------------------------------------
    if (this.tasks) {
      rimraf(this.destinationPath('gulpfile.js'), function () {
        that.template('./../../app/templates/_gulpfile.js', 'gulpfile.js');
      });

      rimraf(this.destinationPath(this.config.tasks), function () {
        that.template('./../../app/templates/tasks/_clean.js', 'tasks/clean.js');
        that.template('./../../app/templates/tasks/_server.js', 'tasks/server.js');
        that.copy('./../../app/templates/tasks/gh-pages.js', 'tasks/gh-pages.js');
        that.copy('./../../app/templates/tasks/images.js', 'tasks/images.js');
        that.copy('./../../app/templates/tasks/scripts.js', 'tasks/scripts.js');
        that.copy('./../../app/templates/tasks/icons.js', 'tasks/icons.js');
        that.copy('./../../app/templates/tasks/favicons.js', 'tasks/favicons.js');
        that.copy('./../../app/templates/tasks/styles.js', 'tasks/styles.js');
        that.copy('./../../app/templates/tasks/vendors.js', 'tasks/vendors.js');

        if (that.fabricator) {
          that.copy('./../../app/templates/tasks/metalsmith.js', 'tasks/metalsmith.js');
          that.copy('./../../app/templates/tasks/filters.js', 'tasks/filters.js');
        }
      });

      if(!pathExists.sync(this.destinationPath('.eslintrc.yml'))){
        this.copy('./../../app/templates/eslintrc.yml', '.eslintrc.yml');
      }
      if(!pathExists.sync(this.destinationPath('.stylelintrc'))){
        this.copy('./../../app/templates/stylelintrc', '.stylelintrc');
      }
    }

    // Add new templates --------------------------------
    if (this.templates) {
      this.directory('./../../app/templates/assets/templates', this.config.assets + 'templates');
    }
  },

  end: function () {
    if (this.tasks) {
      console.log('   ☝️ 😉  Don\'t forget to update your '+chalk.red('gulp_config.json')+' file !');
    }
  }
});
