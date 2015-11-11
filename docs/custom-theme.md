# Building a Custom Theme in PatternPack

PatternPack provides a basic theme with some sensible defaults out of the box. However, when it comes to building your own pattern library, you'll probably want to build your own custom theme.

## Setting Up A Custom Theme

First off, you'll need to add some sort of theme directory to house your theme files in your project. Start off by creating a `/theme` directory at the root of your project. This folder can be called whatever you'd like, and placed where ever it makes sense.

Then you'll need to update our options in our grunt file:

```js
patternpack: {
  options: {
    theme: "./theme"    // the path to your theme directory
  },
  run: {},
  build: {},
  release: {}
}
```

At this point, our project will not build. Next you need to define a master layout file at `theme/layouts/_pattern-library.hbs`. It must be inside of these folders and be called `_pattern-library.hbs`. Inside this file should be your base layout wrapper. For example:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    {{#markdown}}
    {{> body}}
    {{/markdown}}
  </body>
</html>
```

The `{{#markdown}}` tags are Handlebars helpers that tell our site generator that the content inside is a Markdown file. The `{{> body}}` tag renders the contents of that file (e.g., `buttons.md`, `forms.md`, etc.).

Note that these come from [Assemble](http://assemble.io/), which powers PatternPack's static site generation.

At this point you have a basic, unstyled site that will render our content.

## Adding Assets
The first thing you'll need to do is add our generated CSS. Because our assets directory is customizable, PatternPack provides an `{{assets}}` helper that will fill in the path to your assets folder. So adding your custom CSS would look like:

```html
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <link href="{{assets}}/css/patterns.css" rel="stylesheet" type="text/css" />
</head>
```

Be sure to update the path to match the name of your generated CSS file. Custom JavaScript that lives inside an `assets/js/` directory could be added with `<script src="{assets}/js/script.js"></script>`.

The `{{title}}` handlebars helper will pull the YAML title from the top of any of your Markdown files.

## Theme Specific Files

If you'd like to add CSS or JavaScript that is specific to your theme, you'll need to add a `theme/theme-assets/` folder. Anything inside of here is available via a `{{themeassets}}` helper.

So some documentation-specific CSS that isn't part of your master CSS file would be available via `<link href="{{themeassets}}/css/theme.css" rel="stylesheet" type="text/css" />`
