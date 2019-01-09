'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const Vue = require('vue');
const LRU = require('lru-cache');
const serialize = require('serialize-javascript');
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
    this.fileCache = [];
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

  getTemplate(options = {}) {
    const filepath = options.layout;
    if (filepath) {
      if (this.fileCache[filepath]) {
        return this.fileCache[filepath];
      }
      const content = fs.readFileSync(filepath, 'utf8');
      this.fileCache[filepath] = content;
      return content;
    }
    return options.renderOptions && options.renderOptions.template || this.template;
  }

  getAsset(name, state) {
    const manifest = this.resource && this.resource.manifest || {};
    const deps = manifest.deps || {};
    const res = deps[name] || {};
    return {
      js: res.js || [],
      css: res.css || [],
      state: serialize(state || {}, { isJSON: true }),
    };
  }

  normalizeLocals(ctx, locals = {}, options = {}, engine = true) {
    // egg-view engine mode, the locals had merged
    if (engine) {
      if (this.config.mergeLocals) {
        return this.setLocals(ctx, locals);
      }
    }
    // source locals, no merge locals
    const sourceLocals = options && options.locals ? options.locals : locals;
    // default locals and data merge;
    if (this.config.mergeLocals) {
      locals = Object.assign({}, { ctx, request: ctx.request, helper: ctx.helper }, ctx.locals, sourceLocals);
    } else {
      locals = Object.assign({}, { ctx, request: ctx.request, helper: ctx.helper }, sourceLocals);
    }
    // only data
    return this.setLocals(ctx, locals);
  }

  setLocals(ctx, locals) {
    // when csrf enable, set ctx csrf
    const security = this.app.config.security;
    if (security.csrf && security.csrf.enable) {
      locals = Object.assign({}, { csrf: ctx.csrf }, locals);
    }
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

  renderClient(name, locals, options = {}) {
    const template = this.getTemplate(options);
    // 不进行Vue layout数据绑定编译
    if (options.viewEngine === null) {
      const html = this.resource ? this.resource.inject(template, name, locals, options) : template;
      return Promise.resolve(html);
    }
    options.viewEngine = 'vue';
    return this.renderString(template, locals, options).then(html => {
      return this.resource ? this.resource.inject(html, name, locals, options) : html;
    });
  }

  renderAsset(ctx, name, locals, options = {}) {
    const viewEngine = options.viewEngine || this.config.viewEngine || 'nunjucks';
    // 输出到页面的 state 数据
    const state = Object.assign({}, ctx.locals, locals);
    const asset = this.getAsset(name, state);
    const template = this.getTemplate(options);
    assert(template, 'layout is missing, please set vuessr.layout or options.layout');
    const context = Object.assign({}, locals, { asset });
    // egg-view 自动合并 ctx, request, response, helper
    return ctx.renderString(template, context, { viewEngine });
  }


  renderView(ctx, name, locals, options = {}) {
    locals = this.normalizeLocals(ctx, locals, options, false);
    const filepath = path.join(this.app.config.view.root[0], name);
    const context = { state: locals };
    return this.render(filepath, context, options).then(html => {
      return this.resource.inject(html, name, context, options);
    });
  }
}

module.exports = Engine;
