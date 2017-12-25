'use strict';
const path = require('path');

module.exports = app => {
  const config = {};

  config.view = {
    mapping: {
      '.js': 'vue',
    },
  };

  /**
   * vue ssr config
   * @member Config#vue
   * @property {String} [doctype] - html doctype
   * @property {String} [layout=${baseDir}/app/view/layout.html] - client render template, support renderString compile
   * @property {String} [manifest=${baseDir}/config/manifest.json] - resource dependence(css, js) config
   * @property {Boolean} [injectCss] whether inject href css
   * @property {Boolean} [injectJs] whether inject src script
   * @property {Boolean|String} [crossorigin] js cross domain support for cdn js error catch, default false
   * @property {Array} [injectRes] inline/inject css or js to file head or body. include location and src config
   *           inline {Boolean} true or false, default false
   *           location {String} headBefore, headAfter, bodyBefore, bodyAfter  insert location, default headBefore
   *           url {String} inline file absolution path
   * @property {Object} [cache] lru-cache options @see https://www.npmjs.com/package/lru-cache
   * @property {Object} [renderOptions] @see https://ssr.vuejs.org/en/api.html#renderer-options
   * renderOptions.template will override layout template
   * @property {Function} afterRender hook html after render
   * `publicPath`: static resource prefix path, so cdn domain address prefix or local prefix path(`/`)
   * `commonsChunk`: common js or css filename, so `vendor`
   */
  config.vuessr = {
    doctype: '<!doctype html>',
    layout: path.join(app.baseDir, 'app/view/layout.html'),
    manifest: path.join(app.baseDir, 'config/manifest.json'),
    injectHeadRegex: /(<\/head>)/i,
    injectBodyRegex: /(<\/body>)/i,
    injectCss: true,
    injectJs: true,
    crossorigin: false,
    injectRes: [],
    fallbackToClient: true, // fallback to client rendering if server render failed,
    cache: {
      max: 1000,
      maxAge: 1000 * 3600 * 24 * 7,
    },
    // renderOptions: {
    //  template: `<!DOCTYPE html><html lang="en"><body><!--vue-ssr-outlet--></body></html>`,
    // },
    afterRender: (html, context) => { /* eslint no-unused-vars:off */
      return html;
    },
  };

  return config;
};

