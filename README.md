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

vue server side render solution for egg-view-vue

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

## Configuration

```js
// {app_root}/config/config.default.js
exports.vuessr = {
 // layout: path.join(app.baseDir, 'app/view/layout.html'),
 // manifest: path.join(app.baseDir, 'config/manifest.json'),
 // buildConfig: path.join(app.baseDir, 'config/buildConfig.json'),
 // injectCss: true,
 // injectJs: true,
 // injectRes: []
 // fallbackToClient: true, // fallback to client rendering after server rendering failed
 // afterRender: (html, context) => {
 //      return html;
 // },
};
```

## Render

### Server Render, call `render` method

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


