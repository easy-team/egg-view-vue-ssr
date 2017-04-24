'use strict';
const fs = require('fs');
const Resource = require('./lib/resource');
module.exports = app => {
  app.vue.resource = new Resource(app);
  const layout = app.config.vuessr.layout;
  if (layout && fs.existsSync(layout)) {
    app.vue.resource.template = fs.readFileSync(layout, 'utf8');
  } else if (app.vue.renderOptions && app.vue.renderOptions.template) {
    app.vue.resource.template = app.vue.renderOptions.template;
  }
};
