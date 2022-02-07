# Docz example with webpack aliases

## Using `create-docz-app`

```sh
npx create-docz-app docz-app-webpack-alias --example webpack-alias
# or
yarn create docz-app docz-app-webpack-alias --example webpack-alias
```

## Download manually

```sh
curl https://codeload.github.com/doczjs/docz/tar.gz/main | tar -xz --strip=2 docz-main/examples/webpack-alias
mv webpack-alias docz-webpack-alias-example
cd docz-webpack-alias-example
```

## Notes

To configure the webpack config we add a `gatsby-node.js` file and export `onCreateWebpackConfig`. More info here : https://www.gatsbyjs.org/docs/add-custom-webpack-config/

For this example, files inside `./src/` can be accessed with an absolute path. For example instead of doing `import A from './src/components/Alert` you can do `import A from 'components/Alert'`.

Another alias is set in place to map files in `./src/components/` to `@`. For example instead of doing `import A from './src/components/Alert` you can do `import A from '@/Alert'`.

```js
// gatsby-node.js
const path = require('path')

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      // Note the '..' in the path because the docz gatsby project lives in the `.docz` directory
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        '@': path.resolve(__dirname, '../src/components/'),
      },
    },
  })
}

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
