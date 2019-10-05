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

Docz makes it easy to write and publish beautiful interactive documentation for your code.

Create MDX files showcasing your code and Docz turns them into a live-reloading, production-ready site.

![docz example](https://cdn-std.dprcdn.net/files/acc_649651/S2YCID)

## Table of Contents

- [📟 &nbsp; Start a New Project](#--start-a-new-project)
- [➕ &nbsp; Add Docz to an Existing Project](#--add-docz-to-an-existing-project)
- [🎩 &nbsp; Features](#--features)
- [🤔 &nbsp; Why?](#--why)
- [🗃 &nbsp; Examples](#--examples)
- [👉🏻 &nbsp; More info on our website](#--more-info-on-our-website)
- [🎛 &nbsp; Plugins](#--plugins)
- [🌍 &nbsp; Around the world](#--around-the-world)
- [💪🏻 &nbsp; Contributors](#--contributors)
- [🤝 &nbsp; Contributing](#--contributing)
- [💭 &nbsp; Need Help?](#--need-help)

## 📟 &nbsp; Start a New Project

Use [create-docz-app](https://www.npmjs.com/package/create-docz-app) to quickly get started :

```sh
npx create-docz-app my-docz-app
# or
yarn create docz-app my-docz-app --example typescript
```

## ➕ &nbsp; Add Docz to an Existing Project

Start by adding `docz` as a dependency :

```bash
$ yarn add --dev docz@next # react react-dom

# or

$ npm install --save-dev docz@next # react react-dom
```

> **Note**: `react` and `react-dom` will not be installed automatically. You'll have to install them yourself.

Then, add `.mdx` files anywhere in your project:

```mdx
---
name: Button
route: /
---

import { Playground, Props } from 'docz'
import Button from './Button'

# Button

<Props of={Button} />

## Basic usage

<Playground>
  <Button type="submit">Click me</Button>
  <Button>No, click me</Button>
</Playground>
```

And a Button component `Button.jsx`:

```typescript
import React from 'react'
import t from 'prop-types'

const Button = ({ children, type }) => <button type={type}>{children}</button>

Button.propTypes = {
  /**
   * This is a pretty good description for this prop.
   * Button type.
   */
  type: t.oneOf(['button', 'submit', 'reset']),
}
Button.defaultProps = {
  type: 'button',
}
export default Button
```

Finally, run the Docz development server:

```bash
$ yarn docz dev
```

That's it! You now have an interactive site to showcase and debug your components, and some badass documentation as a nice bonus 👊

## 🎩 &nbsp; Features

- 🔩 **Powered by Gatsby.** Bundling and ecosystem powered by [Gatsby](https://gatsbyjs.org).
- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Hot reload support and automatic code splitting out of the box.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **[MDX](https://github.com/mdx-js/mdx) Based.** Write markdown enhanced by the power of components.
- 🎛 **Pluggable.** Use plugins to manipulate and customize Docz to suit your needs.
- 🔐 **Typescript Support.** Full support for TypeScript. Write your type definitions with no extra setup required.

Still not convinced ? Check [our docs](http://docz.site) to learn more about **Docz**!

## 🤔 &nbsp; Why?

Libraries that make development easier are appearing every day. Style guides and design systems are growing in popularity. Today, tools that allow us to get our best work done and be efficient are necessary. We shouldn't be spending too much time on tasks that should be trivial. This is why we created **Docz**.

Documenting code is one of the most important and time-heavy processes when you're creating something new. A lot of time is wasted on unnecessarily attempting to build a documentation site that will match the style you want.

## 🗃 &nbsp; Examples

- **[basic](https://github.com/pedronauck/docz/tree/master/examples/basic)** - Barebones example.
- **[gatsby](https://github.com/pedronauck/docz/tree/master/examples/gatsby)** - Example using Docz in a Gastby project.
- **[react native](https://github.com/pedronauck/docz/tree/master/examples/react-native)** - Using Docz in a React Native project.
- **[styled-components](https://github.com/pedronauck/docz/tree/master/examples/styled-components)** - Using Docz with `styled-components`.
- **[with typescript](https://github.com/pedronauck/docz/tree/master/examples/typescript)** - Using Docz with Typescript.
- **[with flow](https://github.com/pedronauck/docz/tree/master/examples/flow)** - Using Docz with Flow.
- **[with images](https://github.com/pedronauck/docz/tree/master/examples/images)** - Using Docz with images in mdx and jsx.

- **[with sass](https://github.com/pedronauck/docz/tree/master/examples/sass)** - Using Docz parsing CSS with SASS.
- **[with less](https://github.com/pedronauck/docz/tree/master/examples/less)** - Using Docz parsing CSS with LESS.
- **[with stylus](https://github.com/pedronauck/docz/tree/master/examples/css-stylus)** - Using Docz parsing CSS with Stylus.
- **with css modules**: works out of the box with gatsby

## 👉🏻 &nbsp; More info on [our website](https://docz.site)

## 🎛 &nbsp; Plugins

- **[gatsby-theme-docz](https://github.com/pedronauck/docz/tree/master/core/gatsby-theme-docz)** - Use Docz as a theme for Gatsby.
- **[netlify](https://github.com/nicholasess/docz-plugin-netlify)** - Deploy your Docz site to [Netlify](http://netlify.com/).
- **[svg sprite loader](https://github.com/trustedhousesitters/docz-plugin-svg-sprite-loader)** - Docz plugin for SVG sprite loader.
- **[snapshots](https://github.com/JosephConradBlack/docz-plugin-snapshots)** - A plugin for Docz that creates jest snapshots for all documented component usages.

## 🌍 &nbsp; Around the world

- **[Smooth UI](https://smooth-ui.smooth-code.com/)** - Modern React UI library.
- **[Set Protocol Docs](https://docs.setprotocol.com/)** - Documentation site of Set Protocol.
- **[RBX](https://dfee.github.io/rbx)** - The Comprehensive Bulma UI Framework for React.
- **[Circuit UI](https://circuit.sumup.com/#/)** - React component library for [SumUp](https://sumup.com) web apps.
- **[Fannypack](https://fannypack.style)** - A friendly & accessible React UI Kit built with [Reakit](https://reakit.io/).
- **[React Pixi](https://reactpixi.org/#/)** - React Fiber renderer for Pixi.
- **[React Hotkey Tooltip](https://react-hotkey-tooltip.netlify.com/#/)** - A global Hotkey provider with built in tooltip for React.
- **[Sajari React SDK](https://sajari-sdk-react.netlify.com/)** - Library of React Components for the Sajari.

## 💪🏻 &nbsp; Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/pedronauck/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>

## 🤝 &nbsp; Contributing

All kinds of contributions are very welcome and appreciated !

If you want to contribute time to docz then here's a list to get you started :

1. ⭐️ Star the project
2. 💬 Help people in the [issues](https://github.com/doczjs/docz/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) by sharing your knowledge and experience
3. 🐛 Find and report issues
4. 📥 Submit PRs to help solve issues or add features
5. ✋ Influence the future of docz with feature requests

If you're looking for a place to start make sure to check issues tagged with

[![Good First Issue](https://img.shields.io/github/issues/storybookjs/storybook/good%20first%20issue.svg)](https://github.com/doczjs/docz/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

And make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

You can also contribute money to help secure docz's future.

<p align="center">
  <a href="https://opencollective.com/docz" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/Q5nVhT" height="80" alt="Open Collective">
  </a>
  <a href="https://www.patreon.com/pedronauck" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/plrSCT" height="80" alt="Patreon">
  </a>
</p>

## 💭 &nbsp; Need Help?

If you need some help, feel free to open an issue with a description of the problem you're facing or chat with us on [our Spectrum Community](https://spectrum.chat/docz).
