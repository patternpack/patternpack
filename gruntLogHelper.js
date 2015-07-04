module.exports = function (grunt) {
  "use strict";

  var util = require("util");
  var defaultConfig = {
    colors: true,
    showHidden: false,
    depth: null
  };

  function log(value, config) {
    writeln(grunt.log, value, config);
  }

  function verbose(value, config) {
    writeln(grunt.verbose, value, config);
  }

  function writeln(writer, value, config) {
    writer.writeln(util.inspect(value, config || defaultConfig));
  }

  return {
    log: log,
    verbose: verbose
  };
};
