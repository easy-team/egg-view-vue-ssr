'use strict';

exports.renderString = function* (ctx) {
  ctx.body = yield ctx.renderString('<div>name:{{name}},desc:{{desc}}</div>', {
    name: 'egg-vue-view',
    desc: 'egg view plugin for vue',
  });
};

exports.renderStringError = function* (ctx) {
  try {
    ctx.body = yield ctx.renderString('<div>name:{{user.name}},desc:{{user.desc}}</div>', {
      name: 'egg-vue-view',
      desc: 'egg view plugin for vue',
    });
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.toString();
  }
};

exports.render = function* (ctx) {
  this.app.locals.title = 'app_locals_render_ssr';
  this.locals.description = 'app_context_locals_render_ssr';
  yield ctx.render('test/test.js', { message: 'vue server side render!' });
};

exports.renderLocals = function* (ctx) {
  this.app.locals.title = 'app_locals_render_ssr';
  this.locals.description = 'app_context_locals_render_ssr';
  yield ctx.render('test/test.js', { message: 'vue server side render!' });
};

exports.renderServerError = function* (ctx) {
  yield ctx.render('error/error.js', {
    keywords: 'ssr',
    description: 'vue server render error, client render',
  });
};

exports.renderClient = function* (ctx) {
  yield ctx.renderClient('test/test.js', { message: 'vue server side render!' });
};

exports.renderVueClient = function* (ctx) {
  yield ctx.renderVueClient('test/test.js', { message: 'vue server side render!' });
};