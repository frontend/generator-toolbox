'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fs = require('fs');

const checkUpdate = require('../check-update');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.promptValues = this.config.getAll().promptValues;
  }

  async prompting() {
    await checkUpdate().then(res => this.log(res));

    return this.prompt([{
      type: 'list',
      name: 'tools',
      message: 'What kind of tool do you need',
      choices: [
        {
          name: `The ${chalk.yellow('publisher')} to create dist tagged branchs and to publish those dist to NPM`,
          value: 'publisher'
        }
      ]
    }]).then(answers => {
      this.props = answers;
    });
  }

  async writing() {
    switch (this.props.tools) {
      case 'publisher':
        this.fs.copyTpl(
          this.templatePath('_publish.sh'),
          this.destinationPath('publish.sh'),
          {
            dest: this.promptValues.dest
          }
        );
        break;

      default:
        break;
    }
  }

};
