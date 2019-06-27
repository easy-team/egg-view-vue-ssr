'use strict';

class View {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = this.app.config.vuessr;
  }

  /**
   * render vue bundle file
   * @function Context#render
   * @param {String} name filename
   * @param {Object} [locals] template data
   * @param {Object} options custom params
   * @return {Object} Promise
   */
  render(name, locals, options = {}) {
    locals = this.app.vue.normalizeLocals(this.ctx, locals, options);
    const context = { state: locals };
    return this.app.vue.render(name, context, options).then(html => {
      if (this.app.vue.resource) {
        return this.app.vue.resource.inject(html, options.name, context, options);
      }
      return html;
    }).catch(err => {
      if (this.config.fallbackToClient) {
        this.app.logger.error('[%s] server render bundle error, try client render, the server render error', name, err);
        return this.app.vue.renderClient(options.name, locals, options);
      }
      throw err;
    });
  }

  renderString(tpl, locals) {
    locals = this.app.vue.normalizeLocals(this.ctx, locals);
    return this.app.vue.renderString(tpl, locals);
  }
}

module.exports = View;
