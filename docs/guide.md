# Getting Started with PatternPack

## Creating a New PatternPack
The idea behind PatternPack is to extract the styles from your application and move them into a separate repository where they can be shared between one or multiple projects.

You have multiple methods to generate a Pattern Library:

- Build your own configuration (covered in this section)
- Start with the [example library](https://github.com/patternpack/patternpack-example-library) ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#start-with-the-example-pattern-library))
- Use Yeoman Generator ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#use-the-yeoman-generators))

If you're starting with the example library or Yeoman, go ahead and skip to [the next section](LINK).

The first step is to initialize a new project with a Git repository: create a new directory and run `git init`.

### Project Dependencies
Once your new project is created, you'll need to get a few dependencies set up:

- `npm init` and follow the prompts to generate a node project
- `npm install grunt --save-dev` to install grunt
- `npm install patternpack --save-dev` to install PatternPack

At this point, we've got project dependencies ready.

### Basic Configuration
PatternPack is a grunt plugin, so you'll need to create a `gruntfile.js` in your project's root directory and add PatternPack to it:

#### gruntfile.js
```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      options: {},
      run: {},
      build: {},
      release: {}
    }
  });

  grunt.loadNpmTasks('patternpack');
}
```

This grunt configuration exposes three tasks to your project:

- `patternpack:run` which starts up the development environment
- `patternpack:build` which generates the web server files
- `patternpack:release`, which exposes the versioning and release tasks

It is recommended that you extend your gruntfile with a default task:

```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      options: {},
      run: {},
      build: {},
      release: {}
    }
  });

  grunt.loadNpmTasks('patternpack');

  grunt.registerTask('default', ['patternpack:run']);
}
```

This exposes the `grunt` command to generate your pattern library and start up a development environment.

### Advanced Configuration
PatternPack provides smart defaults, however it can be extensively configured to suit your needs. Here is what the PatternPack grunt task looks like with all options set to default:

```js
patternpack: {
  options: {
    src: "./src",
    build: "./html",
    release: "./dist",
    assets: "./src/assets",
    integrate: "../patternpack-example-app/node_modules/patternpack-example-library",
    theme: "./node_modules/patternpack-example-theme",
    publish: {
      library: true,
      patterns: false
    },
    cssPreprocessor: "sass",
    patternStructure: [
      { name: "Atoms", path: "atoms" },
      { name: "Molecules", path: "molecules" },
      { name: "Pages", path: "pages" }
  },
  run: {
    task: "start"
  },
  build: {
    task: "server"
  },
  release: {
    task: "release"
  }
}
```

There are a few options you might want to customize early on based on your needs:

- `cssPreprocessor` - defaults to Sass, but LESS is available as well ([documentation](https://github.com/patternpack/patternpack#csspreprocessor))
- `patternStructure` - the major categories you will use to organize your Patterns ([documentation](https://github.com/patternpack/patternpack#patternstructure) and [example](https://github.com/patternpack/patternpack#custom-pattern-structure))

### Directory & File Configuration
Before you're ready to start, you'll need to add a few default files and directories to your project. The directories and files you need to create are based on what you configured in your `patternpack:options`.

#### src
Reads From: [`options.src`](https://github.com/patternpack/patternpack#src)  
Default: `./src`

Where your source files will live.

#### patternStructure
Reads From: [`options.patternStructure.path`](https://github.com/patternpack/patternpack#patternstructure)  
Default: `./src/atoms`, `./src/molecules`, `./src/pages`

These folders will house your pattern files

#### index.md
Default: `./src/index.md`

The content for the home page of your Pattern Library. It'll need a YAML title at the top. For example:

```
---
title: My Pattern Library
---

Hello World! This is my pattern library.
```

#### .gitignore
Ideally, you'll ignore several directories in git. By default you'd want to set up your `.gitignore` with the following:

```
node_modules/
html/
```

## Hello, PatternPack!
Once you're done configuring PatternPack, you're ready to start it up for the first time. Open a command prompt and you have two options:

```bash
$ grunt patternpack:run
# Or if you set up a default grunt task that points at patternpack:run
$ grunt
```

This will:

- Build your Pattern Library in a temporary directory, `./html` or whatever you configured in your [`options.build`](https://github.com/patternpack/patternpack#build).
- Start up a watch task to auto build any changes
- Expose the pattern library at `http://localhost:8888/`
