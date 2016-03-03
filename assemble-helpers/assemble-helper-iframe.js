module.exports.register = function (Handlebars, options, params) {
  "use strict";

  var grunt = require("grunt")

  var basePath = require("path").dirname(grunt.option("gruntfile"));
  var gruntFileConfig = basePath + "/gruntfileConfig.json";
  var config = grunt.file.readJSON(gruntFileConfig);

  Handlebars.registerHelper("iframe", function (file, width, height) {

    // We add the extra . in front of config.examples because the default path
    // is ./examples, but we want a relative path of ../
    // Sort of hacky, but ¯\_(ツ)_/¯
    return new Handlebars.SafeString("<iframe src='." + config.examples + "/" + file + ".html' width='" + width + "' height='" + height + "'></iframe>");
  });
};
