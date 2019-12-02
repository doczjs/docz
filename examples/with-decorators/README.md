# Docz with Decorators Example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-decorators --example with-decorators
# or
yarn create docz-app docz-app-with-decorators --example with-decorators
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-decorators
mv with-decorators docz-with-decorators-example
cd docz-with-decorators-example
```

## Notes

To add decorator support, we create a `gatsby-node.js` in the root directory and inside configure babel to understand decorators :

```js
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `@babel/plugin-proposal-decorators`,
    options: { legacy: true },
  })
}
```

And add `@babel/plugin-proposal-decorators` as a dev dependency

```sh
yarn add -D @babel/plugin-proposal-decorators
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
