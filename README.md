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

vue server side render solution for egg.

- support vue server side render and static resource inject html
- support vue server side render error, auto try client render

## Install

```bash
$ npm i egg-view-vue-ssr --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr',
};
```
## Version

#### 1.x.x-2.x.x

egg-view-vue-ssr depends on egg-view-vue plugin

#### 3.x.x

- 3.x.x(egg-view-vue-ssr) no longer depends on egg-view-vue plugin, egg-view-vue-ssr has an independent function that can run on its own

- vue and vue-server-renderer are not inside in plugin dependence

## Configuration

```js
// {app_root}/config/config.default.js
exports.vuessr = {
 // layout: path.join(app.baseDir, 'app/view/layout.html'),
 // manifest: path.join(app.baseDir, 'config/manifest.json'),
 // injectCss: true,
 // injectJs: true,
 // injectRes: []
 // fallbackToClient: true, // fallback to client rendering after server rendering failed
 // afterRender: (html, context) => {
 //   return html;
 // },
};
```
- **doctype**: html content will auto add `<!doctype html>`, you can set `doctype: ''` 
- **layout**: client render template, support renderString compile
- **manifest**: static resource dependence, the content such as:

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
- **injectCss**: whether inject href css, default true
- **injectJs**: whether inject src script, default true
- **injectRes**: inline/inject css or js to file head or body. include location and src config
  inline {Boolean} true or false, default false
  location {String} headBefore, headAfter, bodyBefore, bodyAfter  insert location, default headBefore
  url {String} inline file absolution path
- **crossorigin**: js cross domain support for cdn js error catch, default false
- **fallbackToClient**: fallback to client rendering if server render failed, default true
- **cache**: lru-cache options @see https://www.npmjs.com/package/lru-cache
- **renderOptions**: @see https://ssr.vuejs.org/en/api.html#renderer-options
- **afterRender**:  afterRender hook html after render

## Render

### Server Render, call `render` method

**Note: when server render bundle error, will try client render**

```js
// controller/home.js
exports.index = function* (ctx) {
  yield ctx.render('index/index.js', Model.getPage(1, 10));
};
```

### Client Render, Call `renderClient`  or  build static html to `egg-static` dir by Webpack.

when client render , the template is `exports.vuessr.layout`

```js
// controller/home.js
exports.client = function* (ctx) {
  yield ctx.renderClient('index/index.js', Model.getPage(1, 10));
};
```


see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/hubcarl/egg-view-vue-ssr/issues).

## License

[MIT](LICENSE)


