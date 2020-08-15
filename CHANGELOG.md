<a name="3.3.3"></a>
## [3.3.3](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.3.2...3.3.3) (2020-08-15)

### Bug Fixes

* serialize-javascript from 2.1.2 to 4.0.0 ([c2ac53d](https://github.com/hubcarl/egg-view-vue-ssr/commit/c2ac53d))


<a name="3.3.2"></a>
## [3.3.2](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.3.1...3.3.2) (2020-01-16)



<a name="3.3.1"></a>
## [3.3.1](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.3.0...3.3.1) (2019-06-27)


### Bug Fixes

* render no manifest error ([2f8fa10](https://github.com/hubcarl/egg-view-vue-ssr/commit/2f8fa10))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.2.1...3.3.0) (2019-01-09)


### Features

* add ssr renderToHtml method to context ([e23ff87](https://github.com/hubcarl/egg-view-vue-ssr/commit/e23ff87))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.2.0...3.2.1) (2018-12-18)


### Bug Fixes

* restore renderVueClient body set ([af7ab19](https://github.com/hubcarl/egg-view-vue-ssr/commit/af7ab19))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.1.3...3.2.0) (2018-12-13)


### Features

* support asset ([816dc8f](https://github.com/hubcarl/egg-view-vue-ssr/commit/816dc8f))
* support asset render ([857fb54](https://github.com/hubcarl/egg-view-vue-ssr/commit/857fb54))



<a name="3.1.3"></a>
## [3.1.3](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.1.2...3.1.3) (2018-09-06)


### Bug Fixes

* renderClient set options.layout ([fd0b4cf](https://github.com/hubcarl/egg-view-vue-ssr/commit/fd0b4cf))



<a name="3.1.2"></a>
## [3.1.2](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.1.1...3.1.2) (2018-07-20)


### Bug Fixes

* merge locals JSON.stringify enumerable when mergeLocals=true ([d9fa7f8](https://github.com/hubcarl/egg-view-vue-ssr/commit/d9fa7f8))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.1.0...3.1.1) (2018-07-20)


### Bug Fixes

* render client locals merge ([406316a](https://github.com/hubcarl/egg-view-vue-ssr/commit/406316a))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.0.8...3.1.0) (2018-05-31)


### Features

* support config.mergeLocals config and set runInNewContext default once ([ae5ad18](https://github.com/hubcarl/egg-view-vue-ssr/commit/ae5ad18))



<a name="3.0.8"></a>
## [3.0.8](https://github.com/hubcarl/egg-view-vue-ssr/compare/3.0.7...3.0.8) (2018-03-15)


### Bug Fixes

* csrf not set for egg-security ([7f68210](https://github.com/hubcarl/egg-view-vue-ssr/commit/7f68210))



3.0.7 / 2018-03-08
==================

  * deps: add vue-server-renderer independence

3.0.5 / 2018-01-31
==================

  * refactor: local env auto set injectCss: false
  * Release 3.0.4
  * fix:locals is undefined error
  * doc: style
  * doc: add version doc
  * test:support node6 test
  * test: add client render test
  * doc: add config doc

3.0.4 / 2018-01-06
==================

  * fix:locals is undefined error

3.0.3 / 2017-12-25
==================

  * fix: remove ctx, request, helper attr from locals use Object.defineProperty
  * deps:add server-side-render-resource dependence

3.0.2 / 2017-11-16
==================

  * deps: add server-side-render-resource dependence

3.0.0: / 2017-11-16
==================

  * feat: vue server render not dependence egg-view-vue and independent js/css resource plugin
  * refacor: not dependence egg-view-vue;

2.1.1 / 2017-08-28
==================

  * fix:node async and await
  * Release 2.1.0
  * feat:add renderClient method
  * Release 2.0.2
  * feat:inline resource mapping
  * Release 2.0.1
  * feat:support injectRes config
  * Release 2.0.0
  * fix:render file path error for egg-view-vue
  * refactor: use eggjs plugin: egg-view-vue
  * refactor:eggjs-egg-view-vue
  * fix:test case data
  * refactor:remove resouce prefix
  * docs:publish
  * feat:support css inline

2.1.0 / 2017-07-31
==================

  * feat:add renderClient method

2.0.5 / 2017-07-17
==================

  * feat:and config crossorigin attr,support cdn js error catch

2.0.4 / 2017-07-12
==================

  * fix:local file and manifest inline
  * fix:file inline path error

2.0.2 / 2017-07-11
==================

  * feat:inline resource mapping

2.0.1 / 2017-07-05
==================

  * feat:support injectRes config

2.0.0 / 2017-07-03
==================

  * fix:render file path error for egg-view-vue
  * refactor: use eggjs plugin: egg-view-vue
  * refactor:eggjs-egg-view-vue

1.0.0 / 2017-05-22
==================

  * refactor:remove resouce prefix
  * docs:publish
  * feat:support css inline

0.1.0 / 2017-05-12
==================

  * feat:support css inline
  * doc:update readme

0.0.4 / 2017-04-26
==================

  * feat: add switch for server render error fallback
  * feat:support inline css and inject css/js config, html render hook
  * refactor: change  data to {state:data} support renderbundle  vuex state
  * feat:support template
  * feat:support renderbunder option config

0.0.3 / 2017-04-25
==================

  * feat:support inline css and inject css/js config, html render hook

0.0.2 / 2017-04-25
==================

  * refactor: change  data to {state:data} support renderbundle  vuex state
  * style:rm test code
  * feat:support renderbunder option config
  * doc:readme
