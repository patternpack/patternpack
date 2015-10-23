# Getting Started with PatternPack

## Create Your Pattern Library
There a three ways to build a new pattern library with PatternPack:

- Use the [example library](https://github.com/patternpack/patternpack-example-library) as a starting point ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#start-with-the-example-pattern-library))
- Use Yeoman Generator to create a new pattern library ([documentation](https://github.com/patternpack/patternpack/blob/master/docs/getting-started.md#use-the-yeoman-generators))
- Build your own Pattern Library from scratch (see the [tutorial](https://github.com/patternpack/patternpack/blob/master/docs/tutorial.md))

We'll be covering the first two options in this getting started guide. If you're interested in building one from scratch, read through the [full tutorial](https://github.com/patternpack/patternpack/blob/master/docs/tutorial.md).

## Start With The Example Pattern Library
If you would like a more prescriptive "Comes with Batteries" approach, the PatternPack Example Library is a great place to start. Simply fork the [example library](https://github.com/patternpack/patternpack-example-library), tweak a few settings and get going with your very own patterns.

1. Fork or download the [PatternPack Example Library](https://github.com/patternpack/patternpack-example-library)
1. Configure your `name`, `description`, `version`, and any other settings inside the `package.json` & `bower.json`
1. Run `npm install` to get all the dependencies
1. Run `grunt` to start up your Pattern Library

## Use the Yeoman Generators
We also provide [Yeoman](http://yeoman.io/) generators that allow you to scaffold a new pattern library without using the example project. The generators also automate other helpful tasks like creating a new pattern.

To generate a new pattern library with Yeoman:

1. Create a directory for your new pattern library and install the PatternPack generators.
```shell
$ mkdir my-pattern-library
$ cd my-pattern-library
$ npm install generator-patternpack
```
1. Use the ```patternpack:init``` generator to create an new pattern library
```shell
$ yo patternpack:init my-pattern-library
```
1. Install all dependencies and start up the library
```shell
$ npm install
$ grunt
```

To generate a new pattern, use the command `yo patternpack:pattern name-of-pattern`. It will prompt you for the destination, which should be somewhere in your `./src/area`.

## Build and Review
Once you have a pattern library created, you will need to build the project using grunt. The default PatternPack grunt task will build the pattern library, host the site locally, and runs [LiveReload] (to dynamically update the browser when changes are detected).

```shell
$ grunt patternpack:run
```
```shell
Running "connect:browser" (connect) task
Started connect web server on http://localhost:8000
Running "watch" task
Waiting...
```

## Publish a release
Once you have some patterns you are happy with (be sure they are committed to the repo) you will want to make them available to applications for use. PatternPack provides some grunt tasks to simplify this process.
```
grunt patternpack:release
```

The `patternpack:release` task will increment the version number, commit the current build of the pattern library and apply a new git tag to this commit. Review the state of your local changes. When you are satisfied that everything looks good, publish your changes.

```
git push --follow-tags
npm publish ./
```

*Note: If you don't wish to publish your pattern library in a public way, you can still use PatternPack by creating a private package. Omit the ```npm publish ./``` step from above and read up on [creating private packages](https://github.com/patternpack/patternpack/blob/master/docs/private.md). npm and bower can also [point directly to a Git repository](https://docs.npmjs.com/files/package.json#dependencies).*

## Use in your application
To use the patterns you will need to take a dependency on your new pattern library. Simply add the pattern library package to the `package.json` or `bower.json` of your application.

```
npm install my-pattern-library --save-dev
```

Adding the pattern library dependency will make the latest version of the pattern library CSS available for use in your application. You can either host this css directly, or you can use a build task to copy the css to a location more appropriate for your application.

Then just point to your generated CSS file from your application:

```
<head>
  <link href="/node_modules/my-pattern-library/pattern-library/dist/assets/css/my-pattern-library.css" rel="stylesheet" />
</head>
```

Once the styles are properly imported into your application, start using the markup from the examples documented in the pattern library.
