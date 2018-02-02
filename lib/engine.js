'use strict';
const fs = require('fs');
const Vue = require('vue');
const LRU = require('lru-cache');
const vueServerRenderer = require('vue-server-renderer');
const Resource = require('server-side-render-resource');
const VUE_RESOURCE = Symbol('Application#VueResource');

class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.vuessr;
    this.vueServerRenderer = vueServerRenderer;
    this.renderer = this.vueServerRenderer.createRenderer();
    this.renderOptions = this.config.renderOptions;

    if (this.config.cache === true) {
      this.bundleCache = LRU({
        max: 1000,
        maxAge: 1000 * 3600 * 24 * 7,
      });
    } else if (typeof this.config.cache === 'object') {
      if (this.config.cache.set && this.config.cache.get) {
        this.bundleCache = this.config.cache;
      } else {
        this.bundleCache = LRU(this.config.cache);
      }
    }
    const layout = this.config.layout;
    if (layout && fs.existsSync(layout)) {
      this.template = fs.readFileSync(layout, 'utf8');
    } else if (this.renderOptions && this.renderOptions.template) {
      this.template = this.renderOptions.template;
    }
  }

  get resource() {
    if (!this[VUE_RESOURCE]) {
      if (fs.existsSync(this.config.manifest)) {
        this[VUE_RESOURCE] = new Resource(this.app, this.config);
      }
    }
    return this[VUE_RESOURCE];
  }

  normalizeLocals(locals = {}) {
    [ 'ctx', 'request', 'helper' ].forEach(key => {
      Object.defineProperty(locals, key, { enumerable: false });
    });
    return locals;
  }
  createBundleRenderer(name, renderOptions) {
    if (this.bundleCache) {
      const bundleRenderer = this.bundleCache.get(name);
      if (bundleRenderer) {
        return bundleRenderer;
      }
    }
    const bundleRenderer = this.vueServerRenderer.createBundleRenderer(name, Object.assign({}, this.renderOptions, renderOptions));
    if (this.bundleCache) {
      this.bundleCache.set(name, bundleRenderer);
    }
    return bundleRenderer;
  }

  render(name, context, options) {
    context = context || /* istanbul ignore next */ {};
    options = options || /* istanbul ignore next */ {};

    return new Promise((resolve, reject) => {
      this.createBundleRenderer(name, options.renderOptions).renderToString(context, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }

  renderString(tpl, locals, options) {
    const vConfig = Object.assign({ template: tpl, data: locals }, options);
    const vm = new Vue(vConfig);
    return new Promise((resolve, reject) => {
      this.renderer.renderToString(vm, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }

  renderClient(name, locals, options) {
    options.viewEngine = 'vue';
    const template = options.renderOptions && options.renderOptions.template || this.template;
    return this.renderString(template, locals, options).then(html => {
      return this.resource ? this.resource.inject(html, name, locals, options) : html;
    });
  }
}

module.exports = Engine;
