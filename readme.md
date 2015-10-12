# PatternPack
PatternPack is designed to accelerate the creation of web application pattern libraries. When configured properly it will generate a static site pattern library. The [patternpack-example-library](https://github.com/patternpack/patternpack-example-library) demonstrates exactly how to do this and is a good place to learn how to use PatternPack.

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

Task options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide. However the files and targets are not used at this time.

### Options

#### src
Type: `string`  
Default: `./src`

The path at which the patterns can be located. This is base path to all the pattern in the pattern library.

#### build
Type: `string`  
Default: `./html`

The path at which the patterns library will be generated. This is the base path where the working pattern library will be created, and can be reviewed during development.

#### release
Type: `string`  
Default: `./release`

The path at which the pattern library will published. This is the base path where the released pattern library assets can be found by consuming applications.

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

#### assets
Type: `string`
Default: `./src/assets`

A folder to house any additional assets to be shared across projects (e.g., fonts, icons, images, etc.).

#### theme
Type: `string`  
Default: `patternpack-example-theme`

The name of the npm package (or the path) which contains the PatternPack theme. Custom themes can be npm modules or simply files that exist within a pattern library. By default PatternPack is configured to use the [patternpack-example-theme]

#### css.preprocessor
Type: `string`  
Default: `sass`
Allowed Values: `sass, less, none, ""`

The type of css preprocessor to run.
> `sass`: runs the sass preprocessor on `assets/sass/options.css.fileName.scss`
> `less`: runs the less preprocessor on `assets/less/options.css.fileName.less`
> `""` `none`: does not run any css preprocessor

#### css.fileName
Type: `string`
Default: `patterns`

The final CSS file you will create that will `import` all your patterns and any other CSS you write. You will manually create this file which will be automatically watched during development and have your configured CSS preprocessor and autoprefixer run on it. Do not add an extension to this file name.

It must live in your configured `assets` directory under a `sass` or `less` subdirectory (e.g., `src/assets/sass/patterns.scss`).

#### css.autoprefixer
Type: `array`,
Default: `browsers: ['last 2 versions']`

Pass in options to PostCSS Autoprefixer. See the [available options](https://github.com/postcss/autoprefixer#options).

#### publish.library
Type: `boolean`  
Default: `true`

Indicates whether a full pattern library will be generated.

#### publish.patterns
Type: `boolean`  
Default: `false`

Indicates whether standalone patterns will be generated.

_This option can be useful if you would like to integrate patterns directly into another application. For example when the patterns includes components or interations that are only available in the context of the application (such as AngularJS directives)._

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

Specifies the hierarchy used to organize patterns. The default configuration represents the atomic design hierarch, but this can be overriden with any preferred structure.

>`name`: The friendly name that is displayed in the pattern library.
>`path`: The location at which the patterns can be found. This path is relative to the `src` path.

_The order of the items in the Array determines the order in which they will be displayed in the pattern library._

#### server
See the options in [`grunt-connect`](https://github.com/gruntjs/grunt-contrib-connect#options)

For example:

```js
  server: {
    port: 5555
  }
```

#### integrate
Type: `string`
Default: none

Configures a directory where library builds will copy when running the `patternpack:integrate` command. Note that it is not recommended to configure this in your gruntfile when sharing across a team. Instead, use the `.patternpackrc` [method below](#user-specific-settings-override).

### Usage Examples

#### Basic usage
This is an example of the most minimal configuration possible for PatternPack. If the default conventions are followed, minimal grunt configuration is required.

```js
patternpack: {
  run: {},
  build: {},
  integrate: {},
  release: {},
  "release-patch": {},
  "release-minor": {},
  "release-major": {}
}
```

#### Custom task names
This example shows how task names can be customized. Configuring the the `task` option specifies what action PatternPack will take when the custom task is called.

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
Using the `patternStructure` option, you are able to configure the categories you will put your patterns in. In this case `components`, `modules`, `templates` and `pages`.

```js
patternpack: {
  options: {
    patternStructure: [
      { "name": "Components", "path": "components" },
      { "name": "Modules", "path": "modules" },
      { "name": "Templates", "path": "tmpl" }
      { "name": "Pages", "path": "pages" }
    ]
  }
}
```

In this configuration PatternPack would look for patterns in:
```
src/
  components
  modules
  tmpl
  pages
```

Where src/ is configured in [`options.src`](#src).

#### User-specific settings override
An individual developer can override any option in the `patternpack` task by creating a `.patternpackrc` file. This is a JSON file that would mirror the contents of the `patternpack.options` portion of your task. It's recommended to add the `.patternpackrc` file to your `.gitignore`

For example, to override the server configuration, set up a `.patternpackrc` file:

```
{
  "server": {
    "port": 1234
  }
}
```

Note that this file should be conforming JSON, so all strings should be wrapped in double quotes.

#### All available options
This example shows all options with their default options.

```js
{
  release: "./dist",
  build: "./html",
  src: "./src",
  assets: "./src/assets",
  css: {
    preprocessor: "sass",
    fileName: "project",
    autoprefixer: {
      browsers: ["last 2 versions"]
    }
  }
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
  ],
  server: {
    port: 1234
  }
}
```


## PatternPack Workflow

### Pattern Library Development
When developing new patterns for a pattern library, PatternPack provides the `patternpack:default` and `patternpack:build` tasks to assist with the process. The `patternpack:default` task is primarily used for interactive development. It hosts a simple webserver for reviewing changes, and will automatically compile CSS and markdown into patterns as changes are made.

The `patternpack:build` task does not run the webserver or monitor for changes. It is best used for manual updates and inspection of the pattern library. It is also useful to call as part of a customized build process.

### Pattern Library Release
In order to release a new version of a pattern library you create with PatternPack, the following sequence of commands should be executed.

```
grunt patternpack:build
grunt patternpack:release
git push --follow-tags
```

`grunt patternpack:build` tells pattern pack to generate the pattern library. In most cases this will done during the pattern development process. `grunt patternpack:release` increments the version of the pattern library, copies the pattern library to the release location, commits the code and tags the git repo with the new version number. `git push --follow-tags` pushes the code changes to the origin and the newly added tag.

Once released your application should be able to reference the newly tagged version of the pattern library to utilize the new patterns.
