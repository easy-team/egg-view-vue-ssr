'use strict';
const path = require('path');

module.exports = app => {
  const config = {};

  /**
   * vue ssr config
   * @member Config#vue
   * @property {String} [manifest=${baseDir}/app/view/layout.html] - client render template, support renderString compile
   * @property {String} [manifest=${baseDir}/config/manifest.json] - resource dependence(css, js) config
   * @property {String} [manifest=${baseDir}/config/buildConfig.json] - compile config, include `publicPath` and `commonsChunk`
   * `publicPath`: static resource prefix path, so cdn domain address prefix or local prefix path(`/`)
   * `commonsChunk`: common js or css filename, so `vendor`
   */
  config.vuessr = {
    layout: path.join(app.baseDir, 'app/view/layout.html'),
    manifest: path.join(app.baseDir, 'config/manifest.json'),
    buildConfig: path.join(app.baseDir, 'config/buildConfig.json'),
  };

  return config;
};

