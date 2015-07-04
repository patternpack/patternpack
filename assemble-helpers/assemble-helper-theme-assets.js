module.exports.register = function (Handlebars, options, params) {
  "use strict";

  Handlebars.registerHelper("themeassets", function () {
    return this.assets + "/../theme-assets";
  });
};
