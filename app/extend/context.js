'use strict';
const path = require('path');
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
    let promise;
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
    return promise.then(html => {
      this.body = this.app.vue.resource.inject(html, context, name, config, options);
    });
  },

  vueRenderClient(name, locals, options = {}) {
    options.renderClient = true;
    return this.vueRender(name, locals, options);
  },
};
