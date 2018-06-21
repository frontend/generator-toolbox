'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const slug = require('slug');
const curl = require('curlrequest');

const checkUpdate = require('../check-update');

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
  async prompting() {
    await checkUpdate().then(res => this.log(res));

    // Have Yeoman greet the user.
    this.log(toolboxSay());

    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the name of your project?',
        default: 'Toolbox'
      }, {
        type: 'input',
        name: 'repo',
        message: 'What\'s the git URL of your repo?',
        default: function (answers) {
          const slugName = slug(answers.name, {lower: true});
          return `git@github.com:antistatique/${slugName}.git`;
        },
        store: true,
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
        type: 'input',
        name: 'atomic',
        message: 'What kind of components hierarchy do you want to use ?\n  Separated by a less-than sign (<)',
        store: true,
        default: 'atoms<molecules<organisms',
        validate: (input) => {
          if (!input.includes('<') || input.includes(' ')) {
            this.log(`\n${chalk.red('  Please enter a valid hierarchy using "<" and no spaces')}\n`);
            return false;
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'src',
        message: 'Where would you like to put your assets?',
        default: 'assets/',
        store: true
      }, {
        type: 'input',
        name: 'dest',
        message: 'Where would you like to put your build?',
        default: (answers) => {
          return answers.src.indexOf('assets') !== -1 ? answers.src.replace(/assets\/?$/, 'build/') : 'build/'; // eslint-disable-line
        },
        store: true
      }
    ])
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

      // Store 'svg' for icons, maybe we'll add a FontAwesome option later.
      answers.icon = 'svg';

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
        repo: this.props.repo,
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
        remote: this.props.remote
      }
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copyTpl(
      this.templatePath('_publish.sh'),
      this.destinationPath('publish.sh'),
      {
        dest: this.props.dest
      }
    );

    this.fs.copyTpl(
      this.templatePath('assets/base.scss'),
      this.destinationPath(`${this.props.src}components/base.scss`),
      {
        bootstrap: this.props.bootstrap,
        atomic: this.props.atomic.split('<'),
        icons: 'svg',
      }
    );
    this.fs.write(this.destinationPath(`${this.props.src}config/variables.scss`), '@charset \'utf-8\';\n');

    // Scripts
    this.fs.copyTpl(
      this.templatePath('assets/base.js'),
      this.destinationPath(`${this.props.src}components/base.js`),
      {
        bootstrap: this.props.bootstrap,
        svgIcons: true,
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
    this.fs.copy(
      this.templatePath('assets/svg-icons.js'),
      this.destinationPath(`${this.props.src}icons/svg-icons.js`)
    );

    // WE WANT BOOTSTRAP
    if (this.props.bootstrap) {
      this.fs.copyTpl(
        this.templatePath('config/_bootstrap.scss'),
        this.destinationPath(`${this.props.src}config/bootstrap.scss`),
        {
          fromSrcToTop: this.props.fromSrcToTop
        }
      );
      const that = this;
      curl.request({url: 'https://raw.githubusercontent.com/twbs/bootstrap/v4-dev/scss/_variables.scss'}, function (err, data) {
        that.fs.write(that.destinationPath(`${that.props.src}config/bootstrap-variables.scss`), data);
      });
    }

    this.fs.write(this.destinationPath(`${this.props.src}config/styleguide.scss`), "@charset 'utf-8';\n\n@import 'variables';\n");
    this.fs.write(this.destinationPath(`${this.props.src}config/data.json`), "{\n  \n}\n");
    this.fs.write(this.destinationPath(`${this.props.src}config/colors.json`), '{\n  "Black": "#000",\n  "White": "#fff"\n}\n');

    emptyDirs.push(
      ...this.props.atomic.split('<').map(item => `components/${item}/`),
      'components/pages/'
    );

    // Create empty dirs
    for (let dir of emptyDirs) {
      this.fs.write(this.destinationPath(`${this.props.src}${dir}/.gitkeep`), '');
    }
    // Create docs dir
    this.fs.write(this.destinationPath('docs/index.md'), `# ${this.props.name}\n\nThis is the homepage content.`);

    // Others
    this.fs.write(this.destinationPath('README.md'), `# ${this.props.name}\n\nPlease document your project here!\n\n## To start\n- **serve** your project : \`$ yarn start\`\n- **build** your project : \`$ yarn build\`\n- **deploy** your gh-pages : \`$ yarn deploy\`\n- **publish** your frontend build : \`$ sh ./publish.sh VERSION<0.0.0> ON_NPM<true>\`\n`);
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
