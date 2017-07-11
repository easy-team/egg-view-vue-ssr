'use strict';
const path = require('path');
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
    this.initConfig();
    // local dev mode, webpack build finish update buildConfig and manifest
    if (process.env.NODE_ENV !== 'production') {
      this.app.messenger.on('webpack_manifest_save_success', () => {
        delete require.cache[this.config.buildConfig];
        delete require.cache[this.config.manifest];
        this.initConfig();
        this.app.logger.debug('update buildConfig and manifest', this.buildConfig.publicPath);
      });
    }
  }

  initConfig() {
    if (this.isValidJSONConfig(this.config.buildConfig)) {
      this.buildConfig = require(this.config.buildConfig);
    }
    if (this.isValidJSONConfig(this.config.manifest)) {
      this.manifest = require(this.config.manifest);
      this.resourceDeps = this.getResourceDeps(this.manifest, this.buildConfig);
    }
    this.initInline();
  }

  initInline() {
    if (Array.isArray(this.config.injectRes)) {
      this.config.injectRes.forEach(item => {
        const url = this.getRes(item.url);
        const filepath = path.join(this.app.baseDir, url);
        if (item.inline && !/^(https?|\/\/)/.test(url) && this.isExist(filepath)) {
          const content = this.readFile(filepath);
          if (/\.js$/.test(url)) {
            item.content = `<script>${content}</script>`;
          } else if (/\.css$/.test(url)) {
            item.content = `<style>${content}</style>`;
          }
        } else {
          if (/\.js$/.test(url)) {
            item.content = this.createScriptSrcTag(url);
          } else if (/\.css$/.test(url)) {
            item.content = this.createCssLinkTag(url);
          }
        }
      });
    }
  }

  getRes(id) {
    if (/^(https?|\/\/)/.test(id)) {
      return id;
    }
    if (this.buildConfig && this.manifest) {
      const publicPath = this.buildConfig.publicPath;
      const mappingUrl = this.manifest[id];
      return mappingUrl ? publicPath + mappingUrl : id;
    }
    return id;
  }

  isExist(filepath) {
    return fs.existsSync(filepath);
  }

  readFile(filepath) {
    return fs.readFileSync(filepath, 'utf8');
  }

  isValidJSONConfig(filepath) {
    if (!filepath) return false;
    if (this.isExist(filepath)) {
      try {
        return require(filepath);
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  createCssLinkTag(url) {
    return `<link rel="stylesheet" href="${url}">`;
  }

  createScriptSrcTag(url) {
    return `<script type="text/javascript" src="${url}"></script>`;
  }

  injectHead(resArr) {
    this.config.injectRes.forEach(item => {
      if (item.content) {
        if (item.location === 'headBefore' || (item.location === undefined && /\.(css|js)$/.test(item.url))) {
          resArr.unshift(item.content);
        } else if (item.location === 'headAfter') {
          resArr.push(item.content);
        }
      }
    });
  }

  injectBody(resArr) {
    this.config.injectRes.forEach(item => {
      if (item.content) {
        if (item.location === 'bodyBefore') {
          resArr.unshift(item.content);
        } else if (item.location === 'bodyAfter') {
          resArr.push(item.content);
        }
      }
    });
  }


  inject(name, html, context, config, options) {
    const fileKey = name;
    const fileManifest = this.resourceDeps[fileKey];
    if (fileManifest) {
      const headInject = [];
      const bodyInject = [];
      const publicPath = this.buildConfig.publicPath;
      if (config.injectCss && (options.injectCss === undefined || options.injectCss)) {
        fileManifest.css.forEach(item => {
          headInject.push(this.createCssLinkTag(publicPath + item));
        });
      } else {
        headInject.push(context.styles);
      }
      if (config.injectJs) {
        fileManifest.script.forEach(item => {
          bodyInject.push(this.createScriptSrcTag(publicPath + item));
        });
        if (!/window.__INITIAL_STATE__/.test(html)) {
          bodyInject.unshift(`<script> window.__INITIAL_STATE__= ${serialize(context.state, { isJSON: true })};</script>`);
        }
      }
      this.injectHead(headInject);
      html = html.replace(this.headRegExp, match => {
        return headInject.join('') + match;
      });

      this.injectBody(bodyInject);
      html = html.replace(this.bodyRegExp, match => {
        return bodyInject.join('') + match;
      });
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
