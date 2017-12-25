'use strict';
module.exports = {
  renderClient(name, locals, options) {
    return this.renderVueClient(name, locals, options);
  },
  renderVueClient(name, locals, options = {}) {
    locals = this.app.vue.normalizeLocals(locals);
    return this.app.vue.renderClient(name, locals, options).then(html => {
      this.body = html;
    });
  },
};
