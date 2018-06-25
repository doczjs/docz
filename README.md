<p align="center">
  <img src="https://img.shields.io/npm/v/docz.svg" alt="">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="">
  <img src="https://img.shields.io/npm/dt/docz.svg" alt="">
  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="">
</p>

<p align="center" style="margin-bottom: -20px">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/ilOByk">
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

<p align="center">
  <a href="http://docz.site" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/XG4L5H" alt="Docz video">
  </a>
</p>

## 🎩 &nbsp; Features

- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Full hot reload support with webpack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **MDX Based.** Write markdown with all power of components.
- 🎛 **Pluggable.** With plugins, you can manipulate a lot of things through the docz flow and data.
- 🔐 **Typescript Support.** We have a full support for your type definitions.

## 🚧 &nbsp; Warning!

> Due to performance issues docz uses Babel@7 and Webpack@4. So, if you're using some older version of this packages you'll probably get some errors! If you need to use Babel@6 you can try [docz-plugin-babel6](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-babel6), but about Webpack@4 we can't do anything!

## 🤔 &nbsp; Why?

The open source world with tools that make developers life easier and the creation of styleguides and design systems are growing and evolving so fast. New and impressive things are arising every day. Tools that allow us to evolve together are really necessary nowadays. We can't create barriers or lose time with tasks that should be trivial for us.

To break barriers and facilitate the creation of tools was the purpose that Docz arose. Document our things is one of the most important and painful process that exist when you're creating something new. We lose a lot of our precious time with unnecessary setups to be able to build something that can represent and express what we want with our own style.

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

## 🗃 &nbsp; Examples

| name | description |
| -------------------------------------------- | -------------------------------------------- |
| [basic](https://github.com/pedronauck/docz/tree/master/examples/basic) | Some basic example |
| [using typescript](https://github.com/pedronauck/docz/tree/master/examples/typescript) | Using docz with Typescript |
| [using flow](https://github.com/pedronauck/docz/tree/master/examples/flow) | Using docz with Flow |
| [using babel@6](https://github.com/pedronauck/docz/tree/master/examples/babel6) | Using docz with Babel@6 |
| [with sass](https://github.com/pedronauck/docz/tree/master/examples/sass) | Using docz parsing css with Sass |
| [with less](https://github.com/pedronauck/docz/tree/master/examples/less) | Using docz parsing css with Less |
| [with postcss](https://github.com/pedronauck/docz/tree/master/examples/postcss) | Using docz parsing css with PostCSS |
| [with stylus](https://github.com/pedronauck/docz/tree/master/examples/stylus) | Using docz parsing css with Stylus |

## 🎛 &nbsp; Plugins

 - **[docz-plugin-babel6](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-babel6):** Use this plugin to use older babel version
- **[docz-plugin-css](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-css):** Plugin to parse css files inside your documents

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

Contributions, issues and feature requests are very welcome.
Please make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💬](#question-pedronauck "Answering Questions") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🤔](#ideas-pedronauck "Ideas, Planning, & Feedback") [🔌](#plugin-pedronauck "Plugin/utility libraries") [👀](#review-pedronauck "Reviewed Pull Requests") [⚠️](https://github.com/pedronauck/docz/commits?author=pedronauck "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3277185?v=4" width="60px;"/><br /><sub><b>Renato Ribeiro</b></sub>](http://twitter.com/renatorib_)<br />[💻](https://github.com/pedronauck/docz/commits?author=renatorib "Code") [📖](https://github.com/pedronauck/docz/commits?author=renatorib "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Arenatorib "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="60px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://github.com/marceloavf)<br />[💻](https://github.com/pedronauck/docz/commits?author=marceloavf "Code") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Amarceloavf "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/4456346?v=4" width="60px;"/><br /><sub><b>Martyn Rushton</b></sub>](http://swapnull.co.uk)<br />[💻](https://github.com/pedronauck/docz/commits?author=Swapnull "Code") | [<img src="https://avatars3.githubusercontent.com/u/11514928?v=4" width="60px;"/><br /><sub><b>Joseph Thomas</b></sub>](https://www.good-idea.studio)<br />[💻](https://github.com/pedronauck/docz/commits?author=good-idea "Code") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
