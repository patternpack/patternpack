# Getting Started

## Create your pattern library
There a two main ways to get started with a new pattern library based upon PatternPack.  One is to use the [PatternPack Example Library] as a starting point, the other is to use the [PatternPack Yeoman Generators] to assist in the creation of a new library.

####Start with the example pattern library
If you would like a more prescriptive "Comes with Batteries" approach, the PatternPack Example Library is a great place to start.  Simply fork the example library, tweak a few settings and get going with your very own patterns.

1. Begin by creating a fork & cloning the [PatternPack Example Library]
1. Next, setup the package configuration for the ```package.json``` & ```bower.json```
```
{
  "name": "",
  "description": ""
  "version": "0.0.1"
}
```

#### Use the yeoman generators
If you would like to start your own pattern library without using the example project we recommend you use the [Yeoman] generators.  The [PatternPack Yeoman Generators] will scaffold a new pattern library as well as automate other helpful tasks like creating a new pattern.

1. Create a location for your new pattern library then install the PatternPack generators.
```
mkdir my-pattern-library
cd my-pattern-library
npm install generator-patternpack
```
1. Use the ```patternpack:init``` generator to create an new pattern library
```
yo patternpack:init my-pattern-library
```


## Build and Review
Once you have a pattern library created, you will need to build the project using grunt.  The default PatternPack grunt task will build the pattern library, host the site locally, and runs [LiveReload] (to dynamically update the browser when changes are detected).

```
grunt patternpack
```
```
Running "connect:browser" (connect) task
Started connect web server on http://localhost:8000
Running "watch" task
Waiting...
```

## Publish a release
Once you have some patterns you are happy with (be sure they are committed to the repo) you will want to make them available to applications for use.  PatternPack provides some grunt tasks to simplify this process.
```
grunt patternpack:release
```

The ```patternpack:release``` task will increment the version number, commit the current build of the pattern library and apply a new git tag to this commit.  Review the state of your local changes.  When you are satisfied that everything looks good, publish your changes.

```
git push --follow-tags
npm publish ./
```

  > If you don't wish to publish your pattern library in a public way, you can still use PatternPack by creating a private package.  Omit the ```npm publish ./``` step from above and read up on [creating private packages](https://github.com/patternpack/patternpack/blob/master/docs/private.md).

## Use in your application
To use the patterns you will need to take a dependency on your new pattern library.  Simply add the pattern library package to the ```package.json``` or ```bower.json``` of your application.

```
npm install my-pattern-library --saves
```

Adding the pattern library dependency will make the latest version of the pattern library CSS available for use in your application.  You can either host this css directly, or you can use a build task to copy the css to a location more appropriate for your application.

```
<head>
  <link href="/node_modules/my-pattern-library/css/my-pattern-library.css" rel="stylesheet" />
</head>
```

```
my-app
├─ node_modules
│  ├─ my-pattern-library
│  │  ├─ css
│  │  │  └─ my-pattern-library.css
```

Once the styles are properly imported into your application, start using the markup from the examples documented in the pattern library.


## What's Next?
PatternPack has been designed to be flexible to your needs.  When your ready, dig into some of the more advanced topics:
* [Creating patterns](https://github.com/patternpack/patternpack/blob/master/docs/patterns.md)
* [Releasing new versions](https://github.com/patternpack/patternpack/blob/master/docs/release.md)
* [Private packages](https://github.com/patternpack/patternpack/blob/master/docs/private.md)
* [Advanced versioning](https://github.com/patternpack/patternpack/blob/master/docs/versioning.md)
* [Use in applications](https://github.com/patternpack/patternpack/blob/master/docs/use.md)


[LiveReload]: (http://livereload.com)
[Yeoman]: (http://yeoman.io/)
[PatternPack]: https://github.com/patternpack/patternpack
[PatternPack Example Library]: https://github.com/patternpack/patternpack-example-library
[PatternPack Yeoman Generators]: (https://github.com/patternpack/generator-patternpack)
