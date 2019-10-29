## Docz React Native

Use your React Native components inside docz

> We will use [react-native-web](https://github.com/necolas/react-native-web) to make this integration possible.
> So you might face some issues if you use other react-native modules. 
> Usually, many react-native modules have a web alternative, make sure to alias them too.

## Installation

These packages are required to use React Native with docz:

```bash
$ yarn add react-native-web react-art
```

Then alias `react-native` to `react-native-web`

```js
// gatsby-node.js
exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
    },
  })
}
```

