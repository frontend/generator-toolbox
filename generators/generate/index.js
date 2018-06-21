'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fs = require('fs');
const yaml = require('node-yaml');
const slug = require('slug');

const checkUpdate = require('../check-update');

const defaultStructure = [
  {
    name: 'Atom',
    value: 'atoms'
  }, {
    name: 'Molecule',
    value: 'molecules'
  }, {
    name: 'Organism',
    value: 'organisms'
  }
];

const pages = [
  {
    name: 'Page',
    value: 'pages'
  }, {
    name: 'Doc Page',
    value: 'doc'
  }
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.promptValues = this.config.getAll().promptValues;

    // Exit if no config file is found.
    if (!pathExists.sync(this.destinationPath('toolbox.json'))) {
      this.log(chalk.red('No toolbox.json was found!') + '\nMake sure your toolbox.json is at the project root.');
      process.exit(1);
    }
  }

  async prompting() {
    await checkUpdate().then(res => this.log(res));

    let fileStructure = [...defaultStructure, ...pages];
    if (this.promptValues.atomic) {
      const currentStructure = this.promptValues.atomic.split('<').map((item) => ({
        name: item,
        value: item,
      }));
      fileStructure = [...currentStructure, ...pages];
    }

    return this.prompt([{
      type: 'list',
      name: 'type',
      message: 'What kind of component do you want?',
      choices: fileStructure
    }, {
      type: 'input',
      name: 'name',
      message: 'What\'s the title of your component?',
      default: 'My Component'
    }]).then(answers => {
      answers.slug = slug(answers.name, {lower: true});

      this.props = answers;
    });
  }

  async writing() {
    if (this.props.type !== 'doc') {
      const componentPath = `${this.promptValues.src}components/${this.props.type}/${this.props.slug}`;
      const filePath = `${componentPath}/${this.props.slug}`;

      // Kill process if the component is already created
      if (pathExists.sync(this.destinationPath(componentPath))) {
        this.log(chalk.red(`The "${this.props.name}" component already exists!`) + '\nPlease choose another name.');
        process.exit(1);
      }

      // Generate Twig file
      await this.fs.write(
        this.destinationPath(`${filePath}.twig`),
        `<!-- 🛠 ${this.props.name} component -->\n`
      );

      // Generate YAML file
      const config = {
        name: this.props.slug,
        title: this.props.name,
        notes: `Describe the ${this.props.slug} component here.\n`,
        wrapper: '',
        background: '',
      };

      if (!fs.existsSync(componentPath)) {
        await fs.mkdirSync(componentPath);
      }
      await yaml.write(this.destinationPath(`${filePath}.yml`), config);
      this.log(chalk.green(`   create`) + ` ${filePath}.yml`);

      if (this.props.type !== 'pages') {
        // Generate SCSS file
        this.fs.write(
          this.destinationPath(`${filePath}.scss`),
          '@charset \'utf-8\';\n'
        );

        // Import the SCSS file in base.scss
        const mainCSS = this.destinationPath(`${this.promptValues.src}/components/base.scss`);
        if (pathExists.sync(mainCSS)) {
          let body = await fs.readFileSync(mainCSS).toString();
          const importer = `@import '${this.props.type}/${this.props.slug}/${this.props.slug}';\n`;

          // Add the line only if not already there
          if (body.indexOf(importer) < 0) {
            // Regex to append the new line at the end of the whole block of code
            const regex = new RegExp(`(\/\/ ${this.props.type}:\n(?:.+\n)*)`);
            body = body.replace(regex, '$1' + importer);
            fs.writeFileSync(mainCSS, body);
            this.log(chalk.yellow(`   update`) + ' base.scss');
          } else {
            this.log(chalk.red(`${importer} was already found!`) + '\nMake sure your component doesn\'t already exist.');
          }
        } else {
          this.log(chalk.red(`We couldn't find the "base.scss" file.`) + `\nPlease manually update your main scss file to import the new "${this.props.slug}.scss".`);
        }
      }
    } else {
      // Generate Markdown file
      this.fs.write(
        this.destinationPath(`docs/${this.props.slug}.md`),
        `# ${this.props.name}\n`
      );
    }
  }

};
