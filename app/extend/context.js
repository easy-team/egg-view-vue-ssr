'use strict';
module.exports = {
  renderClient(name, locals, options) {
    return this.renderVueClient(name, locals, options);
  },
  renderAsset(name, locals, options) {
    return this.renderVueAsset(name, locals, options);
  },
  renderToHtml(name, locals, options = {}) {
    return this.app.vue.renderView(this, name, locals, options);
  },
  renderVueAsset(name, locals, options = {}) {
    return this.app.vue.renderAsset(this, name, locals, options).then(html => {
      this.body = html;
    });
  },
  renderVueClient(name, locals, options = {}) {
    locals = this.app.vue.normalizeLocals(this, locals, options, false);
    return this.app.vue.renderClient(name, locals, options).then(html => {
      this.body = html;
    });
  },
};

