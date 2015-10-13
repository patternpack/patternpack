module.exports.register = function (Handlebars, options, params) {
  "use strict";

  var grunt = require("grunt")

  var basePath = require("path").dirname(grunt.option("gruntfile"));
  var gruntFileConfig = basePath + "/gruntfileConfig.json";
  var config = grunt.file.readJSON(gruntFileConfig);

  Handlebars.registerHelper("cssFileName", function() {
    return config.css.fileName + ".css";
  })
};
