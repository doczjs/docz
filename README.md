<p align="center">
  <a href="https://opencollective.com/docz" target="_blank"><img src="https://cdn-std.dprcdn.net/files/acc_649651/Q5nVhT" height="80" alt="Open Collective"></a>
  <a href="https://www.patreon.com/pedronauck" target="_blank"><img src="https://cdn-std.dprcdn.net/files/acc_649651/plrSCT" height="80" alt="Patreon"></a>
</p>

<p align="center" style="margin-bottom: -20px">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/BSPk3z">
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/docz.svg" alt="">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="">
  <img src="https://img.shields.io/npm/dt/docz.svg" alt="">
  <a href="https://discord.gg/YQE4MbD"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Chat"></a>
  <img src="https://opencollective.com/docz/backers/badge.svg" alt="Backers on Open Collective">
  <img src="https://opencollective.com/docz/sponsors/badge.svg" alt="Sponsors on Open Collective">
</p>


<p align="center">
  <a href="http://docz.site" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/lvs55S" alt="Docz video">
  </a>
</p>

## 🎩 &nbsp; Features

- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Full hot reload support with webpack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use real customizable themes.
- 📝 **MDX Based.** Write markdown with all power of components.
- 🎛 **Pluggable.** With plugins, you can manipulate a lot of things through the docz flow and data.
- 🔐 **Typescript Support.** We have a full support for your type definitions.

## 🚀 &nbsp; Roadmap

We still have a *long road to go*, this is just the beginning. So to further improve **docz** we've created a roadmap so that you can see the next features and improvements and **give your feedback about**:

<a href="http://feedback.docz.site/roadmap" target="_blank">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/ogSCYY" alt="Docz Roadmap" width="300">
</a>

## 🤔 &nbsp; Why?

The open source world with tools that make developers' life easier and the creation of styleguides and design systems are growing and evolving so fast. New and impressive things are arising every day. Today, tools that allow us to evolve together are really necessary. We can not create barriers or lose time with tasks that should be trivial for us.

To break barriers and facilitate the creation of tools was the purpose that **docz** arose. Documenting our things is one of the most important and painful processes that exist when you're creating something new. We lose a lot of our precious time with unnecessary setups to be able to build something that can represent and express what we want with our own style.

## 👉🏻 &nbsp; More info on [our website](https://docz.site)

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
| [with sass](https://github.com/pedronauck/docz/tree/master/examples/css-sass) | Using docz parsing css with Sass |
| [with less](https://github.com/pedronauck/docz/tree/master/examples/css-less) | Using docz parsing css with Less |
| [with postcss](https://github.com/pedronauck/docz/tree/master/examples/css-postcss) | Using docz parsing css with PostCSS |
| [with stylus](https://github.com/pedronauck/docz/tree/master/examples/css-stylus) | Using docz parsing css with Stylus |

## 🎛 &nbsp; Plugins

 - **[docz-plugin-babel6](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-babel6):** Use this plugin to use older babel version
- **[docz-plugin-css](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-css):** Plugin to parse css files inside your documents

## 🚧 &nbsp; Warning!

> Due to performance issues **docz** uses Babel@7 and Webpack@4. So, if you're using some older version of this packages you'll probably get some errors! If you need to use Babel@6 you can try [docz-plugin-babel6](https://github.com/pedronauck/docz/blob/master/packages/docz-plugin-babel6), but about Webpack@4 we can't do anything!

## 📟 &nbsp; Install and Usage

Simplicity is one of our core principles. Therefore, getting started with **docz** is something really easy and quick. First of all, you will need to install **docz** on your project using some package managers

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

![](https://cdn-std.dprcdn.net/files/acc_649651/7RRXv)

Any doubt? Check [our docs](http://docz.site) to see more about **docz**!

## 🤝 &nbsp; Contributions

Contributions, issues and feature requests are very welcome.
Please make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

## 💭 &nbsp; Needing Help?

If you need some help you can chat with us on [our Discord server](https://discord.gg/Qec87en), you have a great team to help you:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2029172?v=4" width="60px;"/><br /><sub><b>Pedro Nauck</b></sub>](https://github.com/pedronauck)<br />[💻](https://github.com/pedronauck/docz/commits?author=pedronauck "Code") [📖](https://github.com/pedronauck/docz/commits?author=pedronauck "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Apedronauck "Bug reports") [👀](#review-pedronauck "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="60px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://github.com/marceloavf)<br />[💻](https://github.com/pedronauck/docz/commits?author=marceloavf "Code") [📖](https://github.com/pedronauck/docz/commits?author=marceloavf "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Amarceloavf "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/3238901?s=460&v=4" width="60px;"/><br /><sub><b>Nicholas Eduardo</b></sub>](https://github.com/nicholasess)<br />[💻](https://github.com/pedronauck/docz/commits?author=nicholasess "Code") [📖](https://github.com/pedronauck/docz/commits?author=nicholasess "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Anicholasess "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/3277185?v=4" width="60px;"/><br /><sub><b>Renato Ribeiro</b></sub>](http://twitter.com/renatorib_)<br />[💻](https://github.com/pedronauck/docz/commits?author=renatorib "Code") [📖](https://github.com/pedronauck/docz/commits?author=renatorib "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Arenatorib "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/13947203?v=4" width="60px;"/><br /><sub><b>Guilherme Jabur</b></sub>](https://github.com/jaburcodes)<br />[💻](https://github.com/pedronauck/docz/commits?author=jaburcodes "Code") [📖](https://github.com/pedronauck/docz/commits?author=jaburcodes "Documentation") [🐛](https://github.com/pedronauck/docz/issues?q=author%3Ajaburcodes "Bug reports") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 💪🏻 &nbsp; Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/pedronauck/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>

### 🙏🏻 &nbsp; Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/docz#backer)]

<a href="https://opencollective.com/docz#backers" target="_blank"><img src="https://opencollective.com/docz/backers.svg?width=890"></a>

### 🙌🏻 &nbsp; Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/docz#sponsor)]

<a href="https://opencollective.com/docz/sponsor/0/website" target="_blank"><img src="https://opencollective.com/docz/sponsor/0/avatar.svg"></a>

