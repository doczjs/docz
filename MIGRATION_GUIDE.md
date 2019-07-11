# Migration Guide

The [v2 release](https://github.com/pedronauck/docz/pull/950) is our biggest release in terms of changes on our core scripts
A few APIs were changed, our bundler system was entirely changed in order to use Gatsby as default bundler and you will need to update
your code if you're coming from a previous version. It's not a big deal, but you need to follow this guide in order to get Docz running
properly on your project after the upgrade.

## Gatsby as default bundler

The biggest change in the new v2 is that now our core is entirely build using Gatsby behind the scenes.
This is a huge win for Docz, since now we can focus on build new features instead of handling with
a lot of bundlers issues (our biggest bottleneck) and enjoy all Gatsby ecossystem like features, plugins and themes.

So, in order to refactoring our core, we need to change a lot of things and remove others that no longer make sense.
The most expressive changes here is about the configuration for `doczrc.js` and the plugin system.

### List of removed properties from `doczrc.js`

* *`websocketHost`* no longer need
* *`websocketPort`* no longer need
* *`wrapper`* see [how to use]() now
* *`theme`* see [how to use]() now
* *`indexHtml`* see [how to use]() now
* *`codeSandbox`* removed
* *`onCreateWebpackChain`* removed
* *`modifyBundlerConfig`* use Gatsby [`onCreateWebpackConfig`](https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig) hook
* *`modifyBabelRc`* use Gatsby [`onCreateBabelConfig`](https://www.gatsbyjs.org/docs/node-apis/#onCreateBabelConfig) hook

## New hooks for plugins

The `createPlugin` method also changed in order to fit with Gatsby now.

### List of removed properties from `createPlugin()`

* *`modifyBundlerConfig`* -> `onCreateWebpack`
* *`modifyBabelRc`* -> `onCreateBabelConfig`
* *`onCreateApp`* -> `onCreateDevServer`
* *`onPreCreateApp`* _removed_
* *`onServerListening`* _removed_
* *`onPreRender`* _removed_
* *`onPostRender`* _removed_

> All methods that changed now are using the same API of Gatsby hooks.
> You can have more details about then [here](https://www.gatsbyjs.org/docs/node-apis).

## `docz-theme-default` removed

The main reason that made me want to change our core to use Gatsby is that now it have a feature called themes.
In the last major version we launched our own `gatsby-theme-docz` and this was impressive since we could use Docz
inside a Gatsby project and brings a lot of new possibilites when creating a documentation.

So, indeed we were using Gatsby theme at all, but in the wrong way. One of the best benefits of Gatsby theme are
the feature called Component Shadowing, that's the hability to replace theme files just by creating your own file following a file naming convetion.
This is awesome and is something that people always ask for me, like: "I want just to change the head in the Docz theme".

In order to get Docz running with component shadowing we removed `docz-theme-default` and now you don't need to install it anymore.
You can just add `docz` and your project is done

Check [here]() readme for more information.

### Code highlight with PrismJS

In the last version of Docz we're using Codemirror to highlight code inside `<Playground>` and code blocks.
Now we are using [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) together with Theme UI.

Check [here]() for more information.

### New `themeConfig` properties

Another great thing launched in the newest version is the integration with the [Theme UI](https://theme-ui.com).
Theme UI it's a library for build consistent, themeable React apps based on constraint-based design principles.
So, in order to integration it with our new theme, a lot of changes are made inside the `themeConfig` object.

Check [here]() for more information.
