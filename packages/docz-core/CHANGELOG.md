# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.13.4](https://github.com/pedronauck/docz/compare/v0.13.3...v0.13.4) (2018-12-17)

**Note:** Version bump only for package docz-core





## [0.13.3](https://github.com/pedronauck/docz/compare/v0.13.2...v0.13.3) (2018-12-17)


### Bug Fixes

* **docz-core:** react hot loader config for hooks ([444cac2](https://github.com/pedronauck/docz/commit/444cac2))


### Features

* **docz-core:** add sourcemap config argument ([3baad4a](https://github.com/pedronauck/docz/commit/3baad4a))





## [0.13.2](https://github.com/pedronauck/docz/compare/v0.13.1...v0.13.2) (2018-12-17)


### Bug Fixes

* **docz-core:** ensure dir for promise logger ([6240f21](https://github.com/pedronauck/docz/commit/6240f21))





## [0.13.1](https://github.com/pedronauck/docz/compare/v0.13.0...v0.13.1) (2018-12-17)


### Bug Fixes

* **docz-core:** typescript loader config ([01f568e](https://github.com/pedronauck/docz/commit/01f568e))





# [0.13.0](https://github.com/pedronauck/docz/compare/v0.12.17...v0.13.0) (2018-12-17)


### Bug Fixes

* **docz-core:** add setMaxListener for chokidar watchers ([6053c16](https://github.com/pedronauck/docz/commit/6053c16))
* **docz-core:** log level based on debug argument ([507e149](https://github.com/pedronauck/docz/commit/507e149))
* **docz-core:** node path resolve modules merge ([27102fd](https://github.com/pedronauck/docz/commit/27102fd))
* **docz-core:** turn off htmlMinifier when loading from templates ([#518](https://github.com/pedronauck/docz/issues/518)) ([9cb0e1d](https://github.com/pedronauck/docz/commit/9cb0e1d))
* **docz-core:** use webpack-dev-server instead of webpack-serve ([4157e05](https://github.com/pedronauck/docz/commit/4157e05))


### Features

* **docz-core:** add onCreateWebpackChain hook ([70bb242](https://github.com/pedronauck/docz/commit/70bb242))
* **docz-core:** add promise logger using progress-estimator ([2797608](https://github.com/pedronauck/docz/commit/2797608))
* **docz-core:** use NODE_PATH to resolve modules ([#516](https://github.com/pedronauck/docz/issues/516)) ([cc86f93](https://github.com/pedronauck/docz/commit/cc86f93))





## [0.12.16](https://github.com/pedronauck/docz/compare/v0.12.15...v0.12.16) (2018-12-13)


### Bug Fixes

* **docz-core:** correct koa mounting path on windows systems ([#491](https://github.com/pedronauck/docz/issues/491)) ([6addd32](https://github.com/pedronauck/docz/commit/6addd32))





## [0.12.15](https://github.com/pedronauck/docz/compare/v0.12.14...v0.12.15) (2018-12-04)


### Bug Fixes

* **docz-core:** add setMaxListener in the top of script ([2eef307](https://github.com/pedronauck/docz/commit/2eef307))
* **docz-core:** update react-hot-loader to support hooks ([4394a5b](https://github.com/pedronauck/docz/commit/4394a5b))


### Features

* add native support for react-native ([f998874](https://github.com/pedronauck/docz/commit/f998874))





## [0.12.14](https://github.com/pedronauck/docz/compare/v0.12.13...v0.12.14) (2018-12-04)


### Bug Fixes

* **docz-core:** set max listener ([898010b](https://github.com/pedronauck/docz/commit/898010b))
* **docz-core:** watcher close ([caa8151](https://github.com/pedronauck/docz/commit/caa8151))





## [0.12.13](https://github.com/pedronauck/docz/compare/v0.12.12...v0.12.13) (2018-11-23)

**Note:** Version bump only for package docz-core





## [0.12.12](https://github.com/pedronauck/docz/compare/v0.12.11...v0.12.12) (2018-11-16)

**Note:** Version bump only for package docz-core





## [0.12.11](https://github.com/pedronauck/docz/compare/v0.12.10...v0.12.11) (2018-11-15)


### Bug Fixes

* **docz-core:** add happypack again :cry: ([f0e219e](https://github.com/pedronauck/docz/commit/f0e219e))
* **docz-core:** create app files before start server ([43bc3fd](https://github.com/pedronauck/docz/commit/43bc3fd))





## [0.12.10](https://github.com/pedronauck/docz/compare/v0.12.9...v0.12.10) (2018-11-15)


### Bug Fixes

* **docz-core:** add cache just for non-debug ([cede436](https://github.com/pedronauck/docz/commit/cede436))
* **docz-core:** add default favicon ([a0ed2ab](https://github.com/pedronauck/docz/commit/a0ed2ab))
* **docz-core:** add ignore md files by args ([d8c8045](https://github.com/pedronauck/docz/commit/d8c8045))
* **docz-core:** kill server on signals ([be0855f](https://github.com/pedronauck/docz/commit/be0855f))
* **docz-core:** use assets from public folder ([210c3a1](https://github.com/pedronauck/docz/commit/210c3a1))


### Features

* **docz-core:** add detect-one-changed in development ([#433](https://github.com/pedronauck/docz/issues/433)) ([0585b97](https://github.com/pedronauck/docz/commit/0585b97))
* **docz-core:** add two new plugin hooks ([#431](https://github.com/pedronauck/docz/issues/431)) ([f4a122f](https://github.com/pedronauck/docz/commit/f4a122f))





## [0.12.9](https://github.com/pedronauck/docz/compare/v0.12.8...v0.12.9) (2018-11-01)

**Note:** Version bump only for package docz-core





## [0.12.8](https://github.com/pedronauck/docz/compare/v0.12.7...v0.12.8) (2018-10-31)


### Bug Fixes

* **docz-core:** add support to react hooks ([f26a990](https://github.com/pedronauck/docz/commit/f26a990))





## [0.12.7](https://github.com/pedronauck/docz/compare/v0.12.6...v0.12.7) (2018-10-30)


### Bug Fixes

* **docz-core:** webpack chain minimizer config ([ab13208](https://github.com/pedronauck/docz/commit/ab13208))





## [0.12.6](https://github.com/pedronauck/docz/compare/v0.12.5...v0.12.6) (2018-10-30)


### Features

* add support to disable codesandbox ([be94b0e](https://github.com/pedronauck/docz/commit/be94b0e))





<a name="0.12.5"></a>
## [0.12.5](https://github.com/pedronauck/docz/compare/v0.12.4...v0.12.5) (2018-09-30)


### Bug Fixes

* **docz-core:** close dataserver connection on build ([0f6bd7b](https://github.com/pedronauck/docz/commit/0f6bd7b))





<a name="0.11.2"></a>
## [0.11.2](https://github.com/pedronauck/docz/compare/v0.11.1...v0.11.2) (2018-09-11)


### Bug Fixes

* **docz-core:** add watcher outside of update method scope ([18c744d](https://github.com/pedronauck/docz/commit/18c744d))
* **docz-core:** prevent entries block when parse mdx crash ([07ae769](https://github.com/pedronauck/docz/commit/07ae769))
* **docz-core:** remove https option and fix message ([#321](https://github.com/pedronauck/docz/issues/321)) ([ea88841](https://github.com/pedronauck/docz/commit/ea88841))
* heading hash link with hash router config ([7d7f557](https://github.com/pedronauck/docz/commit/7d7f557))


### Features

* add native config for doczrc ([2580712](https://github.com/pedronauck/docz/commit/2580712))





<a name="0.11.1"></a>
## [0.11.1](https://github.com/pedronauck/docz/compare/v0.11.0...v0.11.1) (2018-09-07)


### Bug Fixes

* **docz-core:** basename configuration ([5fad743](https://github.com/pedronauck/docz/commit/5fad743))
* **docz-core:** chokidar performance improvements ([0c344d8](https://github.com/pedronauck/docz/commit/0c344d8))
* **docz-core:** literal value of headings for menus ([85e4083](https://github.com/pedronauck/docz/commit/85e4083))
* **docz-core:** open js and ts loader scope of files ([03c01b7](https://github.com/pedronauck/docz/commit/03c01b7))


### Features

* **docz-core:** add config as parameter for onPrebuild and onPostBuild ([98692bb](https://github.com/pedronauck/docz/commit/98692bb))





<a name="0.11.0"></a>
# [0.11.0](https://github.com/pedronauck/docz/compare/v0.10.3...v0.11.0) (2018-09-02)


### Bug Fixes

* base url and hash router making weird url ([f483638](https://github.com/pedronauck/docz/commit/f483638))
* **docz-core:** dispose hmr on imports ([ba51086](https://github.com/pedronauck/docz/commit/ba51086))
* **docz-core:** join head tags ([#255](https://github.com/pedronauck/docz/issues/255)) ([065e8b3](https://github.com/pedronauck/docz/commit/065e8b3))
* **docz-core:** update react-docgen-typescript-loader to fix props table ([34b2fdf](https://github.com/pedronauck/docz/commit/34b2fdf))


### Features

* **babel-preset-docz:** add new babel preset ([5efb568](https://github.com/pedronauck/docz/commit/5efb568))





<a name="0.10.3"></a>
## [0.10.3](https://github.com/pedronauck/docz/compare/v0.9.6...v0.10.3) (2018-08-16)


### Bug Fixes

* **docz-core:** correct data server websocket port ([47fe714](https://github.com/pedronauck/docz/commit/47fe714))
* **docz-core:** try catch on get repo info ([2016736](https://github.com/pedronauck/docz/commit/2016736))

### Features

* **docz-core:** add editBranch option to mount repo link ([c619d9c](https://github.com/pedronauck/docz/commit/c619d9c))



<a name="0.10.2"></a>
## [0.10.2](https://github.com/pedronauck/docz/compare/v0.10.1...v0.10.2) (2018-08-13)


### Bug Fixes

* prevent codemirror bug on build ([3d0894e](https://github.com/pedronauck/docz/commit/3d0894e))
* **docz-core:** remove data server cache :confused: ([9683280](https://github.com/pedronauck/docz/commit/9683280))
* **docz-core:** try catch on get repo info ([bdfbf0b](https://github.com/pedronauck/docz/commit/bdfbf0b))




<a name="0.10.1"></a>
## [0.10.1](https://github.com/pedronauck/docz/compare/v0.10.0...v0.10.1) (2018-08-13)


### Bug Fixes

* **docz-core:** prevent crash when not have cache ([cd3609a](https://github.com/pedronauck/docz/commit/cd3609a))




<a name="0.10.0"></a>
# [0.10.0](https://github.com/pedronauck/docz/compare/v0.9.6...v0.10.0) (2018-08-13)


### Bug Fixes

* **docz-core:** prevent crash on delete entry ([28e1728](https://github.com/pedronauck/docz/commit/28e1728))
* **docz-core:** prevent delete entire app folder on build ([e345896](https://github.com/pedronauck/docz/commit/e345896))


### Features

* **docz-core:** add cache system for entries ([b90e598](https://github.com/pedronauck/docz/commit/b90e598))
* **docz-core:** add htmlContext and mini-html-webpack-plugin ([4b6ec0f](https://github.com/pedronauck/docz/commit/4b6ec0f))
* **docz-core:** resolve markdown files by default ([#210](https://github.com/pedronauck/docz/issues/210)) ([e0a95b3](https://github.com/pedronauck/docz/commit/e0a95b3))
* add github repository link ([78a19f6](https://github.com/pedronauck/docz/commit/78a19f6))




<a name="0.9.6"></a>
## [0.9.6](https://github.com/pedronauck/docz/compare/v0.9.5...v0.9.6) (2018-08-06)


### Bug Fixes

* **docz-core:** remove [@babel](https://github.com/babel)/runtime alias ([0dbd8f0](https://github.com/pedronauck/docz/commit/0dbd8f0))




<a name="0.9.4"></a>
## [0.9.4](https://github.com/pedronauck/docz/compare/v0.9.4-beta.1...v0.9.4) (2018-08-04)


### Bug Fixes

* **docz-core:** use of src config in edit button link ([#186](https://github.com/pedronauck/docz/issues/186)) ([553f90c](https://github.com/pedronauck/docz/commit/553f90c))
* remove external deps ([470bdd3](https://github.com/pedronauck/docz/commit/470bdd3))




<a name="0.9.3"></a>
## [0.9.3](https://github.com/pedronauck/docz/compare/v0.9.2...v0.9.3) (2018-08-03)


### Bug Fixes

* **docz-core:** use of src config in edit button link ([#186](https://github.com/pedronauck/docz/issues/186)) ([553f90c](https://github.com/pedronauck/docz/commit/553f90c))




<a name="0.9.2"></a>
## [0.9.2](https://github.com/pedronauck/docz/compare/v0.9.1...v0.9.2) (2018-08-02)


### Bug Fixes

* **docz-core:** add isProd to remove hot client overlay on build ([83f2e36](https://github.com/pedronauck/docz/commit/83f2e36))




<a name="0.9.1"></a>
## [0.9.1](https://github.com/pedronauck/docz/compare/v0.9.0...v0.9.1) (2018-08-02)


### Bug Fixes

* **docz:** finish process after build ([58bebb6](https://github.com/pedronauck/docz/commit/58bebb6))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/pedronauck/docz/compare/v0.9.0-beta.1...v0.9.0) (2018-08-02)


### Bug Fixes

* **docz:** using context for imports to prevent disposed hmr ([b37284c](https://github.com/pedronauck/docz/commit/b37284c))
* **docz-plugin-babel6:** change babel syntax dynamic import when needed ([8cb278a](https://github.com/pedronauck/docz/commit/8cb278a))




<a name="0.9.0-beta.1"></a>
# [0.9.0-beta.1](https://github.com/pedronauck/docz/compare/v0.9.0-beta.0...v0.9.0-beta.1) (2018-08-01)




**Note:** Version bump only for package docz-core

<a name="0.9.0-beta.0"></a>
# [0.9.0-beta.0](https://github.com/pedronauck/docz/compare/v0.8.0...v0.9.0-beta.0) (2018-08-01)


### Bug Fixes

* **docz-core:** remove babel plugin/presets when needed ([011baad](https://github.com/pedronauck/docz/commit/011baad))


### Features

* **docz-core:** add webpack-serve-overlay as error overlay ([263badf](https://github.com/pedronauck/docz/commit/263badf))
* **docz-core:** support env files to set configuration ([#171](https://github.com/pedronauck/docz/issues/171)) ([259b72d](https://github.com/pedronauck/docz/commit/259b72d)), closes [#140](https://github.com/pedronauck/docz/issues/140)
* **docz-theme-default:** add edit button for document ([#180](https://github.com/pedronauck/docz/issues/180)) ([e125a4f](https://github.com/pedronauck/docz/commit/e125a4f))




<a name="0.8.0"></a>
# [0.8.0](https://github.com/pedronauck/docz/compare/v0.7.1...v0.8.0) (2018-07-28)




**Note:** Version bump only for package docz-core

<a name="0.7.0"></a>
# [0.7.0](https://github.com/pedronauck/docz/compare/v0.6.2...v0.7.0) (2018-07-23)




**Note:** Version bump only for package docz-core

<a name="0.6.2"></a>
## [0.6.2](https://github.com/pedronauck/docz/compare/v0.6.1...v0.6.2) (2018-07-20)


### Bug Fixes

* **docz-core:** set env vars for commands ([29f0098](https://github.com/pedronauck/docz/commit/29f0098))




<a name="0.6.0"></a>
# [0.6.0](https://github.com/pedronauck/docz/compare/v0.5.9...v0.6.0) (2018-07-19)


### Bug Fixes

* **docz-core:** add error when dest is working directory ([b1c87b5](https://github.com/pedronauck/docz/commit/b1c87b5))
* **docz-core:** process.env vars for scripts ([f6b6260](https://github.com/pedronauck/docz/commit/f6b6260))
* **docz-core:** serve static files from public ([c866856](https://github.com/pedronauck/docz/commit/c866856))


### Features

* **docz-core:** add onCreateApp plugin method ([13c07e7](https://github.com/pedronauck/docz/commit/13c07e7))




<a name="0.5.9"></a>
## [0.5.9](https://github.com/pedronauck/docz/compare/v0.5.8...v0.5.9) (2018-07-16)




**Note:** Version bump only for package docz-core

<a name="0.5.7"></a>
## [0.5.7](https://github.com/pedronauck/docz/compare/v0.5.6...v0.5.7) (2018-07-11)




**Note:** Version bump only for package docz-core

<a name="0.5.6"></a>
## [0.5.6](https://github.com/pedronauck/docz/compare/v0.5.5...v0.5.6) (2018-07-11)


### Features

* **docz-core:** add webpack-serve-waitpage ([83c493b](https://github.com/pedronauck/docz/commit/83c493b))




<a name="0.5.5"></a>
## [0.5.5](https://github.com/pedronauck/docz/compare/v0.5.4...v0.5.5) (2018-07-07)


### Bug Fixes

* **docz-core:** add ordering to initial config data object ([2926ade](https://github.com/pedronauck/docz/commit/2926ade))




<a name="0.5.4"></a>
## [0.5.4](https://github.com/pedronauck/docz/compare/v0.5.3...v0.5.4) (2018-07-07)




**Note:** Version bump only for package docz-core

<a name="0.5.2"></a>
## [0.5.2](https://github.com/pedronauck/docz/compare/v0.5.1...v0.5.2) (2018-07-05)


### Bug Fixes

* **docz-core:** remove unnescessary Entry.check ([1871db8](https://github.com/pedronauck/docz/commit/1871db8))




<a name="0.5.1"></a>
## [0.5.1](https://github.com/pedronauck/docz/compare/v0.3.4...v0.5.1) (2018-07-03)


### Bug Fixes

* **docz-core:** add a fallback name on Entry ([ec38139](https://github.com/pedronauck/docz/commit/ec38139))
* **docz-core:** app running port message ([4aec595](https://github.com/pedronauck/docz/commit/4aec595))
* **docz-core:** check name on package json ([6cdbebc](https://github.com/pedronauck/docz/commit/6cdbebc))


### Features

* **docz-core:** add ordering property for config ([efd215e](https://github.com/pedronauck/docz/commit/efd215e))
* **docz-core:** read name from package.json to populate initial title ([1eeb049](https://github.com/pedronauck/docz/commit/1eeb049))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/pedronauck/docz/compare/v0.3.4...v0.5.0) (2018-07-03)


### Bug Fixes

* **docz-core:** add a fallback name on Entry ([ec38139](https://github.com/pedronauck/docz/commit/ec38139))
* **docz-core:** app running port message ([1b94114](https://github.com/pedronauck/docz/commit/1b94114))


### Features

* **docz-core:** add ordering property for config ([a6c307d](https://github.com/pedronauck/docz/commit/a6c307d))
* **docz-core:** read name from package.json to populate initial title ([4f10a6d](https://github.com/pedronauck/docz/commit/4f10a6d))




<a name="0.4.0"></a>
# [0.4.0](https://github.com/pedronauck/docz/compare/v0.3.4...v0.4.0) (2018-06-30)


### Bug Fixes

* **docz-core:** add a fallback name on Entry ([ec38139](https://github.com/pedronauck/docz/commit/ec38139))




<a name="0.3.4"></a>
## [0.3.4](https://github.com/pedronauck/docz/compare/v0.3.3...v0.3.4) (2018-06-26)




**Note:** Version bump only for package docz-core

<a name="0.3.3"></a>
## [0.3.3](https://github.com/pedronauck/docz/compare/v0.3.2...v0.3.3) (2018-06-26)


### Bug Fixes

* **docz-core:** copy templates files for dist ([#88](https://github.com/pedronauck/docz/issues/88)) ([5e4b98d](https://github.com/pedronauck/docz/commit/5e4b98d))




<a name="0.3.2"></a>
## [0.3.2](https://github.com/pedronauck/docz/compare/v0.3.1...v0.3.2) (2018-06-25)




**Note:** Version bump only for package docz-core

<a name="0.3.1"></a>
## [0.3.1](https://github.com/pedronauck/docz/compare/v0.2.11...v0.3.1) (2018-06-25)


### Bug Fixes

* use docz-theme-default as docz-core dependency ([1a2fb67](https://github.com/pedronauck/docz/commit/1a2fb67))




<a name="0.2.11"></a>
## [0.2.11](https://github.com/pedronauck/docz/compare/v0.2.10...v0.2.11) (2018-06-22)


### Bug Fixes

* **docz-core:** node env for production ([615aa1f](https://github.com/pedronauck/docz/commit/615aa1f))




<a name="0.2.10"></a>
## [0.2.10](https://github.com/pedronauck/docz/compare/v0.2.9...v0.2.10) (2018-06-21)


### Features

* **docz-plugin-css:** add initial version ([#78](https://github.com/pedronauck/docz/issues/78)) ([299372e](https://github.com/pedronauck/docz/commit/299372e))




<a name="0.2.9"></a>
## [0.2.9](https://github.com/pedronauck/docz/compare/v0.2.8...v0.2.9) (2018-06-21)




**Note:** Version bump only for package docz-core

<a name="0.2.8"></a>
## [0.2.8](https://github.com/pedronauck/docz/compare/v0.2.7...v0.2.8) (2018-06-21)


### Bug Fixes

* **docz-core:** typescript resolve extensions ([689b057](https://github.com/pedronauck/docz/commit/689b057))




<a name="0.2.7"></a>
## [0.2.7](https://github.com/pedronauck/docz/compare/v0.2.6...v0.2.7) (2018-06-20)




**Note:** Version bump only for package docz-core

<a name="0.2.6"></a>
## [0.2.6](https://github.com/pedronauck/docz/compare/v0.2.5...v0.2.6) (2018-06-17)


### Bug Fixes

* **docz-core:** change filepath entry for windows ([#31](https://github.com/pedronauck/docz/issues/31)) ([14bf0e2](https://github.com/pedronauck/docz/commit/14bf0e2))




<a name="0.2.4"></a>
## [0.2.4](https://github.com/pedronauck/docz/compare/v0.2.3...v0.2.4) (2018-06-13)




**Note:** Version bump only for package docz-core

<a name="0.2.3"></a>
## [0.2.3](https://github.com/pedronauck/docz/compare/v0.2.2...v0.2.3) (2018-06-13)


### Bug Fixes

* **docz-core:** change config hosts to support windows os ([9e3c4f6](https://github.com/pedronauck/docz/commit/9e3c4f6))




<a name="0.2.2"></a>
## [0.2.2](https://github.com/pedronauck/docz/compare/v0.2.1...v0.2.2) (2018-06-12)




**Note:** Version bump only for package docz-core

<a name="0.2.0"></a>
# [0.2.0](https://github.com/pedronauck/docz/compare/v0.2.0-beta.2...v0.2.0) (2018-06-11)




**Note:** Version bump only for package docz-core

<a name="0.2.0-beta.2"></a>
# [0.2.0-beta.2](https://github.com/doczjs/docz/compare/v0.2.0-beta.1...v0.2.0-beta.2) (2018-06-10)


### Bug Fixes

* **docz-core:** autolink headings ([0b8369d](https://github.com/doczjs/docz/commit/0b8369d))




<a name="0.2.0-beta.1"></a>
# [0.2.0-beta.1](https://github.com/doczjs/docz/compare/v0.2.0-beta.0...v0.2.0-beta.1) (2018-06-10)


### Features

* **docz-core:** add headings property for entries and autolink on headings ([7711c3c](https://github.com/doczjs/docz/commit/7711c3c))




<a name="0.2.0-beta.0"></a>
# [0.2.0-beta.0](https://github.com/doczjs/docz/compare/v0.1.2-beta.6...v0.2.0-beta.0) (2018-06-10)


### Features

* **docz-core:** add indexHtml property on project configuration ([6bb5167](https://github.com/doczjs/docz/commit/6bb5167))




<a name="0.1.2-beta.5"></a>
## [0.1.2-beta.5](https://github.com/doczjs/docz/compare/v0.1.2-beta.4...v0.1.2-beta.5) (2018-06-09)


### Bug Fixes

* **docz-core:** build when base prop ([6001171](https://github.com/doczjs/docz/commit/6001171))




<a name="0.1.2-beta.1"></a>
## [0.1.2-beta.1](https://github.com/doczjs/docz/compare/v0.1.2-beta.0...v0.1.2-beta.1) (2018-06-09)


### Features

* **docz-core:** add base config argument ([20f29c2](https://github.com/doczjs/docz/commit/20f29c2))
* **docz-core:** add dest config property ([d6c5506](https://github.com/doczjs/docz/commit/d6c5506))
* **docz-core:** add modifyBundlerConfig configuration property ([ec04bee](https://github.com/doczjs/docz/commit/ec04bee))
* **docz-core:** use html template as component ([b7a2dc0](https://github.com/doczjs/docz/commit/b7a2dc0))




<a name="0.1.2-beta.0"></a>
## [0.1.2-beta.0](https://github.com/doczjs/docz/compare/v0.1.1...v0.1.2-beta.0) (2018-06-02)




**Note:** Version bump only for package docz-core

<a name="0.1.1-beta.5"></a>
## [0.1.1-beta.5](https://github.com/doczjs/docz/compare/v0.1.1-beta.4...v0.1.1-beta.5) (2018-06-01)




**Note:** Version bump only for package docz-core

<a name="0.1.1-beta.4"></a>
## [0.1.1-beta.4](https://github.com/doczjs/docz/compare/v0.1.1-beta.3...v0.1.1-beta.4) (2018-05-29)


### Bug Fixes

* **docz-core:** module rule test for typescript ([bdeffc1](https://github.com/doczjs/docz/commit/bdeffc1))




<a name="0.1.1-beta.3"></a>
## [0.1.1-beta.3](https://github.com/doczjs/docz/compare/v0.1.1-beta.2...v0.1.1-beta.3) (2018-05-29)




**Note:** Version bump only for package docz-core

<a name="0.1.0"></a>
# 0.1.0 (2018-05-29)


### Bug Fixes

* **docz-core:** async plugin ([ddfbcf1](https://github.com/doczjs/docz/commit/ddfbcf1))
* **docz-core:** check if found name exist when parse entry ([f75881e](https://github.com/doczjs/docz/commit/f75881e))
* **docz-core:** config watch for directory operations ([43fa7ab](https://github.com/doczjs/docz/commit/43fa7ab))
* **docz-core:** create plugin to fix paragraph parse on mdx ([42b4f05](https://github.com/doczjs/docz/commit/42b4f05))
* **docz-core:** data server class ([12c0558](https://github.com/doczjs/docz/commit/12c0558))
* **docz-core:** don't exit when catch prettier ([5423d96](https://github.com/doczjs/docz/commit/5423d96))
* **docz-core:** entries rewrite ([986ba65](https://github.com/doczjs/docz/commit/986ba65))
* **docz-core:** entries updates ([7147ac1](https://github.com/doczjs/docz/commit/7147ac1))
* **docz-core:** throw error when parse ast ([05138bf](https://github.com/doczjs/docz/commit/05138bf))


### Features

* **docz-core:** add build command ([ef7abd2](https://github.com/doczjs/docz/commit/ef7abd2))
* **docz-core:** add chokidar to watch new entries ([2f073d5](https://github.com/doczjs/docz/commit/2f073d5))
* **docz-core:** add entry settings field ([2ec5d66](https://github.com/doczjs/docz/commit/2ec5d66))
* **docz-core:** add playground code parse section ([6bbf158](https://github.com/doczjs/docz/commit/6bbf158))
* **docz-core:** add setConfig method for Plugin ([9ba6507](https://github.com/doczjs/docz/commit/9ba6507))
* **docz-core:** add support for custom head or scripts ([69f4d56](https://github.com/doczjs/docz/commit/69f4d56))
* **docz-core:** add support for parse sections via ast ([6db0cd8](https://github.com/doczjs/docz/commit/6db0cd8))
* **docz-core:** add title and description on settings ([ad9ee58](https://github.com/doczjs/docz/commit/ad9ee58))
* **docz-core:** add typescript support ([17dae8b](https://github.com/doczjs/docz/commit/17dae8b))
* **docz-core:** improve plugin and add support to modify babel ([cf3ec4e](https://github.com/doczjs/docz/commit/cf3ec4e))
* add component props parse feature ([987627d](https://github.com/doczjs/docz/commit/987627d))
* **docz-core:** pass theme config via websockets for dev ([5222de7](https://github.com/doczjs/docz/commit/5222de7))
* **docz-core:** use websockets instead of generate json to process entries ([e0773a0](https://github.com/doczjs/docz/commit/e0773a0))
* **docz-theme-default:** add logo option ([435da9b](https://github.com/doczjs/docz/commit/435da9b))
* add support for highlight code sections ([19bf7ea](https://github.com/doczjs/docz/commit/19bf7ea))
* improve docz theme to use theme config ([9207ed2](https://github.com/doczjs/docz/commit/9207ed2))
* refac to use mdx ([04b59e5](https://github.com/doczjs/docz/commit/04b59e5))
