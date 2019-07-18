<p align="center">
  <a href="https://opencollective.com/docz" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/Q5nVhT" height="80" alt="Open Collective">
  </a>
  <a href="https://www.patreon.com/pedronauck" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/plrSCT" height="80" alt="Patreon">
  </a>
</p>

<p align="center" style="margin-bottom: -20px">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/BSPk3z">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/docz" target="_blank">
    <img src="https://badgen.net/npm/v/docz" alt="">
  </>
  <a href="LICENSE.md" target="_blank">
    <img src="https://badgen.net/badge/license/MIT/blue" alt="">
  </a>
  <a href="https://www.npmjs.com/package/docz" target="_blank">
    <img src="https://badgen.net/npm/dt/docz" alt="">
  </a>
  <a href="http://feedback.docz.site/roadmap" target="_blank">
    <img src="https://img.shields.io/badge/check-our%20roadmap-5362F5.svg" alt="Chat">
  </a>
</p>

## ✅️ &nbsp; Migration Guide

This documentation is for Docz [v2](https://github.com/pedronauck/docz/pull/950). Follow our [migration guide](/MIGRATION_GUIDE.md) if you haven't upgraded your project yet.

## 🎩 &nbsp; Features

- 🔩 **Powered by Gatsby.** Bundling and ecossystem powered by [Gatsby](https://gatsbyjs.org).
- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Full hot reload support with webpack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **[MDX](https://github.com/mdx-js/mdx) Based.** Write markdown enhanced by the power of components.
- 🎛 **Pluggable.** Use plugins to manipulate and customise Docz to suit your needs.
- 🔐 **Typescript Support.** Full support for TypeScript. Write your type definitions with no extra setup required.

## 🤔 &nbsp; Why?

Libraries that make development easier are appearing every day. Styleguides and design systems are growing in popularity. Today, tools that allow us to get our best work done and be efficient are necessary. We shouldn't be spending too much time on tasks that should be trivial. This is why we created **Docz**.

Documenting code is one of the most important and time-heavy processes when you're creating something new. A lot of time is wasted on unnecessarily attempting to build a documentation site that will match the style we want.

## 👉🏻 &nbsp; More info on [our website](https://docz.site)

## 🎛 &nbsp; Plugins

- **[gatsby-theme-docz](https://github.com/pedronauck/docz/tree/master/core/gatsby-theme-docz)** - Use Docz as a theme for Gatsby.
- **[netlify](https://github.com/nicholasess/docz-plugin-netlify)** - Deploy your Docz site to [Netlify](http://netlify.com/).
- **[svg sprite loader](https://github.com/trustedhousesitters/docz-plugin-svg-sprite-loader)** - Docz plugin for SVG sprite loader.
- **[snapshots](https://github.com/JosephConradBlack/docz-plugin-snapshots)** - A plugin for Docz that creates jest snapshots for all documented component usages.

## 🗃 &nbsp; Examples

- **[basic](https://github.com/pedronauck/docz/tree/master/examples/basic)** - Barebones example.
- **[gatsby](https://github.com/pedronauck/docz/tree/master/examples/gatsby)** - Example using Docz in a Gastby project.
- **[react native](https://github.com/pedronauck/docz/tree/master/examples/react-native)** - Using Docz in a React Native project.
- **[styled-components](https://github.com/pedronauck/docz/tree/master/examples/styled-components)** - Using Docz with `styled-components`.
- **[with typescript](https://github.com/pedronauck/docz/tree/master/examples/typescript)** - Using Docz with Typescript.
- **[with flow](https://github.com/pedronauck/docz/tree/master/examples/flow)** - Using Docz with Flow.
- **[with sass](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-sass)** - Using Docz parsing CSS with SASS.
- **[with less](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-less)** - Using Docz parsing CSS with LESS.
- **[with postcss](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-postcss)** - Using Docz parsing CSS with PostCSS.
- **[with stylus](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-stylus)** - Using Docz parsing CSS with Stylus.

## 🌍 &nbsp; Around the world

- **[Smooth UI](https://smooth-ui.smooth-code.com/)** - Modern React UI library.
- **[Set Protocol Docs](https://docs.setprotocol.com/)** - Documentation site of Set Protocol.
- **[RBX](https://dfee.github.io/rbx)** - The Comprehensive Bulma UI Framework for React.
- **[Circuit UI](https://circuit.sumup.com/#/)** - React component library for [SumUp](https://sumup.com) web apps.
- **[Fannypack](https://fannypack.style)** - A friendly & accessible React UI Kit built with [Reakit](https://reakit.io/).
- **[React Pixi](https://reactpixi.org/#/)** - React Fiber renderer for Pixi.
- **[React Hotkey Tooltip](https://react-hotkey-tooltip.netlify.com/#/)** - A global Hotkey provider with built in tooltip for React.
- **[Sajari React SDK](https://sajari-sdk-react.netlify.com/)** - Library of React Components for the Sajari.

## ⚠️ &nbsp; Warning

Since the release of v1 you need `react` and `react-dom` `v16.8.0` or later installed.

## 📟 &nbsp; Install and Usage

Getting started with **Docz** is really quick and easy.

Firstly, install `docz` using your favourite package manager:

```bash
$ yarn add --dev docz@next react react-dom

# or

$ npm install --save-dev docz@next react react-dom
```

**Note**: `react` and `react-dom` will not be installed automatically. You'll have to install them yourself.

Next, add some `.mdx` files anywhere inside your project:

```mdx
---
name: Button
---

import { Playground, Props } from 'docz'
import Button from './'

# Button

<Props of={Button} />

## Basic usage

<Playground>
  <Button>Click me</Button>
  <Button kind="secondary">Click me</Button>
</Playground>
```

Finally, run the Docz development server:

```bash
$ yarn docz dev
```

That's it! Now you have some real badass documentation 👊

![](https://cdn-std.dprcdn.net/files/acc_649651/S2YCID)

Any doubt? Check [our docs](http://docz.site) to see more about **Docz**!

## 🤝 &nbsp; Contributions

Contributions, issues and feature requests are very welcome.
Please make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

## 💪🏻 &nbsp; Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/pedronauck/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>

## 💭 &nbsp; Needing Help?

If you need some help you can chat with us on [our Spectrum Community](https://spectrum.chat/docz), we have a great team who would be more than happy to help you:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;" alt="Pedro Nauck"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [👀](#review-pedronauck "Reviewed Pull Requests") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->
