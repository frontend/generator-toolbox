var fs         = require('fs'),
    config     = require('./regression.json'),
    slug       = require('slug'),
    colorizer  = require('../../node_modules/casperjs/modules/colorizer.js').create('Colorizer');

var total      = 0,
    failed     = 0;

console.log(colorizer.colorize("REGRESSION TESTS STARTED...", "PARAMETER"));
casper.start(config.scenarios[0].url);

config.scenarios.forEach(function (scenario) {
  casper.thenOpen(scenario.url);

  casper.then(function(){
    console.log(colorizer.colorize("\n# "+scenario.name, "COMMENT"));
  });

  config.viewports.forEach(function (viewport) {
    casper.viewport(viewport.width, viewport.height);

    scenario.selectors.forEach(function (selector) {
      var file = slug(scenario.name).toLowerCase() +'/'+ slug(selector) +'_'+ slug(viewport.name).toLowerCase() +'-'+ viewport.width +'x'+ viewport.height +'.png';

      phantomcss.init({
        failedComparisonsRoot: 'tests/regression/compare',
        mismatchTolerance: config.tolerance,
        onFail: function(test){
          total ++;
          failed ++;
          console.error("  " + colorizer.colorize("✘ ", "WARNING") + test.filename.split('/')[test.filename.split('/').length - 1] +' with '+ colorizer.colorize(test.mismatch, "WARNING"));
        },
        onPass: function(test){
          total ++;
          console.log("  " + colorizer.colorize("✔ ", "INFO") + test.filename.split('/')[test.filename.split('/').length - 1]);
        }
      });

      casper.then(function(){
        this.wait(scenario.delay);
        phantomcss.compareFiles(config.referencePath + file, config.tempPath + file);
      });

    });
  });
});

casper.then(function() {
  if (failed === 0) {
    console.error(colorizer.colorize("\n  RESULTS:     "+total+'/'+total+' tests successfully passed!    ', 'GREEN_BAR') + "\n");
  } else {
      console.log(colorizer.colorize("\n  RESULTS:     "+failed+'/'+total+' tests failed    ', 'RED_BAR') + "\n");
  }
});
