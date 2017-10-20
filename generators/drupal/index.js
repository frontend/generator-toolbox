'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const pathExists = require('path-exists');
const path = require('path');
const fs = require('fs');
const slug = require('slug');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.promptValues = this.config.getAll().promptValues;
  }

  prompting() {

    const gitConfigPath = path.join(
      process.env.HOME || process.env.USERPROFILE, '.gitconfig'
    );

    const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
    const regex = /email\s*?=\s*?([a-zA-Z0-9]+@.+)/;
    const gitEmail = gitConfig.match(regex)[1];

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your project?',
      default: 'Drupal Project'
    }, {
      type: 'input',
      name: 'database',
      message: 'What\'s the name of your database for this project?',
      default: function (answers) {
        const slugName = slug(answers.name, {lower: true});
        return slugName;
      }
    }, {
      type: 'input',
      name: 'mail',
      message: 'What\'s the email used for the Drupal admin?',
      default: () => {
        if (gitEmail) {
          return gitEmail;
        } else {
          return 'dev@antistatique.net';
        }
      }
    }]).then(answers => {
      this.props = answers;
    });
  }

  async writing() {
    // this.log('Installing Drupal...');
    // this.spawnCommandSync('composer', [
    //   'create-project',
    //   'drupal-composer/drupal-project:8.x-dev',
    //   '.',
    //   '--stability',
    //   'dev',
    //   '--no-interaction'
    // ]);

    // this.log('Installing base Drupal Modules...');
    // this.spawnCommandSync('composer', [
    //   'require',
    //   'drupal/field_group',
    //   'drupal/admin_toolbar',
    //   'drupal/metatag',
    //   'drupal/focal_point',
    //   'drupal/pathauto',
    //   'drupal/redirect',
    //   'drupal/editor_advanced_link'
    // ]);

    // this.log('Removing conflictuous .eslintrc file from Drupal directory...');
    // this.spawnCommandSync('rm', [
    //   'web/.eslintrc.json',
    //   '.travis.yml'
    // ]);

    // this.log('Installing Drupal Code Quality Control Tools...');
    // this.spawnCommandSync('composer', [
    //   'require',
    //   '--dev',
    //   'drupal/coder',
    //   'squizlabs/php_codesniffer:^2.7',
    //   'phpmd/phpmd:^2.6',
    //   'sebastian/phpcpd:^2.0'
    // ]);

    // this.fs.copy(
    //   this.templatePath('post-commit'),
    //   this.destinationPath('./scripts/hooks/post-commit')
    // );
    // this.spawnCommandSync('git', [
    //   'init'
    // ]);
    // this.spawnCommandSync('cat', [
    //   './scripts/hooks/post-commit',
    //   '>>',
    //   './.git/hooks/post-commit'
    // ]);

    // this.fs.copy(
    //   this.templatePath('drushrc.php'),
    //   this.destinationPath('web/drush/drushrc.php')
    // );

    // this.fs.write(this.destinationPath('config/d8/sync/s.gitkeep'), '');

    this.log('Creating database...');
    this.spawnCommandSync('mysql', [
      '-u',
      'root',
      '-p',
      '-e',
      `'create database if not exists \`${this.props.database}\`;'`
    ]);

    // this.spawnCommandSync('drush', [
    //   'si',
    //   'standard',
    //   `--db-url=mysql://root:@127.0.0.1/${this.props.database}`,
    //   `--site-name="${this.props.database}"`,
    //   '--account-name=admin',
    //   '--account-pass=admin ',
    //   `--account-mail=${this.props.mail}`
    // ]);

    // this.spawnCommandSync('drush',
    //   'config-get',
    //   '"system.site"',
    //   'uuid'
    // );
  }

};
