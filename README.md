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
  <img src="https://badgen.net/npm/v/docz" alt="">
  <img src="https://badgen.net/badge/license/MIT/blue" alt="">
  <img src="https://badgen.net/npm/dt/docz" alt="">
  <a href="http://feedback.docz.site/roadmap">
    <img src="https://img.shields.io/badge/check-our%20roadmap-5362F5.svg" alt="Chat">
  </a>
</p>

## ✅️ &nbsp; v1 Migration Guide

This documentation it's about our new v1. If you need to migrate your docz project, please read our [Migration Guide](/MIGRATION_GUIDE.md)

## 🎩 &nbsp; Features

- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Full hot reload support with webpack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **[MDX](https://github.com/mdx-js/mdx) Based.** Write markdown with all power of components.
- 🎛 **Pluggable.** With plugins, you can manipulate a lot of things through the docz flow and data.
- 🔐 **Typescript Support.** We have a full support for your type definitions.

## 🤔 &nbsp; Why?

Libraries that make our life easier coming up every day. Styleguides and design system are growing so fast. Today, tools that allow us to be quick and effective are really necessary. We can't lose time with tasks that should be trivial for us. Thinking about that **docz** came out.

Documenting our things is one of the most important and heavy processes when you're creating something new. We waste a lot of time with unnecessary setups to build something that can represent and we want with our own style.

## 👉🏻 &nbsp; More info on [our website](https://docz.site)

---

## 🎛 &nbsp; Plugins

- **[css](https://github.com/pedronauck/docz-plugin-css)** - Parse css files inside your documents
- **[netlify](https://github.com/nicholasess/docz-plugin-netlify)** - Deploy your documentation to [Netlify](http://netlify.com/)
- **[postcss](https://github.com/andreasonny83/docz-plugin-postcss)** - Use Docz with PostCSS

## 🗃 &nbsp; Examples

- **[basic](https://github.com/pedronauck/docz/tree/master/examples/basic)** - Some basic example
- **[react native](https://github.com/pedronauck/docz/tree/master/examples/react-native)** - Using in a React Native project
- **[with typescript](https://github.com/pedronauck/docz/tree/master/examples/typescript)** - Using docz with Typescript
- **[with flow](https://github.com/pedronauck/docz/tree/master/examples/flow)** - Using docz with Flow
- **[with sass](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-sass)** - Using docz parsing css with Sass
- **[with less](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-less)** - Using docz parsing css with Less
- **[with postcss](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-postcss)** - Using docz parsing css with PostCSS
- **[with stylus](https://github.com/pedronauck/docz-plugin-css/tree/master/examples/css-stylus)** - Using docz parsing css with Stylus

## 🌍 &nbsp; Around the world

- **[Smooth UI](https://smooth-ui.smooth-code.com/)** - Modern React UI library
- **[Set Protocol Docs](https://docs.setprotocol.com/)** - Documentation site of Set Protocal
- **[RBX](https://dfee.github.io/rbx)** - The Comprehensive Bulma UI Framework for React
- **[Circuit UI](https://circuit.sumup.com/#/)** - React component library for [SumUp](https://sumup.com) web apps
- **[Fannypack](https://fannypack.style)** - A friendly & accessible React UI Kit built with [Reakit](https://reakit.io/)
- **[React Pixi](https://reactpixi.org/#/)** - React Fiber renderer for Pixi
- **[React Hotkey Tooltip](https://react-hotkey-tooltip.netlify.com/#/)** - A global Hotkey provider with built in tooltip for React
- **[Sajari React SDK](https://sajari-sdk-react.netlify.com/)** - Library of React Components for the Sajari

## ⚠️ &nbsp; Warning

Since our new v1, you need `react` and `react-dom` with `>= 16.8.0` installed.

## 📟 &nbsp; Install and Usage

Simplicity is one of our core principles. Therefore, getting started with **docz** is something really easy and quick. First of all, you will need to install **docz** and some theme on your project using your favorite package manager (we'll asume yarn for this example):

```bash
$ yarn add docz@next docz-theme-default@next --dev
```

Then create some `.mdx` anywhere inside your project:

```markdown
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

Now, just run your dev server:

```bash
$ yarn docz dev
```

That's it! Now you have a real badass documentation 👊

![](https://cdn-std.dprcdn.net/files/acc_649651/7RRXv)

Any doubt? Check [our docs](http://docz.site) to see more about **docz**!

## 🤝 &nbsp; Contributions

Contributions, issues and feature requests are very welcome.
Please make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

## 💪🏻 &nbsp; Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/pedronauck/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>

## 💭 &nbsp; Needing Help?

If you need some help you can chat with us on [our Spectrum Community](https://spectrum.chat/docz), you have a great team to help you:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;" alt="Pedro Nauck"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [👀](#review-pedronauck "Reviewed Pull Requests") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->
