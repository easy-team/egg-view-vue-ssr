'use strict';
module.exports = {

  /**
   * render vue bundle file
   * @method Context#render
   * @param {String} name filename
   * @param {Object} [locals] template data
   * @param {Object} options custom params
   */
  * render(name, locals, options = {}) {
    locals = Object.assign({}, this.app.locals, this.locals, locals);
    const config = this.app.config.vuessr;
    const template = options.renderOptions && options.renderOptions.template || this.app.vue.resource.template;
    const context = { state: locals };
    const html = yield this.app.vue.renderBundle(name, context, options).catch(err => {
      if (config.fallbackToClient) {
        this.app.logger.error('[%s] server render bundle error, try client render, the server render error', name, err);
        return this.renderString(template, context.state);
      }
      throw err;
    });
    this.body = this.app.vue.resource.inject(name, html, context, config, options);
  },
};
