# Migration Guide
The [v2 release](https://github.com/pedronauck/docz/pull/950) is our biggest release in terms of changes on our core scripts. Our bundler system was entirely modified in order to use Gatsby as default bundler and you will need to update your code if you’re coming from a previous version. It’s not a big deal, but you need to follow this guide in order to get Docz running properly on your project after the upgrade.

## Gatsby as default bundler
The biggest change in the new v2 is that now our core is entirely build using Gatsby behind the scenes. This is a huge win for Docz, since now we can focus on build new features instead of handling with a lot of bundlers issues (our biggest bottleneck) and enjoy all Gatsby ecosystem.

So, in order to refactoring our core, we need to change a lot of things and remove others that no longer make sense. The most expressive changes here is about the configuration for `doczrc.js` and the plugin system.

### List of removed properties from `doczrc.js`
* **`websocketHost`** ▶︎ _no longer need_
* **`websocketPort`** ︎︎︎▶︎ _no longer need_
* **`wrapper`** ▶︎ _removed_
* **`theme`** ▶︎ _removed_
* **`indexHtml`** ▶︎ _removed_
* **`codeSandbox`** ▶︎ _removed_
* **`onCreateWebpackChain`** ▶︎ _removed_
* **`modifyBundlerConfig`** ▶︎ use Gatsby [`onCreateWebpackConfig`](https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig) hook
* **`modifyBabelRc`** ▶︎ use Gatsby [`onCreateBabelConfig`](https://www.gatsbyjs.org/docs/node-apis/#onCreateBabelConfig) hook

## New hooks for plugins
The `createPlugin` method also changed in order to fit with Gatsby now.

### List of removed/changed properties from `createPlugin()`

* **`modifyBundlerConfig`** ▶︎ `onCreateWebpackConfig`
* **`modifyBabelRc`** ▶︎ `onCreateBabelConfig`
* **`onCreateApp`** ▶︎ `onCreateDevServer`
* **`onPreCreateApp`** ▶︎ _removed_
* **`onServerListening`** ▶︎ _removed_
* **`onPreRender`** ▶︎ _removed_
* **`onPostRender`** ▶︎ _removed_

> All methods that changed now are using the same API of Gatsby hooks.
> You can have more details about then [here](https://www.gatsbyjs.org/docs/node-apis).

## `docz-theme-default` removed
The main reason that made us change our core to use Gatsby is that now it have a feature called themes. In the last major version we launched our own `gatsby-theme-docz` and this was impressive since we could use Docz inside a Gatsby project and brings a lot of new possibilites when creating a documentation.

So, indeed we were using Gatsby theme at all, but in the wrong way. One of the best benefits of Gatsby theme are the feature called Component Shadowing, that’s the ability to replace theme files just by creating your own file following a file naming convention. This is awesome and is something that people always ask for me, like: “I want just to change the head in the Docz theme”.

In order to get Docz running with component shadowing we removed `docz-theme-default` and now you don’t need to install it anymore. You can just add `docz` and your project is done.

Check [here](h) readme for more information.

### Code highlight with PrismJS
In the last version of Docz we’re using Codemirror to highlight code inside `<Playground>` and code blocks. Now we are using [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) together with Theme UI.

Check [here](h) for more information.

### New `themeConfig` properties
Another great thing launched in the newest version is the integration with the [Theme UI](https://theme-ui.com). Theme UI it’s a library for build consistent, themeable React apps based on constraint-based design principles. So, in order to integration it with our new theme, a lot of changes are made inside the `themeConfig` object.

Check [here](h) for more information.

## `theme` property removed
The property used to define your Docz theme inside the `doczrc.js` was removed. But you can still create and use your own theme from scratch if you want.

If you want to use your own theme, just create a file called `src/gatsby-theme-docz/index.js` in order to use component shadowing and replace it with your new theme.

```js
// src/gatsby-theme-docz/index.js
import React from 'react'
import Theme from './my-custom-theme'

export default (props) => <Theme {...props} />
```

Check [here](https://www.docz.site/docs/creating-themes) for more information about how to create themes.

## `wrapper` property removed
The same thing happened here for the oldest `wrapper` property. Now you can wrap your entire application by just creating a file called `src/gatsby-theme-docz/wrapper.js`

```js
// src/gatsby-theme-docz/index.js
import React from 'react'

export default ({ children }) => (
  <div>
    <h1>My custom wrapper</h1>
    {children}
  </div>
)
```

## CSS preprocessors managed by gatsby

CSS preprocessors and modules were handled by [`docz-plugin-css`](https://github.com/doczjs/docz-plugin-css) which hooked into the bundler config to add different loader support via webpack.

With the change to gatsby preprocessors like `sass` can be handled by gatby via [Plugins](https://www.gatsbyjs.org/plugins/)

These plugins are added by adding a `gatsby-config.js` in your project root or modifying an existing one. For example if you want to add support for `sass` you would do the following:

1. Install [`node-sass`](https://github.com/sass/node-sass) and [`gatsby-plugin-sass`](https://www.gatsbyjs.org/packages/gatsby-plugin-sass/)
```bash
# npm
npm install --save node-sass gatsby-plugin-sass

# yarn
yarn add node-sass gatsby-plugin-sass
```

2. Add the plugin to your `gatsby-config.js`
```js
//gatsby-config.js
module.exports = {
  plugins: ['gatsby-plugin-sass']
}
```
