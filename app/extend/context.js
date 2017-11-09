'use strict';

const LRU = require('lru-cache');
const path = require('path');

let cache = null;

let useCacheIfAllowed = cacheConfig => {
  useCacheIfAllowed = () => cache;

  if (!cacheConfig) {
    return cache;
  }

  if (cacheConfig === true) {
    // 默认 cache 选项
    return (cache = LRU({
      max: 1000,
      maxAge: 20 * 1000,
    }));
  }

  if (typeof cacheConfig !== 'object') {
    return cache;
  }

  return (cache = (cacheConfig.set && cacheConfig.get) ? cacheConfig : LRU(cacheConfig));
};

module.exports = {

  /**
   * render vue bundle file
   * @method Context#vueRender
   * @param {String} name filename
   * @param {Object} [locals] template data
   * @param {Object} options custom params
   * @return {Promise} set body content when fulfilled
   */
  vueRender(name, locals, options = {}) {
    locals = Object.assign({}, this.app.locals, this.locals, locals);
    const config = this.app.config.vuessr;
    const template = options.renderOptions && options.renderOptions.template || this.app.vue.resource.template;
    const context = { state: locals };
    const filepath = path.join(this.app.config.view.root[0], name);

    let promise = null;
    let cacheKey = '';
    const cache = useCacheIfAllowed(config);
    if (cache) {
      cacheKey = JSON.stringify({
        name, locals, options,
      });
      promise = cache.get(cacheKey);
    }

    if (!promise) {
      if (options.renderClient) {
        promise = this.renderString(template, context.state);
      } else {
        promise = this.app.vue.renderBundle(filepath, context, options).catch(err => {
          if (config.fallbackToClient) {
            this.app.logger.error('[%s] server render bundle error, try client render, the server render error', name, err);
            return this.renderString(template, context.state);
          }
          throw err;
        });
      }

      promise = promise.then(html => {
        return this.app.vue.resource.inject(html, context, name, config, options);
      });

      if (cache) {
        cache.set(cacheKey, promise);
      }
    }

    return promise.then(html => {
      this.body = html;
    });
  },

  vueRenderClient(name, locals, options = {}) {
    options.renderClient = true;
    return this.vueRender(name, locals, options);
  },
};
