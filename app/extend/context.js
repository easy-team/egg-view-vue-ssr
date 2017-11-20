'use strict';

const Cache = require('node-cache');
const merge = require('lodash.merge')
const path = require('path');

let cache = null;

let useCacheIfAllowed = cacheConfig => {
  useCacheIfAllowed = () => cache;

  if (!cacheConfig) {
    return cache;
  }

  if (cacheConfig === true) {
    // 默认 cache 选项
    return (cache = new Cache({
      stdTTL: 20,
    }));
  }

  if (typeof cacheConfig !== 'object') {
    return cache;
  }

  if (cacheConfig.set && cacheConfig.get) {
    return (cache = cacheConfig)
  }

  return (cache = new Cache({ ...cacheConfig, useClones: false }))
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
    merge(options, {
      renderOptions: {
        runInNewContext: 'once',
      },
    })

    locals = Object.assign({}, this.app.locals, this.locals, locals);

    const config = this.app.config.vuessr;

    let promise = null;
    let cacheKey = '';
    const cache = useCacheIfAllowed(config.cache);
    if (cache) {
      cacheKey = JSON.stringify({
        name, locals, options,
      });
      promise = cache.get(cacheKey);
    }

    if (!promise) {
      const context = { state: locals };
      const template = options.renderOptions.template || this.app.vue.resource.template;
      if (options.renderClient) {
        promise = this.renderString(template, context.state);
      } else {
        const filepath = path.join(this.app.config.view.root[0], name);
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
