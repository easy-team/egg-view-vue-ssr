# egg-view-vue-ssr

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-vue-ssr.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-vue-ssr
[travis-image]: https://img.shields.io/travis/hubcarl/egg-view-vue-ssr.svg?style=flat-square
[travis-url]: https://travis-ci.org/hubcarl/egg-view-vue-ssr
[codecov-image]: https://img.shields.io/codecov/c/github/hubcarl/egg-view-vue-ssr.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hubcarl/egg-view-vue-ssr?branch=master
[david-image]: https://img.shields.io/david/hubcarl/egg-view-vue-ssr.svg?style=flat-square
[david-url]: https://david-dm.org/hubcarl/egg-view-vue-ssr
[snyk-image]: https://snyk.io/test/npm/egg-view-vue-ssr/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-view-vue-ssr
[download-image]: https://img.shields.io/npm/dm/egg-view-vue-ssr.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-view-vue-ssr

Vue Server Side Render Plugin for Egg.

## Feature

- Support Vue [Server Side Render Mode](https://www.yuque.com/easy-team/egg-vue/node) And [Vue Client Render Mode](https://www.yuque.com/easy-team/egg-vue/web)
- Support [Asset Render](https://www.yuque.com/easy-team/egg-vue/asset) Layout by Nunjucks Or ejs Enigne 
- Support Vue Server Side Render Error, Auto Try Client Render
- Support Static Resouce Auto Inject to Html

## Install

```bash
$ npm i egg-view-vue-ssr --save
```

## Document

https://www.yuque.com/easy-team/egg-vue

## Usage

```js
// {app_root}/config/plugin.js
exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.vuessr = {
 // layout: path.join(app.baseDir, 'app/view/layout.html'),
 // manifest: path.join(app.baseDir, 'config/manifest.json'),
 // injectCss: true,
 // injectJs: true,
 // fallbackToClient: true, // fallback to client rendering after server rendering failed
 // afterRender: (html, ctx) => {
 //   return html;
 // },
};
```
- **doctype**: {String} html content will auto add `<!doctype html>`, you can set `doctype: ''` 
- **layout**: {String} client render template, support renderString compile
- **manifest**: {Object} static resource dependence, the content such as:

```json
{
  "app/app.js": "/public/js/app/app.js",
  "vendor.js": "/public/js/vendor.js",
  "deps": {
    "app/app.js": {
      "js": [
        "/public/js/vendor.js",
        "/public/js/app/app.js"
      ],
      "css": [
        "/public/css/vendor.css",
        "/public/css/app.css"
      ]
    }
  }
}
```
- **injectCss**: {Boolean} whether inject href css, default true
- **injectJs**: {Boolean} whether inject src script, default true
- **injectRes**: {Boolean} inline/inject css or js to file head or body. include location and src config
  inline {Boolean} true or false, default false
  location {String} headBefore, headAfter, bodyBefore, bodyAfter  insert location, default headBefore
  url {String} inline file absolution path
- **viewEngine** egg-view render engine, only valid when renderAsset rendering，default nunjucks
- **mergeLocals** {Boolean} whether merge ctx locals to data, default true
- **crossorigin**: {Boolean} js cross domain support for cdn js error catch, default false
- **fallbackToClient**: {Boolean} fallback to client rendering if server render failed, default true
- **cache**: lru-cache options @see https://www.npmjs.com/package/lru-cache
- **renderOptions**: @see https://ssr.vuejs.org/en/api.html#renderer-options
- **afterRender**:  afterRender hook html after render

## Render

### Server Render, Call `render`

> when server render bundle error, will try client render**

> https://www.yuque.com/easy-team/egg-vue/node

```js
// controller/home.js
exports.index = function* (ctx) {
  yield ctx.render('index/index.js', { message: 'egg vue server side render'});
};
```

### Server Render, Call `renderToHtml`

> when server render bundle error, will try client render**

> https://www.yuque.com/easy-team/egg-vue/node

```js
// controller/home.js
exports.index = function* (ctx) {
  const html = yield ctx.renderToHtml('index/index.js', { message: 'egg vue server side render'});
  // you can process html
  ctx.body = html;
};
```

### Client Render, Call `renderClient`, Use Vue render layout

> https://www.yuque.com/easy-team/egg-vue/web

> when client render, render layout `exports.vuessr.layout` by Vue

```js
// controller/home.js
exports.client = function* (ctx) {
  yield ctx.renderClient('index/index.js',{ message: 'egg vue client render'});
};
```

### Asset Render, Call `renderAsset`, Use render layout by viewEngine, default `nunjucks`

> https://www.yuque.com/easy-team/egg-vue/asset

- when asset render, you can render layout `exports.vuessr.layout` by viewEngine, default use `egg-view-nunjucks`
- you must install the specified engine dependence, such as `egg-view-nunjucks` or `egg-view-ejs`
- The context provides an `asset` object that can get `js`, `css`, `state` information. [layout template](https://www.yuque.com/easy-team/egg-vue/asset)

#### use default viewEngine nunjucks

```js
// controller/home.js
exports.asset = function* (ctx) {
  yield ctx.renderAsset('index/index.js', { message: 'egg vue asset render'});
};
```

#### scope render viewEngine config

```js
// controller/home.js
exports.asset = function* (ctx) {
  yield ctx.renderAsset('index/index.js', { message: 'egg vue asset render'}, { viewEngine: 'ejs' });
};
```

- see [config/config.default.js](config/config.default.js) for more detail.
- see [egg-vue-asset-boilerplate](https://github.com/easy-team/egg-vue-webpack-boilerplate/tree/feature/green/asset) examples 

## Questions & Suggestions

Please open an issue [here](https://github.com/easy-team/egg-view-vue-ssr/issues).

## License

[MIT](LICENSE)


