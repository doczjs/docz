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

Set your config by using `doczrc.js` file ([see all available](https://www.docz.site/docs/project-configuration)) or if you want to
set some defaults for your theme, use `options` on plugin definition:

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

Components shadowing is one of the best things included in the new Gatsby theme feature, with it is possible to replace
theme files just by creating your own file following a file naming convetion.

Example: If you're using our `gatsby-theme-docz` which has a `Header` component located at `src/components/Header/index.js`
you can override the component by creating `src/gatsby-theme-docz/components/Header/index.js`. Cool right?

So, now that you know about how component shadowing works on Gatsby themes, you can override anything inside the `gatsby-theme-docz`.

### Creating your own Docz theme

One of the coolest thing of Docz is that you can create your own theme if you want from scratch and use all benefits of it.
The oldest way to acomplish that is by using the `theme` property inside the `doczrc.js` file. Now, if you want to create
your own theme, just create a file located at `src/gatsby-theme-docz/index.js`

```js
import React from 'react'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { ThemeProvider } from 'emotion-theming'
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

Sometime you need to wrap your entire application in order to add some `Provider` or just to load some script.
You can do this easily inside our theme by creating a file located at `src/gatsby-theme-docz/wrapper.js`

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

### Customizing design tokens

As default theme system we are using the [Theme-UI](https://theme-ui.com/), it's a library for build consistent, themeable React apps
based on constraint-based design principles. So, you can modify our based theme in order to make you own style and combining
these modifications with the component shadowing, you can create a totally differente documentation very quickly.

Check our [base theme object](https://github.com/pedronauck/docz/blob/feat/gatsby/core/gatsby-theme-docz/src/theme/index.js) to see the properties.

You can modify the theme object by using `doczrc.js` files and changing the `themeConfig` property:

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

Both code highlights shortcodes and the `<Playground>` component are using [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) to highlight the code.
If you want to modify and use another PrismJS theme, you can do that just passing a `prismTheme` property for your theme.

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
