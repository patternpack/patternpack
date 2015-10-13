module.exports.register = function (Handlebars, options, params) {
  "use strict";

  var grunt = require("grunt")

  var gruntFileConfig = "../gruntfileConfig.json";
  var config = grunt.file.readJSON(gruntFileConfig);

  Handlebars.registerHelper("cssFileName", function() {
    return config.css.fileName + ".css";
  })
};
