# Tutorial

## Creating a New PatternPack
PatternPack enables you to build a design system, document your patterns, and share the code from a central repository. The styles can be easily pulled into an application, or even shared with multiple projects.

### Methods to Generate A Pattern Library
- Build your own configuration (covered in this guide)
- Use the [example library](https://github.com/patternpack/patternpack-example-library) as a starting point ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#start-with-the-example-pattern-library))
- Use Yeoman Generator to create a new pattern library ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#use-the-yeoman-generators))

If you're starting with the example library or Yeoman, go ahead and skip to [the next section](#hello-patternpack).

The first step is to initialize a new project with a Git repository: create a new directory and run `git init`.

### Project Dependencies
Once your new project is created, you'll need to get a few dependencies set up:

- `npm init` and follow the prompts to generate a node project
- `npm install grunt patternpack --save-dev` to install grunt and PatternPack as dependencies

At this point, we've got project dependencies ready.

### Basic Configuration
PatternPack is a grunt plugin, so you'll need to create a `gruntfile.js` in your project's root directory and add PatternPack to it:

#### gruntfile.js
```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      run: {},
      build: {},
      release: {}
    }
  });

  grunt.loadNpmTasks('patternpack');

  grunt.registerTask('default', ['patternpack:run']);
}
```

This grunt configuration exposes three tasks to your project:

- `patternpack:run` which starts up the development environment
- `patternpack:build` which generates the web server files
- `patternpack:release`, which exposes the versioning and release tasks

The last line also maps the default `grunt` command to generate your pattern library and start up a development environment.

### Advanced Configuration
PatternPack provides smart defaults, however it can be extensively configured to suit your needs. Look at the [full documentation](https://github.com/patternpack/patternpack#options) to see what can be configured.

There are a few options you might want to customize early on based on your needs:

- `options.css.fileName` - this is the "master" Sass/Less file that will import your patterns as well as any other dependencies you want to integrate ([documentation](https://github.com/patternpack/patternpack#cssfilename))
- `options.css.preprocessor` - defaults to `sass`, but `less` is available as well ([documentation](https://github.com/patternpack/patternpack#csspreprocessor))
- `logo` - the default theme populates a placeholder logo, but you can replace it by pointing to an image in your project ([documentation](https://github.com/patternpack/patternpack#logo))
- `patternStructure` - the taxonomy you will use to organize your Patterns ([documentation](https://github.com/patternpack/patternpack#patternstructure) and [example](https://github.com/patternpack/patternpack#custom-pattern-structure))

## Hello, PatternPack!
Once you're done configuring PatternPack, you're ready to start it up for the first time. Open a command prompt and you have two options:

```shell
$ grunt patternpack:run
# Or if you set up a default grunt task that points at patternpack:run
$ grunt
```

This will:
- Generate the files and folders you'll need
- Build your Pattern Library in a temporary directory, `./html` or whatever you configured in your [`options.build`](https://github.com/patternpack/patternpack#build).
- Start up a web server at `http://localhost:8888/`
- Start a watch task that will automatically rebuild the pattern library when any changes are made (compatible with the [LiveReload browser plugins](http://livereload.com/extensions/))

## Adding a Pattern
*Note that due to limitations in `grunt-watch`, you will need to restart PatternPack every time you add a new file for the watch to recognize it. Once it sees it, all changes with automatically reload.*

Patterns are composed of two files:

- A Markdown (`*.md`) file that contains all the content for a documentation page
- A Sass/Less file with the styles for that pattern

To get started, add those two files into one of your Structure folders (if you kept the defaults, it'll be `./src/atoms`, `./src/molecules`, and `./src/templates`).

It's recommended to use the following template for patterns. You can also add any additional content that is relevant to your Pattern Library.

```md
---
title: Buttons
---

# Buttons
Insert your documentation here

## Example
<div class="library__example">
  Insert your live example here
</div>

## Code

Insert your code example here
TODO: INSERT BACKTICKS - HOW DO I ESCAPE THEM??
```

The `<div class="library__example">` strips out the default PatternPack styling from your example.

The matching Sass/Less file(s) will be globbed into a file called `_patternpack-patterns.scss or .Less`. By default when you generate PatternPack for the first time, you will also get a `patterns.scss or .Less` file (or what you configure in [`options.css.fileName`](https://github.com/patternpack/patternpack#cssfilename)) that will `@import` the `_patternpack-patterns` file.

## Releasing Your Code
PatternPack's most powerful feature is the ability to easily version and release your code, which allows other applications to pull in your styles and lock them to a specific version, preventing unexpected changes.

*Note: The versioning and release process is built on the assumption you are using Git as your source control system. At this time, SVN, Mercurial, TFS (without Git), and others are not supported. However, because the assumption is that PatternPack will live in its own repository, you can set up a separate Git-based project without interrupting your app's development workflow.*

In the default `grunt` configuration, you have a `patternpack:release` task. This task does a few things:

1. Rebuilds your pattern library in the `./html` directory (or whatever you configured in [`options.build`](https://github.com/patternpack/patternpack#build))
1. Copies the files from your build (`./html`) directory to the `./dist` directory (or whatever you configured in [`options.release`](https://github.com/patternpack/patternpack#release)).
1. Bumps the version number in the `package.json` file
1. Commits all files in a new commit titled `Release v#.#.#`
1. Tags the commit `v#.#.#`

The release process follows [Semantic Versioning principles](http://semver.org/).

### Adding All Release Tasks
By default, the `patternpack:release` task does a patch (i.e., `v1.0.x`) release. To enable minor, and major releases you'll have to modify your `gruntfile.js` to include those tasks:

```
```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      run: {},
      build: {},
      release: {},
      "release-patch": {},
      "release-minor": {},
      "release-major": {}
    }
  });

  grunt.loadNpmTasks('patternpack');

  grunt.registerTask('default', ['patternpack:run']);
}
```

The three new tasks, `patternpack:release-patch`, `patternpack:release-minor`, `patternpack:release-major` can be run to increment the desired version.

### Creating a Release
Before running the command, you'll want a clean working copy (i.e., no uncommitted changes) since the release tasks will stage and commit all files (it runs the equivalent of `git add . && git commit`).

Once you run the command, you'll want to review all your changes in the new commit to ensure all your intended changes are in there. Your release files show up in the folder configured with [`options.release`](https://github.com/patternpack/patternpack#release)) (`./dist` by default).

Once you're ready to push, you'll need to push your commit *and* tags: `git push --folow-tags`. At this point, your changes are published, versioned, and ready to be consumed by one or more applications.

So creating a release is as simple as:

```shell
$ git status
$ grunt release
$ git push --folow-tags
```

### Integrating PatternPack With Your Application(s)
One of PatternPack's most powerful features is to extract the styles from your application, house them in a central repository, and then have one or multiple applications take a dependency on those styles.

PatternPack builds an [npm](https://www.npmjs.com) or [bower](http://bower.io) compatible project, so integrating your pattern library is as simple as `npm install my-awesome-pattern-library`.

If you don't want to publish your library as a public NPM package, you have a few options:

* [NPM Private Modules](https://www.npmjs.com/private-modules)
* You can [point to a Git repository as your dependency](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies)

Once you've installed your library, you can simply point your project to the generated CSS file inside your `node_modules` or `bower_components`. Be sure to use the file inside the `dist/` directory. You might even consider using a [.npmignore](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package) to exclude your source and build folders from an npm or bower installation.
