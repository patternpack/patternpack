module.exports = function (grunt) {
  "use strict";

  var log = require("../gruntLogHelper.js")(grunt);
  var fs = require("fs");
  var path = require("path");
  var _ = require("lodash");
  _.defaultsDeep = require("merge-defaults"); // Add deep defaults capabilities to lodash

  var packagePath = "./" + path.relative(process.cwd(), path.dirname(__dirname)); // "./node_modules/patternpack"
  var packageName = path.basename(packagePath); // "patternpack"
  var tasksValues = ["default", "build", "integrate", "release", "release-patch", "release-minor", "release-major", "", undefined];
  var cssPreprocessorValues = ["less", "sass", "none", "", undefined];
  var gruntTaskName = "patternpack";
  var gruntTaskDescription = "Creates a pattern library from structured markdown and styles.";
  var optionsOverrideFileName = ".patternpackrc";
  var optionDefaults = {
    // Paths for input and output
    release: "./dist",
    build: "./html",
    src: "./src",
    assets: "./src/assets",
    theme: "patternpack-example-theme",
    logo: "/theme-assets/images/logo.svg",

    // Operation to run (default|build|release)
    // TODO: consider using a flag for the "MODE" of operation (dev|build|release)
    // task: "build",

    // Configure our CSS
    css: {
      preprocessor: "sass",     // which preprocessor we should use (sass|less|none)
      fileName: "patterns",      // the name for our final CSS file that will import everything
      autoprefixer: {
        browsers: ["last 2 versions"]
      }
    },

    // Configures the ability to only publish certain resources (css|library|patterns)
    publish: {
      library: true,
      patterns: false
    },

    // Configures the pattern hierarchy.
    patternStructure: [
      { name: "Atoms", path: "atoms" },
      { name: "Molecules", path: "molecules" },
      { name: "Pages", path: "pages" }
    ],
    server: {
      port: 8888
    }
  };

  function getPathOrPackagePath(path) {
    var packagePath;

    // Attempt to find the configured location
    if (fs.existsSync(path)) {
      packagePath = path;
    }

    // If not found, look for the path as a node package
    if (!packagePath) {
      packagePath = getPackagePath(path);
    }

    if (!packagePath) {
      throw new Error("Could not find package: " + path);
    }

    return packagePath;
  }

  function getPackagePath(name) {
    var currentPath = "./" + path.relative(process.cwd(), path.dirname(__dirname));
    var dependencyPaths = [
      "./node_modules/",
      "../node_modules/",
      currentPath + "/node_modules/"
    ];

    // Look for the package in any of the node_modules locations
    var packageDependencyPath = _.find(dependencyPaths, function(path) {
      return fs.existsSync(path + name);
    });

    // Return the validated location of the package
    // Otherwise return undefined
    return packageDependencyPath ? packageDependencyPath + name : undefined;
  }

  function applyOverrides(value, overrideValue) {
    return _.defaultsDeep(_.cloneDeep(overrideValue), value);
  }

  function getOptions(context) {
    var options = {};
    var optionOverrides = context.options();
    var optionOverridesFile = grunt.file.exists(optionsOverrideFileName) ? grunt.file.readJSON(optionsOverrideFileName) : {};

    // If the task is allowed then use it as the default value.
    // Otherwise leave the task blank, which will result in "default" being called
    if (_.contains(tasksValues, context.target)) {
      optionDefaults.task = context.target;
    }

    // Override the defaults with any user specified options
    // Apply overrides from the .patternpackrc file
    // then apply the overrries from the gruntfile options
    options = applyOverrides(optionDefaults, optionOverrides);
    options = applyOverrides(options, optionOverridesFile);

    // Resolve the theme path either from a path or from a package name
    log.verbose("Theme paths");
    log.verbose("Default: " + optionDefaults.theme);
    log.verbose("Override: " + optionOverrides.theme);
    options.theme = optionOverrides.theme ?  optionOverrides.theme : optionDefaults.theme;
    options.theme = getPathOrPackagePath(options.theme);
    options.theme = path.relative(packagePath, options.theme)
    log.verbose("Resolved: " + options.theme);

    return options;
  }

  function transformOptions(options) {
    // Add the relative path to the root of the calling pattern library
    options.root = path.relative(packagePath, "");

    // Massage any paths to be relative to the child process
    options.release = path.relative(packagePath, options.release);
    options.build = path.relative(packagePath, options.build);
    options.src = path.relative(packagePath, options.src);
    options.assets = path.relative(packagePath, options.assets);

    // Resolve the application integration path if the user has provided it
    if (options.integrate) {
      options.integrate = path.relative(packagePath, options.integrate);
    }

    return options;
  }

  function saveOptions(options) {
    var file = packagePath + "/gruntfileConfig.json";
    var contents = JSON.stringify(options);
    grunt.file.write(file, contents);
  }

  function ensureOptions(options, name, allowedValues, allowFalsey) {
    var value = options[name];
    if (!_.contains(allowedValues, value)) {
      log.log("Allowed values for " + name + "");
      log.log(allowedValues);
      throw new Error("The option " + name + " was set to an unacceptable value: " + value);
    }
  }

  function ensureFilesExist(options) {
    // TODO: File generation should be enhanced to use templates rather than
    //       the current implementation that generates the files inline.
    var mkdirp = require("mkdirp");

    // Create core css file if it does not exist
    var coreCssExtension = options.css.preprocessor === "sass" ? "scss" : options.css.preprocessor;
    var coreCssFileName = options.css.fileName + "." + coreCssExtension;
    var coreCssDirectory = options.assets + "/" + options.css.preprocessor;
    var coreCssPath = coreCssDirectory + "/" + coreCssFileName;

    if (!fs.existsSync(coreCssPath)) {
      log.verbose("Generating the core CSS file: " + coreCssPath);
      mkdirp.sync(coreCssDirectory);
      fs.writeFileSync(coreCssPath, '@import "_patternpack-patterns";');    // TODO: Make this a template based on Sass/LESS - LESS requires the underscore
    }

    // Create the dirctories for the pattern structure if they do not exist
    _.each(options.patternStructure, function(pattern) {
      if (!fs.existsSync(options.src + "/" + pattern.path)) {
        log.verbose("Generating the pattern directory: " + options.src + "/" + pattern.path);
        fs.mkdir(options.src + "/" + pattern.path);
      }
    });

    // Generate a placeholder index.md file
    var indexFile = options.src + "/index.md";
    if (!fs.existsSync(indexFile)) {
      log.verbose("Generating the index file: " + coreCssPath);
      fs.writeFileSync(indexFile, '# Welcome to PatternPack');
    }
  }

  function gruntPatternPackTask() {
    var done = this.async();

    // Ensure that the packagePath exists.
    // TODO: Figure out how to abstract this path creation.  It is also used in the gruntRunner.js
    if (!fs.existsSync(packagePath)) {
      throw new Error("The path to the pattern pack dependency does not exists at: " + packagePath);
    }

    // Get the options
    var options = getOptions(this);

    // Ensure option values are set to acceptable values
    // and files/directories are present
    ensureOptions(options, "task", tasksValues);
    ensureOptions(options.css, "preprocessor", cssPreprocessorValues);
    ensureFilesExist(options);

    // Change the options to be relative to the patternpackage package
    options = transformOptions(options);
    log.verbose("PatternPack options:");
    log.verbose(options);

    // Save the options
    // Since I haven"t figured out how to pass the options from the command
    // save the options to a file that can then be used by the child grunt task.
    saveOptions(options);
    // TODO: FIX THIS.  Pass the options to the command!

    // Create the options required to run the child grunt process
    var gruntRunner = require("../gruntRunner.js")(grunt);
    var gruntRunnerOptions = {
      name: packageName,
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
