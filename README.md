# Toolbox Generator

## ⚠️ Deprecated in favor of [**Storybox**](https://github.com/frontend/storybox) ⚠️

[![toolbox](toolbox.png)](http://frontend.github.io/toolbox)

This generator sets up the perfect Bootstrap boilerplate for your project's styleguide. It will generate all the files you need to use [bootstrap-sass](https://github.com/twbs/bootstrap-sass) with the amazing [Fabricator](https://github.com/fbrctr/fabricator) tool.

We plan on adding some various options or sub-generators to gernerate a startertheme for Wordpress or Drupal. TBD.

This generator is built with [Yeoman](https://github.com/yeoman/generator).

### [Check the doc !](http://frontend.github.io/toolbox)

## Installation

```shell
$ npm install -g generator-toolbox
```

Then run the Yeoman Generator by running this:

```shell
$ cd /path-to/your/project
$ yo toolbox
```

## Options available

You can use the flag `--skip-install` if you wish to installl all npm and bower dependencies later.

## Build the styleguide / toolbox

To build the styleguide, we provide a wide range of gulp tasks. These are the ones you might need:

- Build the styleguide and watch for change (including browser-sync reloads) (optional `--production` flag): `$ gulp serve`
- Build the styleguide in production server: `$ gulp build`
- Deploy the `/styleguide` folder on your `gh-pages` branch: `$ gulp deploy`

More details in the [documentation](http://frontend.github.io/toolbox)

## License

[MIT License](http://opensource.org/licenses/mit-license.php)
