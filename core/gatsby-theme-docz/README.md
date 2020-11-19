# gatsby-theme-docz

![](https://cdn-std.dprcdn.net/files/acc_649651/opUCiu)

The official Gatsby theme for Docz.

## Installation

```sh
yarn add gatsby gatsby-theme-docz react react-dom
```

## Usage

```js
// gatsby-config.js
module.exports = {
  plugins: ['gatsby-theme-docz'],
}
```

### Configuration

Set your config by using `doczrc.js` file ([see all available](https://www.docz.site/docs/project-configuration)) or if you want to set some defaults for your theme, use `options` on plugin definition:

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        /* your custom options */
      },
    },
  ],
}
```

### Dark Mode

To set the dark version as default, just set your `doczrc.js` like that:

```js
// doczrc.js
export default {
  themeConfig: {
    mode: 'dark',
  },
}
```

### Customizing components

Components shadowing is one of the best things included in the new Gatsby theme feature, with it is possible to replace theme files just by creating your own file following a file naming convention.

Example: If you're using our `gatsby-theme-docz` which has a `Header` component located at `src/components/Header/index.js` you can override the component by creating `src/gatsby-theme-docz/components/Header/index.js`. Cool right?

### Adding your logo

So, now that you know about how component shadowing works on Gatsby themes, if you don't want to override the entire `<Header>` component but just change your logo inside it, your can shadow the `<Logo>` component used in the header just by creating your own at `src/gatsby-theme-docz/components/Logo/index.js`

```js
// src/gatsby-theme-docz/components/Logo/index.js
import React from 'react'
import logo from './logo.svg'

export const Logo = () => <img src={logo} alt="That's my logo" />
```

Easy, right?

### Creating your own Docz theme

One of the coolest thing of Docz is that you can create your own theme if you want from scratch and use all benefits of it. The oldest way to acomplish that is by using the `theme` property inside the `doczrc.js` file. Now, if you want to create your own theme, just create a file located at `src/gatsby-theme-docz/index.js`

```js
import React from 'react'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { ThemeProvider } from '@emotion/react'
import baseComponents from 'gatsby-theme-docz/src/components'

import { Menu } from './MyBeautifulMenu'

const componentsMap = {
  ...baseComponents,
  /* your custom components */,
}

const Theme = ({ children }) => {
  const config = useConfig()
  return (
    <ThemeProvider theme={config}>
      <Menu />
      <ComponentsProvider components={baseComponents}>
        {children}
      </ComponentsProvider>
    </ThemeProvider>
  )
}

const themeConfig = {
  colors: {
    primary: 'tomato',
    secondary: 'khaki',
    gray: 'lightslategray',
  },
}

export default theme(themeConfig)(Theme)
```

### Wrapping the entire app

Sometime you need to wrap your entire application in order to add some `Provider` or just to load some script. You can do this easily inside our theme by creating a file located at `src/gatsby-theme-docz/wrapper.js`

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

## Theme UI integrated

As default theme system we are using the [Theme-UI](https://theme-ui.com/), it's a library for build consistent, themeable React apps based on constraint-based design principles.

You can modify our based theme creating your own style, combining these modifications with the component shadowing and creating a totally different documentation.

Check our [base theme object](https://github.com/pedronauck/docz/blob/feat/gatsby/core/gatsby-theme-docz/src/theme/index.js) to see the properties.

To create your own theme definition use the `doczrc.js` and set your properties in the `themeConfig` like that:

```js
// doczrc.js
export default {
  themeConfig: {
    colors: {
      header: {
        bg: 'tomato',
      },
    },
  },
}
```

Or, to create your own theme it's easy, just create this file in the root of your project: `src/gatsby-theme-docz/theme/index.js`.

```js
import baseTheme from 'gatsby-theme-docz/src/theme'
import { merge } from 'lodash/fp'

export default merge(baseTheme, {
  colors: {
    header: {
      bg: 'tomato',
    },
  },
})
```

### Changing code highlight

Both code highlights shortcodes and the `<Playground>` component are using [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight the code. If you want to modify and use another PrismJS theme, you can do that just passing a `prismTheme` property for your theme.

```js
// doczrc.js
import myCustomPrismTheme from './my-prism-theme'

export default {
  themeConfig: {
    prismTheme: myCustomPrismTheme,
  },
}
```

Or you want to have different themes for `light` and `dark` color mode, you can change the `prism` default property like that:

```js
// doczrc.js
import customLightTheme from './my-light-theme'
import customDarkTheme from './my-dark-theme'

export default {
  themeConfig: {
    prism: {
      light: customLightTheme,
      dark: customDarkTheme,
    },
  },
}
```

### Adding component shortcodes

You can add shortcodes to your docs site which can be used throughout
your docs pages by extending the components passed to MDXProvider. You
can do this by using component shadowing and creating the following file
in the root of your project: `src/gatsby-theme-docz/components/index.js`.

#### Example `components.js`

```js
import baseComponents from 'gatsby-theme-documentation/src/components'
import MyCustomH1 from '../components/my-custom-h1'

export default {
  ...baseComponents,
  h1: MyCustomH1,
}
```

## Getting data

Using our Gatsby Theme you can enjoy all our hooks to get data for your pages and also get data from Gatsby. So, you can create isolated pages on Gatsby using gatsby pages and get data from Docz or maybe pass data for your Docz documents using source from gatsby.

Imagine, that you have your home page inside `/pages` and you want to show all documents parsed from Docz. You can easy get this by doing:

```js
import React from 'react'
import { useDocs } from 'docz'

const Home = () => {
  const docs = useDocs()
  return <div>{/* my coolest home */}</div>
}

export default Home
```

Or you can have a mdx document inside Docz that has data from Gatsby too:

```markdown
---
name: MyDoc
---

import { MyComponentWithSomeData } from './my-component-with-data'

<MyComponentWithSomeData />
```

Cool right?
