module.exports = function (grunt) {
  "use strict";

  var log = require("./gruntLogHelper.js")(grunt);
  var _ = require("lodash");

  function getPathFromName(name) {
    if (!name) {
      throw new Error("The name of the package containing the gruntfile was not specified.");
    }

    var packagePath = "./node_modules/" + name;

    // TODO: Ensure path exists
    // var path = require("path");
    // path.dirname(packagePath);

    return packagePath;
  }

  function getTasks(tasks) {
    // Use the default task if it is not specified
    if (_.isEmpty(tasks)) {
      tasks = ["default"];
    }

    // Ensure that the tasks are specified properly
    if(!_.isString(tasks) && !_.isArray(tasks)) {
      throw new Error("The task(s) must be specified by its name or an arrary of task names");
    }

    // If the user specified a string, make it into an array for ease of use
    if (_.isString(tasks)) {
      tasks = [tasks];
    }

    return tasks;
  }

  function getGruntCommand() {
    var isWindows = process.platform === "win32";
    return isWindows ? "grunt.cmd" : "grunt";
  }

  function getCommandConfig(args) {
    return {
      stdio: "inherit",
      args: args,
      env: process.env
    };
  }

  function executeCommand(cmd, args, config, callback) {
    var spawn = require("child_process").spawn;
    var command = spawn(cmd, args, config);
    command.on("close", function(code) {
      callback(code === 0);
    });
  }

  function run(options, done) {
    // Determine the location where grunt should be run, and store the current location
    var gruntPath = getPathFromName(options.name);
    var originalPath = process.cwd();

    var command = getGruntCommand();
    var commandArgs = getTasks(options.tasks).concat(options.flags); // Pass any command line args to the child grunt task.
    var commandConfig = getCommandConfig(gruntPath, commandArgs);

    // Log the command with arguments
    var commandString = command;
    for (var i = 0; i < commandArgs.length; i++) { commandString += " " + commandArgs[i]; }
    log.verbose(commandString);

    process.chdir(gruntPath);
    executeCommand(command, commandArgs, commandConfig, function(success) {
      process.chdir(originalPath);
      done(success);
    });
  }

  return {
    run: run
  };
};
