var fs      = require('fs'),
    config  = require('regression.json'),
    slug    = require('../../node_modules/slug/slug.js');

config.scenarios.forEach(function (scenario) {
  config.viewports.forEach(function (viewport) {

    var casper = require('casper').create({
      viewportSize: {
        width: viewport.width,
        height: viewport.height
      }
    });

    casper.start(scenario.url);

    scenario.hidden.forEach(function (hidden) {
      casper.then(function() {
        this.page.injectJs('../../bower_components/jquery/dist/jquery.js');
        this.evaluate(function(hidden) {
          $(hidden).css('opacity', '0');
        }, hidden);
      });
    });

    scenario.selectors.forEach(function (selector) {
      casper.then(function(){
        this.wait(scenario.delay);
        this.captureSelector(config.tempPath + slug(scenario.name).toLowerCase() +'/'+ slug(selector) +'_'+ slug(viewport.name).toLowerCase() +'-'+ viewport.width +'x'+ viewport.height +'.png', selector);
      });
    });

    casper.run(function(){
      this.echo('Temporary capture completed !');
      this.exit();
    });

  });
});