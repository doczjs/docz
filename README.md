<p align="center">
  <img src="https://img.shields.io/npm/v/docz.svg" alt="">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="">
</p>

<p align="center">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/OnwqVu">
</p>

<p align="center">
  <a href="http://docz.site" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/XG4L5H" alt="Docz video">
  </a>
</p>

---

<p align="center">
  <a href="http://docz.site" target="_blank">Home</a> |
  <a href="http://docz.site/introduction" target="_blank">Introduction</a> |
  <a href="http://docz.site/documentation" target="_blank">Documentation</a> |
  <a href="http://docz.site/themes" target="_blank">Themes</a> |
  <a href="http://docz.site/plugins" target="_blank">Plugins</a>
</p>

---

## 🎩 &nbsp; Features

- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Full hot reload support with webpack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **MDX Based.** Write markdown with all power of components.
- 🎛 **Pluggable.** With plugins, you can manipulate a lot of things through the docz flow and data.
- 🔐 **Typescript Support.** We have a full support for your type definitions.

## 🤔 &nbsp; Why?

The open source world with tools that make developer's life easier, the creation of styleguides and design system are growing and evolving so fast. New and impressive things arising every day. Tools that allow us to evolve together are really necessary nowadays. We can't create barriers or lose time with tasks that should be trivial for us.

To break barriers and facilitating the creation of tools that's Docz arose. Document our things is one of the most important and painful processes that exist when you're creating something new. We lose a lot of our precious time with unnecessary setups to can build something that can represent and express what we want with our own style.

## 📚 &nbsp; About

- [Introduction](http://www.docz.site/introduction)
  - [Getting Started](http://www.docz.site/introduction/getting-started)
  - [Writing MDX](http://www.docz.site/introduction/writing-mdx)
  - [Documenting your Things](http://www.docz.site/introduction/documenting-your-things)
  - [Customizing](http://www.docz.site/introduction/customizing)
  - [Deploying your docs](http://www.docz.site/introduction/deploying-your-docs)
- [Documentation](http://www.docz.site/documentation)
  - [Project Configuration](http://www.docz.site/documentation/project-configuration)
  - [Components API](http://www.docz.site/documentation/components-api)
  - [Creating Themes](http://www.docz.site/documentation/creating-themes)
  - [CreatingPlugins](http://www.docz.site/documentation/creating-plugins)
- [Themes](http://www.docz.site/themes)
- [Plugins](http://www.docz.site/plugins)

## 📟 &nbsp; Install and Usage

Simplicity is one of our core principles. So, getting started with docz is something really easy and quick. First of all, you need to install docz on your project using some package manager

```bash
$ yarn add docz --dev
```

Then create some `.mdx` anywhere inside your project:

```markdown
---
name: Button
---

import { Playground, PropsTable } from 'docz'
import Button from './'

# Button

<PropsTable of={Button} />

## Basic usage

<Playground>
  <Button>Click me</Button>
  <Button kind="secondary">Click me</Button>
</Playground>
```

Now just run your dev server:

```bash
$ yarn docz dev
```

That's it! You have a real badass documentation now 👊

![](https://cdn-std.dprcdn.net/files/acc_649651/AmFJ2k)

Any doubt? Check [our docs](http://docz.site) to see more about Docz!

## 🤝 &nbsp; Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!
Also you can ping me at [Twitter](https://twitter.com/pedronauck)
