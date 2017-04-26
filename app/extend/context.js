'use strict';
const path = require('path');
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
    const root = this.app.config.view.root[0];
    const filepath = path.join(root, name);
    const code = yield this.app.vue.readFile(filepath);
    const template = options.renderOptions && options.renderOptions.template || this.app.vue.resource.template;
    const context = { state: locals };
    const html = yield this.app.vue.renderCode(code, context, options).catch(err => {
      if (config.fallbackToClient) {
        this.app.logger.error('[%s] server render bundle error, try client render, the server render error', name, err);
        return this.renderString(template, context.state);
      }
      throw err;
    });
    this.body = this.app.vue.resource.inject(name, html, context, config);
  },
};
