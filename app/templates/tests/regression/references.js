var fs      = require('fs'),
    async   = require('../../node_modules/async/lib/async.js'),
    config  = require('regression.json'),
    slug    = require('../../node_modules/slug/slug.js');

var playScenario = function(scenario, viewport, callback) {
  var casper = require('casper').create({
    viewportSize: {
      width: viewport.width,
      height: viewport.height
    }
  });

  casper.start(scenario.url);

  scenario.hidden.forEach(function (hidden) {
    casper.then(function() {
      this.page.injectJs('../../node_modules/jquery/dist/jquery.js');
      this.evaluate(function(hidden) {
        $(hidden).css('opacity', '0');
      }, hidden);
    });
  });

  scenario.selectors.forEach(function (selector) {
    casper.then(function(){
      this.wait(scenario.delay);
      this.captureSelector(config.referencePath + slug(scenario.name).toLowerCase() +'/'+ slug(selector) +'_'+ slug(viewport.name).toLowerCase() +'-'+ viewport.width +'x'+ viewport.height +'.png', selector);
    });
  });

  casper.run(function(){
    callback(null);
  });
}

async.eachSeries(config.scenarios,
  function(scenario, cb1) {
    console.log('Render ' + scenario.name + '...');
    async.eachSeries(config.viewports,
      function(viewport, cb2) {
        playScenario(scenario, viewport, cb2);
      },
      function(err) {
        cb1(null);
    });
  },
  function(err) {
    console.log('All render completed !');
    var casper = require('casper').create();
    casper.start('localhost');
    casper.run(function(){this.exit();})
  }
);
