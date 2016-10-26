module.exports.register = function (Handlebars, options, params) {
  "use strict";

  var grunt = require("grunt")

  var gruntfilePath = grunt.option("gruntfile") || ".";
  var basePath = require("path").dirname(gruntfilePath);
  var gruntFileConfig = basePath + "/gruntfileConfig.json";
  var config = grunt.file.readJSON(gruntFileConfig);

  Handlebars.registerHelper("logo", function() {
    return config.logo;
  })
};
