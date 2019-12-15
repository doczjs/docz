<p align="center" style="margin-bottom: -20px">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/BSPk3z">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/docz" target="_blank">
    <img src="https://badgen.net/npm/v/docz" alt="">
  </a>
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


- [Why ?](#why)
- [Start a New Project](#start-a-new-project)
- [Add Docz to an Existing Project](#add-docz-to-an-existing-project)
- [Build](#build)
- [Deploy](#deploy)
- [Examples](#examples)
- [More info on docz.site](#more-info-on-doczsite)
- [Used by](#used-by)
- [Contributors](#contributors)
- [Contributing](#contributing)

## Why ?

Documenting code is one of the most important and time-heavy processes when developing software.

A lot of time is spent on building and maintaining custom documentation sites.

Docz enables you to quickly create live-reloading, seo-friendly, production-ready documentation sites with MDX and customize the look, feel and behavior when required by leveraging [GatsbyJS](https://www.gatsbyjs.org) and [Gatsby theme shadowing](https://www.gatsbyjs.org/docs/themes/shadowing/).

## Start a New Project

Use [create-docz-app](https://www.npmjs.com/package/create-docz-app) to quickly get started :

```sh
npx create-docz-app my-docz-app
# or
yarn create docz-app my-docz-app --example typescript
```

## Add Docz to an Existing Project

Start by adding `docz` as a dependency :

```bash
$ yarn add docz # react react-dom

# or

$ npm install docz # react react-dom
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
   * This is a description for this prop.
   * Button type.
   */
  type: t.oneOf(['button', 'submit', 'reset']),
}
Button.defaultProps = {
  type: 'button',
}
export default Button
```

Finally, run:

```bash
yarn docz dev
```

This will start a local development server and open your documentation site in the browser.

## Build

`yarn docz build` will generate a static site for your site in `.docz/dist/`.

You can try it out with `yarn docz serve` or by serving the generated site with your favorite static file server (e.g. `npx serve .docz/dist`).

You can have `yarn docz build` emit to a different directory by providing a path to the `dest` field in your doczrc.js or from the command line : `yarn docz build --dest docs-site-directory`.

### Debug

You can render debug information about which files are being parsed by setting the `DEBUG` environment variable to `docz*`.

For example: `DEBUG=docz* yarn docz build`

## Deploy

The output of docz consists of static assets only. This allows you to deploy your generated `docz` site with any static site hosting provider you'd like.

Start by building your site with `yarn docz build`, if you haven't provided a `dest` flag to your config then you will find your generated files in `.docz/dist` to copy to the server.

## Examples

- **[basic](https://github.com/doczjs/docz/tree/master/examples/basic)** - Barebones example.
- **[gatsby](https://github.com/doczjs/docz/tree/master/examples/gatsby)** - Example using Docz in a Gastby project.
- **[react native](https://github.com/doczjs/docz/tree/master/examples/react-native)** - Using Docz in a React Native project.
- **[styled-components](https://github.com/doczjs/docz/tree/master/examples/styled-components)** - Using Docz with `styled-components`.
- **[with typescript](https://github.com/doczjs/docz/tree/master/examples/typescript)** - Using Docz with Typescript.
- **[with flow](https://github.com/doczjs/docz/tree/master/examples/flow)** - Using Docz with Flow.
- **[with images](https://github.com/doczjs/docz/tree/master/examples/images)** - Using Docz with images in mdx and jsx.

- **[with sass](https://github.com/doczjs/docz/tree/master/examples/sass)** - Using Docz parsing CSS with SASS.
- **[with less](https://github.com/doczjs/docz/tree/master/examples/less)** - Using Docz parsing CSS with LESS.
- **[with stylus](https://github.com/doczjs/docz/tree/master/examples/css-stylus)** - Using Docz parsing CSS with Stylus.
- **with css modules**: works out of the box with gatsby

You can check the complete list of docz examples [here](https://github.com/doczjs/docz/tree/master/examples).

## More info on [docz.site](https://docz.site)

## Used by

- **[Smooth UI](https://smooth-ui.smooth-code.com/)** - Modern React UI library.
- **[Set Protocol Docs](https://docs.setprotocol.com/)** - Documentation site of Set Protocol.
- **[RBX](https://dfee.github.io/rbx)** - The Comprehensive Bulma UI Framework for React.
- **[Circuit UI](https://circuit.sumup.com/#/)** - React component library for [SumUp](https://sumup.com) web apps.
- **[Fannypack](https://fannypack.style)** - A friendly & accessible React UI Kit built with [Reakit](https://reakit.io/).
- **[React Pixi](https://reactpixi.org/#/)** - React Fiber renderer for Pixi.
- **[React Hotkey Tooltip](https://react-hotkey-tooltip.netlify.com/#/)** - A global Hotkey provider with built in tooltip for React.
- **[Sajari React SDK](https://sajari-sdk-react.netlify.com/)** - Library of React Components for the Sajari.

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

<a href="https://github.com/doczjs/docz/graphs/contributors"><img src="https://opencollective.com/docz/contributors.svg?width=890&button=false" /></a>

## Contributing

All kinds of contributions are very welcome and appreciated !

If you want to contribute time to docz then here's a list of suggestions to get you started :

1. Star the project.
2. Help people in the [issues](https://github.com/doczjs/docz/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) by sharing your knowledge and experience.
3. Find and report issues.
4. Submit PRs to help solve issues or add features.
5. Influence the future of docz with feature requests.

If you're looking for a place to start make sure to check issues tagged with :

[![Good First Issue](https://img.shields.io/github/issues/doczjs/docz/good%20first%20issue.svg)](https://github.com/doczjs/docz/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

And make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

You can also contribute money to help secure docz's future.

<p align="center">
  <a href="https://opencollective.com/docz" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/Q5nVhT" height="80" alt="Open Collective">
  </a>
</p>
