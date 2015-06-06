var chai      = require("chai"),
    should    = chai.should(),
    expect		= chai.expect,
    config		= require('./../../gulp_config.json'),
    script    = '<%= slug(name).toLowerCase() %>.js';

describe('Testing <%= slug(name).toLowerCase() %>.js', function () {
  before(function () {
    // Something before to start
  })

  it('be like that', function () {
    // Start your tests here
  });
});
