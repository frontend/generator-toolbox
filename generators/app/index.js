'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const slug = require('slug');
const curl = require('curlrequest');

/* eslint-disable */
const toolboxSay = function() {
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
/* eslint-enable */

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('contentful'); // This method adds support for a `--contentful` flag
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(toolboxSay());

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your project?',
      default: 'Toolbox'
    }, {
      type: 'checkbox',
      name: 'options',
      message: 'What would you like to use in your project?',
      choices: [{
        name: 'Framework (Bootstrap 4)',
        value: 'bootstrap',
        checked: true
      }, {
        name: 'Create Antistatique humans.txt',
        value: 'humans',
        checked: true
      }, {
        name: 'Create CHANGELOG.md and VERSION files',
        value: 'changelog',
        checked: true
      }]
    }, {
      type: 'list',
      name: 'icons',
      message: 'How should your icons be generated?',
      default: 'svg',
      choices: [{
        name: 'I want the SVG icons goodness',
        value: 'svg'
      }, {
        name: 'Gimme good old font icons.',
        value: 'font'
      }]
    }, {
      type: 'input',
      name: 'src',
      message: 'Where would you like to put your assets?',
      default: 'assets/'
    }, {
      type: 'input',
      name: 'dest',
      message: 'Where would you like to put your build?',
      default: function (answers) {
        return answers.src.indexOf('assets') !== -1 ? answers.src.replace(/assets\/?$/, 'build/') : 'build/'; // eslint-disable-line
      }
    }])
    .then(answers => {
      answers.slug = slug(answers.name, {lower: true});

      // Get options
      var options = answers.options;
      function hasOption(tool) {
        return options.indexOf(tool) !== -1;
      }

      answers.bootstrap = hasOption('bootstrap');
      answers.humans = hasOption('humans');
      answers.changelog = hasOption('changelog');

      // Make sure we have a "/" at the end of the paths
      if (answers.src.slice(-1) !== '/') {
        answers.src += '/';
      }

      if (answers.dest.slice(-1) !== '/') {
        answers.dest += '/';
      }

      // Generate the path to /node_modules from assets or build directory
      answers.fromSrcToTop = '../'.repeat(answers.src.replace(/^\/|\/$/, '').split('/').length + 1);

      this.props = answers;
    });
  }

  writing() {
    const emptyDirs = [];

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.props.slug,
        assets: this.props.src,
      }
    );

    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
      {
        dest: this.props.dest,
      }
    );

    this.fs.copyTpl(
      this.templatePath('_toolbox.json'),
      this.destinationPath('toolbox.json'),
      {
        bootstrap: this.props.bootstrap,
        src: this.props.src,
        dest: this.props.dest,
        assets: this.props.src,
      }
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('assets/base.scss'),
      this.destinationPath(`${this.props.src}components/base.scss`),
      {
        bootstrap: this.props.bootstrap,
        icons: this.props.icons,
      }
    );
    this.fs.write(this.destinationPath(`${this.props.src}config/variables.scss`), '@charset \'utf-8\';\n');

    // Scripts
    this.fs.copyTpl(
      this.templatePath('assets/base.js'),
      this.destinationPath(`${this.props.src}components/base.js`),
      {
        bootstrap: this.props.bootstrap,
        svgIcons: this.props.icons === 'svg',
      }
    );

    // Images
    emptyDirs.push('images');
    // SVG
    emptyDirs.push('svg');
    // Icons
    emptyDirs.push('icons');
    // Fonts
    emptyDirs.push('fonts');
    // Favicons
    this.fs.write(this.destinationPath(`${this.props.src}favicons/README.md`), '# Favicons\n\nGo on [realfavicongenerator.net](https://realfavicongenerator.net) to generate your favicon kit! (and remove this file when done)\n');

    // Icons
    if (this.props.icons === 'svg') {
      this.fs.copy(
        this.templatePath('assets/svg-icons.js'),
        this.destinationPath(`${this.props.src}icons/svg-icons.js`)
      );
    }

    // WE WANT BOOTSTRAP
    if (this.props.bootstrap) {
      this.fs.copyTpl(
        this.templatePath('config/_bootstrap.scss'),
        this.destinationPath(`${this.props.src}config/bootstrap.scss`),
        {
          fromSrcToTop: this.props.fromSrcToTop
        }
      );
    }

    this.fs.copyTpl(
      this.templatePath('config/_styleguide.scss'),
      this.destinationPath(`${this.props.src}config/styleguide.scss`),
      {
        fromSrcToTop: this.props.fromSrcToTop
      }
    );

    emptyDirs.push(
      'components/atoms/',
      'components/molecules/',
      'components/organisms/',
      'components/pages/'
    );

    // Create empty dirs
    for (let dir of emptyDirs) {
      this.fs.write(this.destinationPath(`${this.props.src}${dir}/.gitkeep`), '');
    }

    // Others
    this.fs.write(this.destinationPath('README.md'), `# ${this.props.name}\n\nPlease document your project here!`);
    if (this.props.changelog) {
      this.fs.write(this.destinationPath('CHANGELOG.md'), `# CHANGELOG\n\n## 0.0.0 (${new Date().toLocaleDateString()})\n\n  - init project\n`);
      this.fs.write(this.destinationPath('VERSION'), '0.0.0');
    }

    // Write humans.txt
    if (this.props.humans) {
      const that = this;
      curl.request({ url: 'https://raw.githubusercontent.com/antistatique/humans.txt/master/humans.txt' }, function (err, data) {
        that.fs.write(that.destinationPath('humans.txt'), data);
      });
    }
  }

  async install() {
    let packagesToInstall = [];
    const packages = await this.fs.readJSON(this.templatePath('_packages.json'));

    // Add the required packages
    for (const key in packages.base) {
      packagesToInstall.push([packages.base[key]]);
    }

    this.yarnInstall(packagesToInstall);
  }
};
