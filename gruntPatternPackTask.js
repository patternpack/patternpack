module.exports = function (grunt) {
  "use strict";

  var log = require("./gruntLogHelper.js")(grunt);
  var _ = require("lodash");
  _.defaultsDeep = require("merge-defaults"); // Add deep defaults capabilities to lodash

  var gruntTaskName = "patternpack";
  var gruntTaskDescription = "Creates a pattern library from structured markdown and styles.";
  var optionDefaults = {
    // Paths for input and output
    release: "./dist",
    build: "./html",
    src: "./src",
    assets: "./src/assets",
    theme: "./node_modules/patternpack-example-theme",

    // Operation to run (default|build|release)
    // TODO: consider using a flag for the "MODE" of operation (dev|build|release)
    // task: "build",

    // TODO: Implement the ability to only publish certain resources (css|library|patterns)
    publish: {
      library: true,
      patterns: false
    },
    patternStructure: [
      { name: "Atoms", path: "atoms" },
      { name: "Molecules", path: "molecules" },
      { name: "Pages", path: "pages" }
    ],
    patternPackName: "patternpack"
  };

  function setupOptions(optionOverrides) {
    var path = require("path");
    var fs = require("fs");

    // Override the defaults with any user specified options
    var options = _.defaultsDeep(_.cloneDeep(optionOverrides), optionDefaults);

    // Use the patternPackName to figure out the path, and ensure it exists
    // TODO: Figure out how to abstract this path creation.  It is also used in the gruntRunner.js
    options.packagePath = "./node_modules/" + options.patternPackName;
    if (!fs.existsSync(options.packagePath)) {
      throw new Error("The path to the pattern pack dependency does not exists at: " + options.packagePath);
    }

    // Add the relative path to the root of the calling pattern library
    options.root = path.relative(options.packagePath, "");

    // Massage any paths to be relative to the child process
    options.release = path.relative(options.packagePath, options.release);
    options.build = path.relative(options.packagePath, options.build);
    options.src = path.relative(options.packagePath, options.src);
    options.assets = path.relative(options.packagePath, options.assets);
    // If the pattern is specified by the user then get the relative path,
    // otherwise use the path inside pattern pack to provide the default patterns.
    options.theme = optionOverrides.theme ? path.relative(options.packagePath, options.theme) : optionDefaults.theme;

    return options;
  }

  function saveOptions(options) {
    var file = options.packagePath + "/gruntfileConfig.json";
    var contents = JSON.stringify(options);
    grunt.file.write(file, contents);
  }

  function gruntPatternPackTask() {
    var done = this.async();

    // Get the options
    var options = setupOptions(this.options());
    log.verbose("PatternPack options:");
    log.verbose(options);

    // Save the options
    // Since I haven"t figured out how to pass the options from the command
    // save the options to a file that can then be used by the child grunt task.
    saveOptions(options);
    // TODO: FIX THIS.  Pass the options to the command!

    // Create the options required to run the child grunt process
    var gruntRunner = require("./gruntRunner.js")(grunt);
    var gruntRunnerOptions = {
      name: options.patternPackName,
      tasks: options.task,
      flags: grunt.option.flags()
    };

    log.verbose("PatternPack configured to run:");
    log.verbose(gruntRunnerOptions);
    log.verbose("PatternPack running...");
    gruntRunner.run(gruntRunnerOptions, done);
  }

  grunt.registerMultiTask(gruntTaskName, gruntTaskDescription, gruntPatternPackTask);
};
