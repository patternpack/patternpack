# Adding Custom Tasks to PatternPack

Out of the box, PatternPack provides you basic functionality to build your UI code, document it in a static site, and release new versions. However, there's probably a good chance you'll want to add custom functionality to your library. Some examples might include:

- Copying npm packages over to your project directory for distribution
- Generating an SVG sprite from a folder of SVGs
- Transpiling and Minifying your JavaScript
- Anything else PatternPack doesn't support out of the box

To achieve this, PatternPack has decoupled its functionality into individual tasks so that you can "reassemble" them as needed. See the [documentation for modular tasks](https://github.com/patternpack/patternpack#modular-tasks) to keep up with what is available.

## Laying the Groundwork
There will be some initial lifting you'll have to do just to get modular tasks up and running.

First, make sure your `gruntfile.js` includes the modular tasks you'll need access to:

```js
patternpack: {
  options: {
    ...
  },
  run: {},
  build: {},
  "build-styles": {},
  "build-pages": {},
  integrate: {},
  release: {},
  "release-patch": {},
  "release-minor": {},
  "release-major": {}
}
```

Next, you'll need to install some grunt plugins to replicate the web server and watch tasks:

```shell
npm install --save-dev grunt-contrib-connect grunt-contrib-watch
```

And make sure you add them to your gruntfile:

```js
module.exports = function (grunt) {
  grunt.initConfig({
    ...
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
}
```

Now you're ready to add the baseline tasks. The `connect.options.base` path should point to what you've configured in `options.build` (`./src/HTML` by default). Be sure to include `/pattern-library/` at the end of the URL.

```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      ...
    },

    connect: {
      options: {
        base: './path/to/your/build-directory/pattern-library',   // make sure you include the trailing pattern-library directory
        port: '8888'
      },
      server: {}
    }
  });
}
```

You'll also want to add `grunt-watch` functionality to handle building site changes, CSS changes, and livereload in the browser.

Any Markdown or Handlebars files that change should trigger the `patternpack:build-pages` task. Any Sass or Less files that change should trigger the `patternpack:build-styles` task.

```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      ...
    },

    connect: {
      ...
    },

    watch: {
      markdown: {
        files: [
          './src/**/*.{md,hbs}'
        ],
        tasks: ['patternpack:build-pages']
      },
      styles: {
        files: ['./src/assets/**/*.scss'],
        tasks: ['patternpack:build-styles']
      },
      livereload: {
        files: './html/pattern-library/**/*.{css,html,js}',
        options: {
          livereload: true
        }
      },
    }
  });
}
```

Now it's useful to configure some custom tasks to run through everything:

```js
module.exports = function (grunt) {
  grunt.initConfig({
    patternpack: {
      ...
    },

    connect: {
      ...
    },

    watch: {
      ...
    }
  });

  grunt.registerTask('server', ['connect', 'watch']);

  grunt.registerTaks('default', ['patternpack:build', 'server']);
}
```

The `default` task now ensures that PatternPack builds the CSS and Site files, and our custom server runs and watches any relevant files for changes.

## Adding Custom Tasks

At this point, you should add in any additional functionality you need. The three key tasks you should be aware of are:

- `patternpack:build-styles` - Compiles all Sass in your `src/assets` directory and runs it through Autoprefixer
- `patternpack:build-pages` - Compiles all Markdown and Handlebars files to HTML
- `patternpack:build` - A combination of the two above tasks
