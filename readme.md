# Pattern Pack
PatternPack is designed to accelerate the creation of web application pattern libraries. When configured properly it will generate a static site pattern library.  The [patternpack-example-library] demonstrates exactly how to do this and is a good place to learn how to use PatternPack.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install patternpack --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('patternpack');
```

## PatternPack Task
_Run this task with the `grunt patternpack` command._

Task options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.  However the files and targets are not used at this time.

### Options

#### src
Type: `string`  
Default: `./src`

The path at which the patterns can be located.  This is base path to all the pattern in the pattern library.

#### build
Type: `string`  
Default: `./html`

The path at which the patterns library will be generated.  This is the base path where the working pattern library will be created, and can be reviewed during development.

#### release
Type: `string`  
Default: `./release`

The path at which the pattern library will published.  This is the base path where the released pattern library assets can be found by consuming applications.

#### task
Type: `string`  
Default: `""`  
Allowed Values: `"", default, build, integrate, release, release-patch, release-minor, release-major`

The action that PatternPack will take when run.

> `""` `default`: builds the pattern library and runs a local webserver.  
> `build`: builds the pattern library.  
> `release`: alias for `release-patch`.  
> `release-patch`: patch increment to the package version, then performs a release.  
> `release-minor`: minor increment to the package version, then performs a release.  
> `release-major`: major increment to the package version, then performs a release.  

A release performs the following actions
* Increments the package version
* Copies the current build to the release location
* Commits the changes with the version number as the message

#### theme
Type: `string`  
Default: `patternpack-example-theme`

The name of the npm package (or the path) which contains the PatternPack theme.  Custom themes can be npm modules or simply files that exist within a pattern library.  By default PatternPack is configured to use the [patternpack-example-theme]

#### cssPreprocessor
Type: `string`  
Default: `sass`
Allowed Values: `sass, less, none, ""`

The type of css preprocessor to run.
> `sass`: runs the sass preprocessor on `assets/sass/patterns.scss`
> `less`: runs the less preprocessor on `assets/less/patterns.less`
> `""` `none`: does not run any css preprocessor

#### publish.library
Type: `boolean`  
Default: `true`

Indicates whether a full pattern library will be generated.

#### publish.library
Type: `boolean`  
Default: `false`

Indicates whether standalone patterns will be generated.  

_This option can be useful if you would like to integrate patterns directly into another application.  For example when the patterns includes components or interations that are only available in the context of the application (such as AngularJS directives)._

#### patternStructure
Type: `Array`  
Default:
```js
[
  { "name": "Atoms", "path": "atoms" },
  { "name": "Molecules", "path": "molecules" },
  { "name": "Pages", "path": "pages" }
]
```

Specifies the hierarchy used to organize patterns.  The default configuration represents the atomic design hierarch, but this can be overriden with any preferred structure.

>`name`: The friendly name that is displayed in the pattern library.  
>`path`: The location at which the patterns can be found.  This path is relative to the `src` path.

_The order of the items in the Array determines the order in which they will be displayed in the pattern library._

#### server
See the options in `[grunt-connect](https://github.com/gruntjs/grunt-contrib-connect#options)`

For example:

```js
  server: {
    port: 5555
  }
```

### Usage Examples

#### Basic usage
This is an example of the most minimal configuration possible for PatternPack.  If the default conventions are followed, minimal grunt configuration is required.

```js
patternpack: {
  options: {
    assets: './src/assets'
  },
  run: {},
  build: {},
  release: {}
}
```

#### Custom task names
This example shows how task names can be customized.  Configuring the the `task` option specifies what action PatternPack will take when the custom task is called.

```js
patternpack: {
  customDev: {
    task: 'default' // builds the application and runs the server
  },
  customBuild: {
    task: 'build' // builds the application
  },
  customRelease: {
    task: 'release' // releases the current build
  }
}
```

#### Custom file locations
This example demonstrates how to configure PatternPack to point to different file locations for the patterns, and then output the resulting pattern library to a custom location.

```js
patternpack: {
  options: {
    src: './path/to/patterns',
    build: './path/to/pattern-library',
    release: './path/to/release'
  }
}
```

#### Custom pattern structure
This example illustrates how to configure PatternPack to understand a differnt style of pattern hierarchy.  In this case `components`, `modules`, `templates` and `pages`.

```js
[
  { "name": "Components", "path": "components" },
  { "name": "Modules", "path": "modules" },
  { "name": "Templates", "path": "tmpl" }
  { "name": "Pages", "path": "pages" }
]
```

In this configuration PatterPack would look for patterns in:
```
src/
  components
  modules
  tmpl
  pages
```

#### All available options
This example shows all options with their default options.

```js
{
  release: "./dist",
  build: "./html",
  src: "./src",
  assets: "./src/assets",
  integrate: "../patternpack-example-app/node_modules/patternpack-example-library",
  theme: "./node_modules/patternpack-example-theme",
  publish: {
    library: true,
    patterns: false
  },
  patternStructure: [
    { name: "Atoms", path: "atoms" },
    { name: "Molecules", path: "molecules" },
    { name: "Pages", path: "pages" }
  ]
}
```


## PatternPack Workflow

### Pattern Library Development
When developing new patterns for a pattern library, PatternPack provides the `patternpack:default` and `patternpack:build` tasks to assist with the process.  The `patternpack:default` task is primarily used for interactive development.  It hosts a simple webserver for reviewing changes, and will automatically compile CSS and markdown into patterns as changes are made.

The `patternpack:build` task does not run the webserver or monitor for changes.  It is best used for manual updates and inspection of the pattern library.  It is also useful to call as part of a customized build process.

### Pattern Library Release
In order to release a new version of a pattern library you create with PatternPack, the following sequence of commands should be executed.

```
grunt patternpack:build
grunt patternpack:release
git push --follow-tags
```

`grunt patternpack:build` tells pattern pack to generate the pattern library.  In most cases this will done during the pattern development process. `grunt patternpack:release` increments the version of the pattern library, copies the pattern library to the release location, commits the code and tags the git repo with the new version number. `git push --follow-tags` pushes the code changes to the origin and the newly added tag.

Once released your application should be able to reference the newly tagged version of the pattern library to utilize the new patterns.


## Release History
* 2015-07-08    v0.0.1-alpha.3    Added smarter default configurations.
* 2015-07-06    v0.0.1-alpha.2    Resolved issues with grunt loading the patternpack task.
* 2015-07-04    v0.0.1-alpha.1    Initial release.

[patternpack-example-library]:(https://github.com/patternpack/patternpack-example-library)
[patternpack-example-theme]:(https://github.com/patternpack/patternpack-example-theme)
