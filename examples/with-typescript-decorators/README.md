# Docz with Decorators and TypeScript Example

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-with-typescript-decorators --example with-typescript-decorators
# or
yarn create docz-app docz-app-with-typescript-decorators --example with-typescript-decorators
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/master | tar -xz --strip=2 docz-master/examples/with-typescript-decorators
mv with-typescript-decorators docz-with-typescript-decorators-example
cd docz-with-typescript-decorators-example
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

And last we set "compilerOptions.experimentalDecorators" to true in tsconfig.json

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
