'use strict';
const fs = require('fs');
const serialize = require('serialize-javascript');

class Resource {
  constructor(app) {
    this.app = app;
    this.config = app.config.vuessr;
    this.headRegExp = /(<\/head>)/i;
    this.bodyRegExp = /(<\/body>)/i;
    this.init();
  }

  init() {
    if (!this.buildConfig && this.isValidJSONConfig(this.config.buildConfig)) {
      this.buildConfig = require(this.config.buildConfig);
    }
    if (!this.resourceDeps && this.isValidJSONConfig(this.config.manifest)) {
      const manifest = require(this.config.manifest);
      this.resourceDeps = this.getResourceDeps(manifest, this.buildConfig);
    }
  }

  isValidJSONConfig(filepath) {
    if (!filepath) return false;
    if (fs.existsSync(filepath)) {
      try {
        return require(filepath);
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  inject(name, html, context, config, options) {
    this.init();
    const fileKey = name;
    const fileManifest = this.resourceDeps[fileKey];
    if (fileManifest) {
      const publicPath = this.buildConfig.publicPath;
      if (config.injectCss && (options.injectCss === undefined || options.injectCss)) {
        const cssInject = fileManifest.css.map(item => {
          return `<link rel="stylesheet" href="${publicPath + item}">`;
        });
        html = html.replace(this.headRegExp, match => {
          return cssInject.join('') + match;
        });
      } else {
        html = html.replace(this.headRegExp, match => {
          return context.styles + match;
        });
      }
      if (config.injectJs) {
        const scriptInject = fileManifest.script.map(item => {
          return `<script type="text/javascript" src="${publicPath + item}"></script>`;
        });
        if (!/window.__INITIAL_STATE__/.test(html)) {
          scriptInject.unshift(`<script> window.__INITIAL_STATE__= ${serialize(context.state, { isJSON: true })};</script>`);
        }
        html = html.replace(this.bodyRegExp, match => {
          return scriptInject.join('') + match;
        });
      }
    }
    return config.afterRender(html, context);
  }

  getResourceDeps(manifest, buildConfig) {
    const commonScriptPaths = [];
    const commonCSSPaths = [];
    const formatManifest = {};
    buildConfig.commonsChunk.forEach(item => {
      const jsKey = `${item}.js`;
      const cssKey = `${item}.css`;
      manifest[jsKey] && commonScriptPaths.push(manifest[jsKey]);
      manifest[cssKey] && commonCSSPaths.push(manifest[cssKey]);
    });

    Object.keys(manifest).forEach(item => {
      if (/\.js$/.test(item)) {
        formatManifest[item] = {
          script: commonScriptPaths.concat(manifest[item]),
          css: commonCSSPaths.concat(manifest[item.replace(/\.js$/, '.css')] || []),
        };
      }
    });
    return formatManifest;
  }
}

module.exports = Resource;
