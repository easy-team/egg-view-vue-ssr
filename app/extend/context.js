'use strict';
module.exports = {
  renderClient(name, locals, options) {
    return this.renderVueClient(name, locals, options).then(html => {
      this.body = html;
    });
  },
  renderAsset(name, locals, options) {
    return this.renderVueAsset(name, locals, options).then(html => {
      this.body = html;
    });
  },
  renderVueAsset(name, locals, options) {
    return this.app.vue.renderAsset(this, name, locals, options);
  },
  renderVueClient(name, locals, options = {}) {
    locals = this.app.vue.normalizeLocals(this, locals, options, false);
    return this.app.vue.renderClient(name, locals, options);
  },
};

