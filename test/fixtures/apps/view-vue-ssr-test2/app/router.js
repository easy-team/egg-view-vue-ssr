'use strict';

module.exports = app => {
  app.get('/', function* () {
    this.body = 'hi, vue ssr';
  });
  app.get('/render', app.controller.view.render);
  app.get('/renderString', app.controller.view.renderString);
  app.get('/renderClient', app.controller.view.renderClient);
  app.get('/renderVueClient', app.controller.view.renderVueClient);
  app.get('/renderServerError', app.controller.view.renderServerError);
};
