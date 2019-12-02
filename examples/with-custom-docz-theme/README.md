# Using and Creating a Custom Docz Theme example

## Creating a docz theme

For this example we want to write a theme that wraps every page with a div that has padding and a pink background-color. You can make a theme that does as much or as little as you wish.

We start by creating the directory `gatsby-theme-docz-pink`.

Inside we're going to shadow gatsby-theme-docz. To do that we create a folder : `src/gatsby-theme-docz`, the component in particular we want to shadow is located in src/gatsby-theme-docz/wrapper.js.

```jsx
import * as React from 'react'
import OriginalWrapper from 'gatsby-theme-docz/src/wrapper'

const Wrapper = ({ children, doc }) => {
  return (
    <div style={{ background: 'pink', padding: 30 }}>
      <OriginalWrapper>{children}</OriginalWrapper>
    </div>
  )
}

export default Wrapper
```

The component doesn't do much, it imports the original wrapper and wraps it in a styled div.

Next, we add a `package.json` to `gatsby-theme-docz-pink` :

```json
{
  "name": "gatsby-theme-docz-pink",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

And since we're saying that main is `index.js` we create an empty file called index.js at the root of the package in order for the bundler to know the package exists

```js
// noop
```

And that's it our theme is ready to be distributed and consumed.

You can publish it to npm or host it in a git repo and install it with your favorite package manager

## Consuming a docz theme

If the theme is published to npm we start by adding the theme as a project dependency

```
  yarn add gatsby-theme-docz-pink
```

> In this example we'll copy `gatsby-theme-docz-pink` to `node_modules/gatsby-theme-docz-pink` : `cp -r gatsby-theme-docz-pink/ node_modules/gatsby-theme-docz-pink`

Then create a gatsby-config.js file at the root of your project and in it we declare that we want to use `gatsby-theme-docz-pink` and we tell webpack to compile it because it uses JSX which is not valid JS :

```js
// gatsby-config.js

module.exports = {
  plugins: [
    'gatsby-theme-docz-pink',
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: ['gatsby-theme-docz-pink'],
      },
    },
  ],
}
```

If you run `yarn docz dev` you should see the theme take effect.

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-custom-docz-theme
# or
yarn create docz-app docz-app-with-custom-docz-theme
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-custom-docz-theme
mv with-custom-docz-theme docz-with-custom-docz-theme-example
cd docz-with-custom-docz-theme-example
```

## Setup

```sh
yarn # npm i
```

## Run

```sh
yarn dev # npm run dev
```

## Build

```sh
yarn build # npm run build
```

## Serve built app

```sh
yarn serve # npm run serve
```
