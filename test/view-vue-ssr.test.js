'use strict';
const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/view-vue-ssr.test.js', () => {

  describe('default view engine', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/view-vue-ssr-test',
      });
      return app.ready();
    });

    after(() => app.close());
    afterEach(mm.restore);

    it('should GET /', () => {
      return request(app.callback())
        .get('/')
        .expect('hi, vue ssr')
        .expect(200);
    });

    it('should GET /renderString', () => {
      return request(app.callback())
        .get('/renderString')
        .expect('<div server-rendered="true">name:egg-vue-view,desc:egg view plugin for vue</div>')
        .expect(200);
    });

    it('should GET /render', () => {
      return request(app.callback())
        .get('/render')
        .expect(200)
        .expect(res => {
          assert(res.text.match(new RegExp('<title>app_locals_render_ssr</title>', 'g')));
          assert(res.text.match(new RegExp('<meta name="description" content="app_context_locals_render_ssr">', 'g')));
          assert(res.text.match(new RegExp('"title":"app_locals_render_ssr"', 'g')));
          assert(res.text.match(new RegExp('"description":"app_context_locals_render_ssr"', 'g')));
          assert(res.text.indexOf('server-rendered="true"') > -1);
          assert(res.text.indexOf('</body></html>') > -1);
          assert(res.text.indexOf('vue server side render!') > -1);
          assert(res.text.indexOf('/public/static/css/test/test.css') > -1);
          assert(res.text.indexOf('/public/static/js/vendor.js"') > -1);
          assert(res.text.indexOf('/public/static/js/test/test.js"') > -1);
        });
    });

    it('should GET /render server error, client render', () => {
      return request(app.callback())
        .get('/renderServerError')
        .expect(200)
        .expect(res => {
          assert(res.text.match(new RegExp('<meta name="keywords" content="ssr">', 'g')));
          assert(res.text.match(new RegExp('<meta name="description" content="vue server render error, client render">', 'g')));
          assert(res.text.indexOf('vue server render error, client render') > -1);
          assert(res.text.indexOf('/public/static/css/error/error.css') > -1);
          assert(res.text.indexOf('/public/static/js/vendor.js"') > -1);
          assert(res.text.indexOf('/public/static/js/error/error.js"') > -1);
        });
    });

    it('should GET /render server error, don\'t fallback', () => {
      mm(app.config.vuessr, 'fallbackToClient', false);

      return request(app.callback())
        .get('/renderServerError')
        .expect(500);
    });
  });

});
