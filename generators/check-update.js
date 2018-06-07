const latestVersion = require('latest-version');
const chalk = require('chalk');
const pkg = require('./../package.json');

// Display update notification if it's not the last version
module.exports = () => latestVersion('generator-toolbox').then(version => {
  if (version !== pkg.version) {
    const msg = ` Version ${version} (current ${pkg.version}) of generator-toolbox is available ! `;
    return `
${chalk.white.bgRed.bold(` ${' '.repeat(msg.length)} \n ${msg} \n${' '.repeat(msg.length)}  `)}

To update your beloved generator, do :
$ ${chalk.green('yarn global upgrade generator-toolbox')} (recommended)
or
$ ${chalk.green('npm -g install generator-toolbox')}
    `;
  }
  return null;
});
