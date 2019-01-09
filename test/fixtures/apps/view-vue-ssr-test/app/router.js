'use strict';

module.exports = app => {
  app.get('/', function* () {
    this.body = 'hi, vue ssr';
  });
  app.get('/render', app.controller.view.render);
  app.get('/renderToHtml', app.controller.view.renderToHtml);
  app.get('/renderLocals', app.controller.view.renderLocals);
  app.get('/renderString', app.controller.view.renderString);
  app.get('/renderClient', app.controller.view.renderClient);
  app.get('/renderAsset', app.controller.view.renderAsset);
  app.get('/renderVueAsset', app.controller.view.renderVueAsset);
  app.get('/renderVueClient', app.controller.view.renderVueClient);
  app.get('/renderServerError', app.controller.view.renderServerError);
};
