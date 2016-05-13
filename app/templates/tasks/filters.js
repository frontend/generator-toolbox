'use strict';

var swig          = require('swig'),
    marked        = require('marked');

module.exports = function() {

  swig.setFilter('markdown', function (string) {
    return marked(string);
  });

  swig.setFilter('dump', function (input) {
    return JSON.stringify(input, null, 2);
  });

};
