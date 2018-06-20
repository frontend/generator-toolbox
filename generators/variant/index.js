'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fs = require('fs');
const autocomplete = require('inquirer-autocomplete-prompt');
const yaml = require('node-yaml');
const slug = require('slug');

const checkUpdate = require('../check-update');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.env.adapter.promptModule.registerPrompt('autocomplete', autocomplete);

    this.promptValues = this.config.getAll().promptValues;

    let dirs = ['atoms', 'molecules', 'organisms'];
    if (this.promptValues.atomic) dirs = this.promptValues.atomic.split('<');
    this.components = [];

    dirs.forEach(dir => {
      let files = fs.readdirSync(`${this.promptValues.src}components/${dir}`);

      // ignore files
      const ignoreFiles = ['.gitkeep', '.DS_Store'];
      ignoreFiles.forEach(file => {
        const index = files.indexOf(file);
        if (index > -1) {
          files = [...files.slice(0, index), ...files.slice(index + 1)];
        }
      });

      files.forEach(file => this.components.push({component: file, category: dir}));
    });

    // Exit if no config file is found.
    if (!pathExists.sync(this.destinationPath('toolbox.json'))) {
      this.log(chalk.red('No toolbox.json was found!') + '\nMake sure your toolbox.json is at the project root.');
      process.exit(1);
    }
  }

  async prompting() {
    await checkUpdate().then(res => this.log(res));

    const choices = this.components.map(component => ({
      name: component.component,
      value: component
    }));

    return this.prompt([{
      type: 'autocomplete',
      name: 'component',
      message: 'Which component do you want to extend?',
      source: (answers, input) =>
        Promise.resolve(
          input ? choices.filter(choice => choice.name.indexOf(input) >= 0) : choices
        )
    }, {
      type: 'input',
      name: 'variant',
      message: 'What\'s the title of the new variant?',
      validate: (value, answers) => {
        if (!value) {
          return 'You have to provide a variant name.';
        }

        const currentVariants = fs.readdirSync(`${this.promptValues.src}components/${answers.component.category}/${answers.component.component}`);
        const newVariant = `${answers.component.component}-${value.toLowerCase()}.twig`;
        const pass = !currentVariants.includes(newVariant);

        if (pass) {
          return true;
        }

        return `The variant ${chalk.cyan(value)} already exists.`;
      }
    }]).then(answers => {
      this.props = answers;
    });
  }

  async writing() {
    const slugName = slug(this.props.variant, {lower: true});
    const variant = {
      name: slugName,
      title: this.props.variant,
      notes: `Describe the ${slugName} variant here.\n`,
      background: '',
      wrapper: '',
    };

    const variantPath = `${this.promptValues.src}components/${this.props.component.category}/${this.props.component.component}/${this.props.component.component}`;

    // Generate Twig file
    this.fs.write(
      this.destinationPath(`${variantPath}-${variant.name}.twig`),
      `<!-- 🛠 Variant ${variant.title} -->\n`
    );

    // Generate Config in YAML file
    const configPath = this.destinationPath(`${variantPath}.yml`);
    const config = yaml.readSync(configPath);

    config.variants = config.variants ? [...config.variants, variant] : [variant];
    yaml.write(this.destinationPath(configPath), config);
  }

};
