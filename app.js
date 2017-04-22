'use strict';
const fs = require('fs');
const Resource = require('./lib/resource');
module.exports = app => {
  app.vue.resource = new Resource(app);
  if (app.config.vuessr.layout) {
    app.config.vuessr.template = fs.readFileSync(app.config.vuessr.layout, 'utf8');
  }
};
