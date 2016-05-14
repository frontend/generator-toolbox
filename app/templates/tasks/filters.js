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

  swig.setFilter('get', function (array, value) {
    var obj = {};
    if (array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].data.sys.id == value) {
          obj = array[i];
        }
      }
    }
    return obj;
  });

};
